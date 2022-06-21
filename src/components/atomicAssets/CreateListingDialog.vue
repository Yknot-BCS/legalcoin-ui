<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { IMarketAsset } from 'atomicmarket/build/API/Explorer/Objects';
import { Asset } from '@greymass/eosio';

export default defineComponent({
  name: 'CreateListingDialog',
  components: {},
  props: {
    assetData: {
      type: Object as PropType<IMarketAsset>,
      required: true
    },
    showListingDialog: {
      type: Boolean as PropType<boolean>,
      required: true
    }
  },
  emits: ['update:showListingDialog', 'updateAssetInfo'],
  setup() {
    return {
      listingType: ref('sale'),
      aucPrice: ref(0),
      aucTDays: ref(0),
      aucTHours: ref(0),
      aucTMins: ref(0),
      listPrice: ref(0),
      transaction: null
    };
  },
  computed: {
    ...mapGetters({
      accountName: 'account/cryptoAccountName'
    }),
    // Create Listing Dialog
    aucDuration() {
      let daysToSecs = this.aucTDays * 24 * 60 * 60;
      let hoursToSecs = this.aucTHours * 60 * 60;
      let minsToSecs = this.aucTMins * 60;
      return daysToSecs + hoursToSecs + minsToSecs;
    }
  },

  methods: {
    ...mapActions({ sendTransaction: 'account/sendTransaction' }),

    async listNFT() {
      let amountStr = Asset.from(
        Number(this.listPrice),
        Asset.Symbol.fromParts('WAX', 8) // FIXME input LEGAL price
      ).toString(); //'2.00000000 WAX'
      let actions: unknown = [
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
        this.$emit('update:showListingDialog', false);
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

    async aucNFT() {
      let amountStr = Asset.from(
        Number(this.aucPrice),
        Asset.Symbol.fromParts('WAX', 8) // FIXME input LEGAL price
      ).toString(); //'2.00000000 WAX'

      let actions = [
        {
          account: 'atomicmarket',
          name: 'announceauct',
          data: {
            seller: this.accountName as string,
            asset_ids: [this.assetData.asset_id],
            starting_bid: amountStr,
            duration: this.aucDuration,
            maker_marketplace: ''
          }
        },
        {
          account: 'atomicassets',
          name: 'transfer',
          data: {
            from: this.accountName as string,
            to: 'atomicmarket',
            asset_ids: [this.assetData.asset_id],
            memo: 'auction'
          }
        }
      ];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.transaction = await this.sendTransaction({ actions });
    },

    async tryAucNFT() {
      console.log('try listing');
      try {
        await this.aucNFT();
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          message: 'Complete'
        });
        this.$emit('update:showListingDialog', false);
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
    }
  }
});
</script>

<template lang="pug">
q-dialog(v-model='showListingDialog')
  q-card
    q-tabs(v-model='listingType')
      q-tab(name='sale', label='Sale')
      q-tab(name='auction', label='Auction')

    q-tab-panels(v-model='listingType')
      q-tab-panel(name='sale')
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
            label='CONFIRM',
            color='primary'
          )
          q-btn(
            @click='$emit("update:showListingDialog", false)',
            label='CANCEL',
            color='primary'
          )
      q-tab-panel(name='auction')
        q-card-section
          .text-bold
            | Starting Price
          q-input(
            v-model='aucPrice',
            type='number',
            label='Price (LEGAL)',
            outlined
          )
          .text-bold.q-mt-md
            | Duration
          .row
            q-input.col-4.q-pr-sm(
              v-model='aucTDays',
              type='number',
              label='Days',
              outlined
            )
            q-input.col-4.q-pr-sm(
              v-model='aucTHours',
              type='number',
              label='Hours',
              outlined
            )
            q-input.col-4(
              v-model='aucTMins',
              type='number',
              label='Minutes',
              outlined
            )
        q-card-section
          q-btn.q-mr-sm(@click='tryAucNFT()', label='CONFIRM', color='primary')
          q-btn(
            @click='$emit("update:showListingDialog", false)',
            label='CANCEL',
            color='primary'
          )
</template>

<style lang="sass"></style>
