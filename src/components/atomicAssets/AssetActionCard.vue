<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import {
  ISale,
  IBuyoffer,
  IMarketOffer,
  IMarketAsset,
  IAuction,
  IAuctionBid
} from 'atomicmarket/build/API/Explorer/Objects';
import Timeline from 'src/components/atomicAssets/TimeLine.vue';
import CreateListingDialog from './CreateListingDialog.vue';
import Countdown from './Countdown.vue';
import AucBidDialog from './AucBidDialog.vue';
import { mapGetters, mapActions } from 'vuex';
import { Asset, Int64 } from '@greymass/eosio';
import { date } from 'quasar';
import { copyToClipboard } from 'quasar';
import { getYield } from 'src/api/atomic_assets';

export default defineComponent({
  name: 'AssetActionCard',
  components: { Timeline, CreateListingDialog, Countdown, AucBidDialog },
  props: {
    assetData: {
      type: Object as PropType<IMarketAsset>,
      required: true
    },
    saleData: {
      type: Object as PropType<ISale>,
      required: false
    },
    buyofferData: {
      type: Object as PropType<IBuyoffer>,
      required: false
    },
    offerData: {
      type: Object as PropType<IMarketOffer>,
      required: false
    },
    aucData: {
      type: Object as PropType<IAuction>,
      required: false
    }
  },
  setup() {
    return {
      quantity: ref(1),
      transaction: null,
      pollAsset: null,
      showListingDialog: ref(false),
      showAucDialog: ref(false)
    };
  },

  computed: {
    ...mapGetters({
      accountName: 'account/getAccountName'
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

    hasOffer() {
      return !!this.offerData;
    },

    isClaimable() {
      if (this.hasOffer) {
        if (this.offerData.sender_name === process.env.AA_BUYBACK_ACCOUNT) {
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
        if (daysToMaturity >= 0) {
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
      if (this.assetData) {
        return getYield(
          this.assetData?.data?.mintprice,
          this.assetData?.data?.maturedvalue
        );
      } else {
        return '0';
      }
    },

    // ---------------------------
    // Auction relevant properties
    // ---------------------------
    isOnAuction() {
      if (
        !!this.aucData &&
        !this.aucData.claimed_by_buyer &&
        !this.aucData.claimed_by_seller
      ) {
        return true;
      } else {
        return false;
      }
    },

    isAucSeller() {
      return this.accountName === this.aucData?.seller;
    },

    bids(): IAuctionBid[] {
      if (this.isOnAuction) {
        return this.aucData?.bids;
      } else {
        return [];
      }
    },

    // get the highest bid
    highestBid() {
      if (this.isOnAuction) {
        if (this.bids?.length > 0) {
          // take the bids and get the max amount
          let topBid = this.bids?.reduce((a, b) => {
            return a.amount > b.amount ? a : b;
          });
          let topValue = topBid?.amount || 0;
          return topValue;
        } else {
          return undefined;
        }
      } else {
        return undefined;
      }
    },

    // Show highest bid, otherwise show starting price
    highestBidDisplay() {
      if (this.highestBid) {
        let bidAsset = Asset.fromUnits(
          Int64.from(this.highestBid),
          Asset.Symbol.fromParts(
            this.aucData?.price?.token_symbol,
            this.aucData?.price?.token_precision
          )
        );
        return bidAsset;
      } else {
        let startPriceAsset = Asset.fromUnits(
          Int64.from(this.aucData.price.amount),
          Asset.Symbol.fromParts(
            this.aucData.price?.token_symbol,
            this.aucData?.price?.token_precision
          )
        );
        return startPriceAsset;
      }
    }
  },
  mounted() {
    if (this.assetData.asset_id) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this.pollAsset = setInterval(() => {
        void this.$emit('updateAssetInfo');
      }, 5000);
    }
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

    async acceptBuyOffer() {
      let actions: unknown = [
        {
          account: 'atomicassets',
          name: 'createoffer',
          data: {
            sender: this.accountName as string,
            recipient: process.env.ATOMICMARKET,
            sender_asset_ids: [this.buyofferData.assets[0].asset_id],
            recipient_asset_ids: [],
            memo: 'buyoffer'
          }
        },
        {
          account: process.env.ATOMICMARKET,
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

    async tryAcceptBuyOffer() {
      console.log('try acceptBuyOffer');
      try {
        await this.acceptBuyOffer();
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

    async acceptOffer() {
      let actions: unknown = [
        {
          account: 'atomicassets',
          name: 'acceptoffer',
          data: {
            offer_id: this.offerData.offer_id
          }
        }
      ];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.transaction = await this.sendTransaction({ actions });
    },

    async tryAcceptOffer() {
      console.log('try claim');
      try {
        await this.acceptOffer();
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

    async cancelListing() {
      let actions: unknown = [
        {
          account: process.env.ATOMICMARKET,
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

    async aucClaimSel() {
      let actions: unknown = [
        {
          account: process.env.ATOMICMARKET,
          name: 'auctclaimsel',
          data: {
            auction_id: this.aucData.auction_id
          }
        }
      ];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.transaction = await this.sendTransaction({ actions });
    },

    async tryAucClaimSel() {
      console.log('try auction claim');
      try {
        await this.aucClaimSel();
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          message: 'Claimed'
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

    async aucClaimBuy() {
      let actions: unknown = [
        {
          account: process.env.ATOMICMARKET,
          name: 'auctclaimbuy',
          data: {
            auction_id: this.aucData.auction_id
          }
        }
      ];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.transaction = await this.sendTransaction({ actions });
    },

    async tryAucClaimBuy() {
      console.log('try auction claim');
      try {
        await this.aucClaimBuy();
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          message: 'Claimed'
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

    async cancelAuc() {
      let actions: unknown = [
        {
          account: process.env.ATOMICMARKET,
          name: 'cancelauct',
          data: {
            auction_id: this.aucData.auction_id
          }
        }
      ];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.transaction = await this.sendTransaction({ actions });
    },

    async tryCancelAuction() {
      console.log('try auction cancel');
      try {
        await this.cancelAuc();
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          message: 'Cancelled'
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
    .text-bold.text-NFTCard-heading.text-grey-10
      | {{ assetData?.data?.name }}
    //- by
    .row.justify-between.items-center.fit.wrap
      .col-10.text-italic.text-subtitle2.column
        .col(v-if='isOnAuction')
          //- router-link(
          //-   :to='{ name: "profile", params: { profile: aucData?.seller } }'
          //- )
          | Seller: {{ aucData?.seller }}
        .col(v-else) 
          //- TODO hyperlink this to profile page
          //- router-link(
          //-   :to='{ name: "profile", params: { profile: assetData?.data?.owner } }'
          //- )
          | Owner: {{ assetData?.owner }}
      //- share icon
      .col-2.row.justify-center
        q-btn(icon='share', size='md', @click='shareURL', round)

    //- expected yield?
<<<<<<< HEAD
    .row.justify-center.items-center.fit.wrap 
=======
    .row.fit.wrap 
>>>>>>> develop
      .text-subtitle2 Expected yield: {{ expectedYield }}
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
          .column.content-start.text-NFTCard-price-head.text-grey-10
            | Purchase Price
            .text-NFTCard-price-value.text-grey-10
              | {{ priceStr }}
        .col-6
          .column.content-end.items-end.text-NFTCard-price-head.text-grey-10
            | Days to Maturity
            .text-NFTCard-price-value.text-grey-10
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
          .column.content-end.items-end.text-NFTCard-price-head.text-grey-10
            | Total
            .text-NFTCard-price-value.text-grey-10
              | {{ priceStr }}

      q-btn.full-width.q-mt-lg(
        @click='tryBuySale()',
        label='BUY',
        color='primary'
      )
    //- when owning, with list on market button
    .div(v-if='isOwned && !isForSale && !isOnAuction')
      q-btn.full-width.q-mt-lg(
        @click='showListingDialog = true',
        label='LIST ON MARKET',
        color='primary'
      )
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
    //- when mature, show acceptBuyOffer button
    .div(v-if='isClaimable')
      q-btn.full-width.q-mt-lg(
        @click='tryAcceptOffer()',
        label='CLAIM',
        color='primary'
      )

    //- when on auction, show highest bid and time left
    //- Sates: 1: Listed, 2: Cancelled, 3: SOLD, 4: Invalid/Done No bids
    q-card-section(
      v-if='isOnAuction && (aucData?.state === 1 || aucData?.state === 4)'
    )
      //- Countdown component
      q-card-section
        Countdown(:endDate='new Date(Number(aucData?.end_time))')

      q-separator(color='primary')

      q-card-section
        //- Starting value if no bids
        .column(v-if='aucData?.bids?.length === 0')
          .text-grey-9 No bids - Starting value
          .text-bold {{ highestBidDisplay }}

        //- Top bid, with bid button
        .column(v-else)
          .text-grey-9 Top bid
          .text-bold {{ highestBidDisplay }}
        q-btn.full-width.q-mt-lg(
          v-if='!isAucSeller && aucData?.state !== 4',
          @click='showAucDialog = true',
          label='Place Bid',
          color='primary'
        )

    //- when on auction and is seller, show cancel auction button or claim button
    q-card-section(
      v-if='isOnAuction && isAucSeller && !aucData.claimed_by_seller'
    )
      //- Cancel auction button,
      q-btn.full-width(
        v-if='aucData?.state === 1 || aucData?.state === 4',
        @click='tryCancelAuction()',
        label='CANCEL AUCTION',
        color='primary'
      )
      //- Claim auction button
      q-btn.full-width(
        v-if='aucData?.state == 3',
        @click='tryAucClaimSel()',
        label='CLAIM AUCTION',
        color='primary'
      )

    //- when on auction and is buyer, show claim auction button
    q-card-section(
      v-if='isOnAuction && !isAucSeller && !aucData.claimed_by_buyer && aucData.buyer == accountName && aucData.state == 3'
    )
      //- Claim auction button
      q-btn.full-width(
        @click='tryAucClaimBuy()',
        label='CLAIM AUCTION',
        color='primary'
      )

    //- | owned: {{ isOwned }},
    //- | for sale: {{ isForSale }},
    //- | is buybacknft: {{ isBuybackNFT }},
    //- | is owned by LC: {{ isOwnedByLC }},
    //- | has buy offer: {{ hasBuyOrder }},
    //- | has offer: {{ hasOffer }},
    //- | can claim: {{ isClaimable }},
    //- | is on auction: {{ isOnAuction }},
    //- | is auc seller: {{ isAucSeller }},

    //- | bid: {{ bids }}
    //- | top value: {{ highestBid }}

    //- list on market dialog
    CreateListingDialog(
      :assetData='assetData',
      v-model='showListingDialog',
      @update:showListingDialog='showListingDialog = $event',
      @update-asset-info='$emit("updateAssetInfo", $event)'
    )

    //- auction dialog
    AucBidDialog(
      :aucData='aucData',
      v-model='showAucDialog',
      @update:showAucDialog='showAucDialog = $event',
      @update-asset-info='$emit("updateAssetInfo", $event)'
    )
</template>

<style lang="sass"></style>
