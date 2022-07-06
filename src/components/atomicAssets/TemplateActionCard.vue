<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { ITemplate } from 'atomicassets/build/API/Explorer/Objects';
import { ISale } from 'atomicmarket/build/API/Explorer/Objects';
import Timeline from 'src/components/atomicAssets/TimeLine.vue';
import { mapGetters, mapActions } from 'vuex';
import { Asset, Int64 } from '@greymass/eosio';
import { date } from 'quasar';
import { copyToClipboard } from 'quasar';
import { getYield } from 'src/api/atomic_assets';

export default defineComponent({
  name: 'TemplateActionCard',
  components: { Timeline },
  props: {
    templateData: {
      type: Object as PropType<ITemplate>,
      required: true
    },
    saleData: {
      type: Object as PropType<ISale>,
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
      accountName: 'account/getAccountName'
    }),

    isForSale() {
      return !!this.saleData || this.saleData?.price !== undefined;
    },

    isBuybackNFT() {
      return !!this.templateData?.immutable_data['saleopen'];
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

    saleopenDate() {
      return new Date(
        Number(this.templateData?.immutable_data.saleopen) * 1000
      );
    },

    maturityDate() {
      if (this.isBuybackNFT) {
        let maturityDate = date.addToDate(this.saleopenDate, {
          days: this.templateData?.immutable_data?.term as number
        });
        return maturityDate;
      } else return undefined;
    },

    expiryDate() {
      if (this.isBuybackNFT) {
        let expiryDate = date.addToDate(this.maturityDate, {
          days: this.templateData?.immutable_data?.expiry as number
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
    },

    expectedYield() {
      if (this.templateData) {
        return getYield(
          this.templateData?.immutable_data?.mintprice,
          this.templateData?.immutable_data?.maturedvalue
        );
      } else {
        return '0';
      }
    }
  },
  mounted() {
    // if (this.assetData.asset_id) {
    //   // eslint-disable-next-line @typescript-eslint/no-misused-promises
    //   this.pollAsset = setInterval(() => {
    //     void this.$emit('updateAssetInfo');
    //   }, 10000);
    // }
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
          account: process.env.ATOMICMARKET,
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
            to: process.env.ATOMICMARKET,
            quantity: amountStr,
            memo: 'deposit'
          }
        },
        {
          account: process.env.ATOMICMARKET,
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
      | {{ templateData?.immutable_data?.name }}
    //- by
    .row.justify-between.items-center.fit.wrap
      .col-10.text-italic.text-subtitle1.column
        .col 
          | by: {{ templateData?.collection.authorized_accounts[0] === 'admin.lc' ? 'LegalCoin' : templateData?.collection.authorized_accounts[0] }}
          q-icon.q-ml-sm(name='fa-solid fa-circle-check', color='green')
      //- share icon
      .col-2.row.justify-center
        q-btn(icon='share', size='md', @click='shareURL', round)

    //- expected yield
    .row.justify-center.items-center.fit.wrap 
      .text-subtitle1 Expected yield: {{ expectedYield }}

    //- timeline
    Timeline(
      v-if='isBuybackNFT',
      :startDate='saleopenDate',
      :maturityDate='maturityDate',
      :expiryDate='expiryDate'
    )
    //- when buying, show price, days to maturity, quantity, and total cost, with buy button
    .div(v-if='isForSale')
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

    //- | owned: {{ isOwned }},
    //- | for sale: {{ isForSale }},
    //- | is buybacknft: {{ isBuybackNFT }},
    //- | is owned by LC: {{ isOwnedByLC }},
    //- | has buy order: {{ hasBuyOrder }},
    //- | can claim: {{ isClaimable }}
</template>

<style lang="sass"></style>
