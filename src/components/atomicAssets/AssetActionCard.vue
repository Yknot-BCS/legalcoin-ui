<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { IAsset } from 'atomicassets/build/API/Explorer/Objects';
import { ISale, IBuyoffer } from 'atomicmarket/build/API/Explorer/Objects';
import Timeline from 'src/components/atomicAssets/TimeLine.vue';
import { mapGetters, mapActions } from 'vuex';
import { Asset, Int64 } from '@greymass/eosio';
import { date } from 'quasar';
import { copyToClipboard } from 'quasar';

export default defineComponent({
  name: 'AssetActionCard',
  components: { Timeline },
  props: {
    assetData: {
      type: Object as PropType<IAsset>,
      required: true
    },
    saleData: {
      type: Object as PropType<ISale>,
      required: true
    },
    buyofferData: {
      type: Object as PropType<IBuyoffer>,
      required: true
    }
  },
  setup() {
    return {
      quantity: ref(1),
      transaction: null,
      pollAsset: null,
      listPrice: ref(0),
      showListingDialog: ref(false)
    };
  },

  computed: {
    ...mapGetters({
      accountName: 'account/cryptoAccountName'
    }),
    isOwned() {
      // Check if the current user is the owner of the asset
      if (this.accountName === this.assetData.owner) {
        return true;
      } else {
        return false;
      }
    },

    isForSale() {
      return !!this.saleData || this.saleData?.price !== undefined;
    },

    isOwnedByLC() {
      return this.assetData.owner === process.env.AA_ACCOUNT;
    },

    isBuybackNFT() {
      return !!this.assetData?.data['saleopen'];
    },

    isMatured() {
      if (
        Date.now() > this.maturityDate.getTime() &&
        Date.now() < this.expiryDate.getTime()
      ) {
        return true;
      } else {
        return false;
      }
    },

    isExpired() {
      if (Date.now() > this.expiryDate.getTime()) {
        return true;
      } else {
        return false;
      }
    },

    hasBuyOrder() {
      return !!this.buyofferData;
    },

    isClaimable() {
      if (this.hasBuyOrder) {
        if (this.buyofferData.buyer === process.env.AA_ACCOUNT) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },

    saleopenDate() {
      return new Date(Number(this.assetData.data.saleopen) * 1000);
    },

    maturityDate() {
      if (this.isBuybackNFT) {
        let maturityDate = date.addToDate(this.saleopenDate, {
          days: this.assetData?.data?.term as number
        });
        return maturityDate;
      } else return undefined;
    },

    expiryDate() {
      if (this.isBuybackNFT) {
        let expiryDate = date.addToDate(this.maturityDate, {
          days: this.assetData?.data?.expiry as number
        });
        return expiryDate;
      } else return undefined;
    },

    daysToMaturity() {
      if (this.isBuybackNFT) {
        let daysToMaturity = date.getDateDiff(
          this.maturityDate,
          Date.now(),
          'days'
        );
        if (daysToMaturity > 0) {
          return `${daysToMaturity} days`;
        } else if (
          Date.now() > this.maturityDate.getTime() &&
          Date.now() < this.expiryDate.getTime()
        ) {
          return 'Matured';
        } else {
          return 'Expired';
        }
      } else return undefined;
    },

    priceAsset() {
      if (this.saleData?.price) {
        return Asset.fromUnits(
          Int64.from(this.saleData?.price?.amount),
          Asset.Symbol.fromParts(
            this.saleData?.price?.token_symbol,
            this.saleData?.price?.token_precision
          )
        );
      } else {
        return Asset.from('0.00 LEGAL');
      }
    },

    salePrice(): number {
      console.log('price', this.saleData?.price);
      return this.priceAsset.value || 0;
    },

    priceStr(): string {
      if (this.saleData?.price !== undefined) {
        return this.priceAsset.toString();
      } else {
        return 'loading';
      }
    }
  },
  mounted() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.pollAsset = setInterval(() => {
      void this.$emit('updateAssetInfo');
    }, 10000);
  },
  beforeUnmount() {
    clearInterval(this.pollAsset);
  },

  methods: {
    ...mapActions({ sendTransaction: 'account/sendTransaction' }),

    async buySale() {
      console.log('tryBuySale');
      let amountStr = Asset.fromUnits(
        Int64.from(this.saleData.price.amount),
        Asset.Symbol.fromParts(
          this.saleData.price.token_symbol,
          this.saleData.price.token_precision
        )
      ).toString();

      let actions = [
        {
          account: 'atomicmarket',
          name: 'assertsale',
          data: {
            sale_id: this.saleData.sale_id,
            asset_ids_to_assert: this.saleData.assets.map((a) => a.asset_id), // ['123412341234']
            listing_price_to_assert: amountStr, //'5.00000000 WAX'
            settlement_symbol_to_assert: Asset.Symbol.fromParts(
              this.saleData.price.token_symbol,
              this.saleData.price.token_precision
            ).toString() //'8,WAX'
          }
        },
        {
          account: this.saleData.price.token_contract,
          name: 'transfer',
          data: {
            from: this.accountName as string,
            to: 'atomicmarket',
            quantity: amountStr,
            memo: 'deposit'
          }
        },
        {
          account: 'atomicmarket',
          name: 'purchasesale',
          data: {
            buyer: this.accountName as string,
            sale_id: this.saleData.sale_id,
            intended_delphi_median: 0,
            taker_marketplace: ''
          }
        }
      ];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.transaction = await this.sendTransaction({ actions });
    },

    async tryBuySale() {
      try {
        await this.buySale();
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          message: 'Complete'
        });
        this.$emit('updateAssetInfo');
      } catch (e: unknown) {
        if (typeof e === 'string') {
          e.toUpperCase(); // works, `e` narrowed to string
        } else if (e instanceof Error) {
          this.$q.notify({
            color: 'red-4',
            textColor: 'white',
            message: e.message,
            timeout: 5000
          });
        }
      }
    },

    async claim() {
      let actions: any = [
        {
          account: 'atomicassets',
          name: 'createoffer',
          data: {
            sender: this.accountName as string,
            recipient: 'atomicmarket',
            sender_asset_ids: [this.buyofferData.assets[0].asset_id],
            recipient_asset_ids: [],
            memo: 'buyoffer'
          }
        },
        {
          account: 'atomicmarket',
          name: 'acceptbuyo',
          data: {
            buyoffer_id: this.buyofferData.buyoffer_id,
            expected_asset_ids: [this.buyofferData.assets[0].asset_id],
            expected_price: Asset.fromUnits(
              Int64.from(this.buyofferData.price.amount),
              Asset.Symbol.fromParts(
                this.buyofferData.price.token_symbol,
                this.buyofferData.price.token_precision
              )
            ).toString(),
            taker_marketplace: ''
          }
        }
      ];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.transaction = await this.sendTransaction({ actions });
    },

    async tryClaim() {
      console.log('try claim');
      try {
        await this.claim();
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          message: 'Complete'
        });
        this.$emit('updateAssetInfo');
      } catch (e: unknown) {
        if (typeof e === 'string') {
          e.toUpperCase(); // works, `e` narrowed to string
        } else if (e instanceof Error) {
          this.$q.notify({
            color: 'red-4',
            textColor: 'white',
            message: e.message,
            timeout: 5000
          });
        }
      }
    },

    async listNFT() {
      let amountStr = Asset.from(
        Number(this.listPrice),
        Asset.Symbol.fromParts('WAX', 8) // FIXME input LEGAL price
      ).toString(); //'2.00000000 WAX'
      let actions: any = [
        {
          account: 'atomicmarket',
          name: 'announcesale',
          data: {
            seller: this.accountName as string,
            asset_ids: [this.assetData.asset_id],
            listing_price: amountStr,
            settlement_symbol: '8,WAX', // FIXME input LEGAL symbol
            maker_marketplace: ''
          }
        },
        {
          account: 'atomicassets',
          name: 'createoffer',
          data: {
            sender: this.accountName as string,
            recipient: 'atomicmarket',
            sender_asset_ids: [this.assetData.asset_id],
            recipient_asset_ids: [],
            memo: 'sale'
          }
        }
      ];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.transaction = await this.sendTransaction({ actions });
    },

    async tryListNFT() {
      console.log('try listing');
      try {
        await this.listNFT();
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          message: 'Complete'
        });
        this.showListingDialog = false;
        this.$emit('updateAssetInfo');
      } catch (e: unknown) {
        if (typeof e === 'string') {
          e.toUpperCase(); // works, `e` narrowed to string
        } else if (e instanceof Error) {
          this.$q.notify({
            color: 'red-4',
            textColor: 'white',
            message: e.message,
            timeout: 5000
          });
        }
      }
    },

    async cancelListing() {
      let actions: any = [
        {
          account: 'atomicmarket',
          name: 'cancelsale',
          data: {
            sale_id: this.saleData.sale_id
          }
        }
      ];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.transaction = await this.sendTransaction({ actions });
    },

    async tryCancelListing() {
      console.log('try listing');
      try {
        await this.cancelListing();
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          message: 'Complete'
        });
        this.$emit('updateAssetInfo');
      } catch (e: unknown) {
        if (typeof e === 'string') {
          e.toUpperCase(); // works, `e` narrowed to string
        } else if (e instanceof Error) {
          this.$q.notify({
            color: 'red-4',
            textColor: 'white',
            message: e.message,
            timeout: 5000
          });
        }
      }
    },

    shareURL() {
      void copyToClipboard(window.location.origin + this.$route.path).then(
        () => {
          this.$q.notify({
            color: 'positive',
            message: 'Copied URL to clipboard'
          });
        }
      );
    }
  }
});
</script>

<template lang="pug">
q-card 
  q-card-section
    //- name
    .text-bold.text-h6
      | {{ assetData?.data?.name }}
    //- by
    .row.justify-between.items-center.fit.wrap
      .col-10.text-italic.text-subtitle1.column
        .col 
          | Owner: {{ assetData?.owner }}

      //- expected yield?
      //- share icon
      .col-2.row.justify-center
        q-icon(name='share', size='sm', @click='shareURL')
    //- timeline
    Timeline(
      v-if='isBuybackNFT',
      :startDate='saleopenDate',
      :maturityDate='maturityDate',
      :expiryDate='expiryDate'
    )
    //- when buying, show price, days to maturity, quantity, and total cost, with buy button
    .div(v-if='isForSale && !isOwned')
      .row.justify-between.q-mt-lg
        .col-6
          .column.content-start 
            | Purchase Price
            .text-subtitle1
              | {{ priceStr }}
        .col-6
          .column.content-end.items-end
            | Days to Maturity
            .text-subtitle1
              | {{ daysToMaturity }}
      .row.justify-between.q-mt-lg
        .col-3
          q-input(
            v-model='quantity',
            type='number',
            label='Quantity',
            disable,
            readonly,
            outlined
          )
        .col-6
          .column.content-end.items-end
            | Total
            .text-subtitle1
              | {{ priceStr }}

      q-btn.full-width.q-mt-lg(
        @click='tryBuySale()',
        label='BUY',
        color='primary'
      )
    //- when owning, with list on market button
    //- .div(v-if='isOwned && !isForSale')
    //-   q-btn.full-width.q-mt-lg(
    //-     @click='showListingDialog = true',
    //-     label='LIST ON MARKET',
    //-     color='primary'
    //-   )
    //- when selling, show price card, with cancel listing button
    .div(v-if='isForSale && isOwned')
      q-card.bg-grey-4.row.justify-center.q-mt-lg
        .text-subtitle1
          | Listed for: {{ priceStr }}
      q-btn.full-width.q-mt-lg(
        @click='tryCancelListing()',
        label='CANCEL LISTING',
        color='primary'
      )
    //- when mature, show claim button
    .div(v-if='isClaimable')
      q-btn.full-width.q-mt-lg(
        @click='tryClaim()',
        label='CLAIM',
        color='primary'
      )

    | owned: {{ isOwned }},
    | for sale: {{ isForSale }},
    | is buybacknft: {{ isBuybackNFT }},
    | is owned by LC: {{ isOwnedByLC }},
    | has buy order: {{ hasBuyOrder }},
    | can claim: {{ isClaimable }}

    //- list on market dialog
    q-dialog(v-model='showListingDialog')
      q-card
        q-card-section
          .text-bold
            | Listing Price
          q-input(
            v-model='listPrice',
            type='number',
            label='Price (LEGAL)',
            outlined
          )
        q-card-section
          q-btn.q-mr-sm(
            @click='tryListNFT()',
            label='LIST ON MARKET',
            color='primary'
          )
          q-btn(
            @click='showListingDialog = false',
            label='CANCEL',
            color='primary'
          )
</template>

<style lang="sass"></style>
