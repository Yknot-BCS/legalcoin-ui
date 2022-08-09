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
  emits: ['updateAssetInfo'],
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
      type: Object as PropType<IAuction[]>,
      required: false
    }
  },
  setup() {
    return {
      quantity: ref(1),
      transaction: null,
      pollAsset: null,
      showListingDialog: ref(false),
      showAucDialog: ref(false),
      balance: ref('0')
    };
  },

  computed: {
    ...mapGetters({
      accountName: 'account/getAccountName',
      isAuthenticated: 'account/isAuthenticated'
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
      return !!this.saleData && this.saleData?.price !== undefined;
    },

    isOwnedByLC() {
      return this.assetData.owner === process.env.AA_ACCOUNT;
    },

    isBuybackNFT() {
      return !!this.assetData?.data['term'];
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

    shareURL(): string {
      return window.location.origin + this.$route.path;
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
    currentAucData() {
      if (this.aucData.length > 0) {
        return this.aucData?.[0];
      } else {
        return undefined;
      }
    },

    isOnAuction() {
      if (!!this.currentAucData) {
        console.log('currentAucData', this.currentAucData);
        return true;
      } else {
        return false;
      }
    },

    isAucSeller() {
      return this.accountName === this.currentAucData?.seller;
    },

    bids(): IAuctionBid[] {
      if (this.isOnAuction) {
        return this.currentAucData?.bids;
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
            this.currentAucData?.price?.token_symbol,
            this.currentAucData?.price?.token_precision
          )
        );
        return bidAsset;
      } else {
        let startPriceAsset = Asset.fromUnits(
          Int64.from(this.currentAucData.price.amount),
          Asset.Symbol.fromParts(
            this.currentAucData.price?.token_symbol,
            this.currentAucData?.price?.token_precision
          )
        );
        return startPriceAsset;
      }
    },

    hasEnoughBalance() {
      if (this.isForSale) {
        return Number(this.balance) >= this.salePrice;
      } else {
        return false;
      }
    }
  },
  async mounted() {
    if (this.assetData.asset_id) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this.pollAsset = setInterval(() => {
        void this.$emit('updateAssetInfo');
      }, 5000);
    }

    // Get balance
    await this.getBalance();
  },
  watch: {
    async isForSale() {
      if (this.isForSale) {
        await this.getBalance();
      }
    }
  },
  beforeUnmount() {
    clearInterval(this.pollAsset);
  },

  methods: {
    ...mapActions({ sendTransaction: 'account/sendTransaction' }),

    async getBalance() {
      if (this.isAuthenticated && this.isForSale) {
        const tokenBal: Asset[] = await this.$api.getTokenBalances(
          this.saleData.price.token_contract,
          this.accountName
        );
        if (tokenBal.length > 0) {
          this.balance = tokenBal[0].value.toFixed(2);
        }
      }
    },

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
          message: 'Complete',
          actions: [
            {
              label: 'View in profile',
              color: 'white',
              handler: () => {
                void this.$router.push({
                  name: 'profile',
                  params: { profile: this.accountName as string }
                });
              }
            }
          ]
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
            auction_id: this.currentAucData.auction_id
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
            auction_id: this.currentAucData.auction_id
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
            auction_id: this.currentAucData.auction_id
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

    clipboardURL() {
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
          .row.justify-start
            .col-shrink
              | Seller:
            .col-shrink.q-pl-xs
              router-link(
                :to='{ name: "profile", params: { profile: currentAucData?.seller != undefined ? currentAucData?.seller : "loading" } }'
              )
                | {{ isAucSeller ? 'You' : currentAucData?.seller }}
        .col(v-else) 
          //- TODO hyperlink this to profile page
          .row.justify-start
            .col-shrink
              | Owner:
            .col-shrink.q-pl-xs
              router-link(
                :to='{ name: "profile", params: { profile: assetData?.owner } }'
              )
                | {{ isOwned ? 'You' : assetData?.owner }}
      //- share icon
      .col-2.row.justify-center
        q-btn.text-body2(icon='share', round, size='md')
        q-menu.q-mt-sm(:offset='[120, 10]')
          q-list
            q-item(
              clickable,
              v-close-popup,
              :href='`http://twitter.com/intent/tweet?text=Check%20out%20this%20collection%20on%20LegalCoin:&url=${shareURL}`',
              target='_blank'
            )
              q-item-section
                .row.items-center
                  .col-shrink.q-pr-sm
                    q-icon(name='fab fa-twitter', size='2rem', color='blue')
                  .col.text-bold Share to Twitter
            q-separator
            //- Facebook link doesn't work with locally hosted app, but if provided with valid web URL will work
            q-item(
              clickable,
              v-close-popup,
              :href='`https://www.facebook.com/sharer/sharer.php?u=${shareURL}`',
              target='_blank'
            )
              q-item-section
                .row.items-center
                  .col-shrink.q-pr-sm
                    q-icon(
                      name='fab fa-facebook',
                      size='2rem',
                      style='color: #4267b2'
                    )
                  .col.text-bold Share to Facebook

            q-separator
            q-item(clickable, v-close-popup, @click='clipboardURL')
              q-item-section
                .row.items-center
                  .col-shrink.q-pr-sm
                    q-icon(name='fa fa-clipboard', size='2rem')
                  .col.text-bold Copy link

    //- expected yield?
    .row.fit.wrap 
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
        color='primary',
        :disabled='!isAuthenticated',
        v-if='hasEnoughBalance'
      )
        q-tooltip.tooltip(v-if='!isAuthenticated') Please log in

      //- if not enough balance, show insufficient buy LEGAL button
      .q-mt-lg.text-center.text-NFTCard-price-head.text-red(
        v-if='!hasEnoughBalance'
      )
        | Insufficient balance: {{ balance }} {{ saleData.price.token_symbol }}
      q-btn.full-width.q-mt-md(
        :to='{ name: "buytokens", params: { status: "checkout" } }',
        label='BUY MORE LEGAL TOKENS',
        color='primary',
        :disable='!isAuthenticated',
        v-if='!hasEnoughBalance'
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
        color='primary',
        :disable='!isAuthenticated'
      )
        q-tooltip.tooltip(v-if='!isAuthenticated') Please log in

    //- when on auction, show highest bid and time left
    //- Sates: 1: Listed, 2: Cancelled, 3: SOLD, 4: Invalid/Done No bids
    q-card-section(
      v-if='isOnAuction && (currentAucData?.state === 1 || currentAucData?.state === 4)'
    )
      //- Countdown component
      q-card-section
        Countdown(:endDate='new Date(Number(currentAucData?.end_time))')

      q-separator(color='primary')

      q-card-section
        //- Starting value if no bids
        .column(v-if='currentAucData?.bids?.length === 0')
          .text-grey-9 No bids - Starting value
          .text-bold {{ highestBidDisplay }}

        //- Top bid, with bid button
        .column(v-else)
          .text-grey-9 Top bid - {{ currentAucData?.bids[currentAucData?.bids?.length - 1]?.account }}
          .text-bold {{ highestBidDisplay }}
        q-btn.full-width.q-mt-lg(
          v-if='!isAucSeller && currentAucData?.state !== 4',
          @click='showAucDialog = true',
          label='Place Bid',
          color='primary',
          :disable='!isAuthenticated || Number(currentAucData.end_time) < Date.now()'
        )
          q-tooltip.tooltip(v-if='!isAuthenticated') Please log in

    //- when on auction and is seller, show cancel auction button or claim button
    q-card-section(
      v-if='isOnAuction && isAucSeller && !currentAucData.claimed_by_seller'
    )
      //- Cancel auction button,
      q-btn.full-width(
        v-if='currentAucData?.state === 1 || currentAucData?.state === 4',
        @click='tryCancelAuction()',
        label='CANCEL AUCTION',
        color='primary'
      )
      //- Claim auction button
      q-btn.full-width(
        v-if='currentAucData?.state == 3',
        @click='tryAucClaimSel()',
        label='CLAIM AUCTION FUNDS',
        color='primary'
      )

    //- when on auction and is buyer, show claim auction button
    q-card-section(
      v-if='isOnAuction && !isAucSeller && !currentAucData.claimed_by_buyer && currentAucData.buyer == accountName && currentAucData.state == 3'
    )
      //- Claim auction button
      q-btn.full-width(
        @click='tryAucClaimBuy()',
        label='CLAIM AUCTION ASSET',
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
    //- | auctdata: {{ currentAucData }}

    //- list on market dialog
    CreateListingDialog(
      :assetData='assetData',
      v-model='showListingDialog',
      @update:showListingDialog='showListingDialog = $event',
      @update-asset-info='$emit("updateAssetInfo", $event)'
    )

    //- auction dialog
    AucBidDialog(
      v-if='isOnAuction',
      :aucData='currentAucData',
      v-model='showAucDialog',
      @update:showAucDialog='showAucDialog = $event',
      @update-asset-info='$emit("updateAssetInfo", $event)'
    )
</template>

<style lang="sass">
a
  text-decoration: none
  color: blue
</style>
