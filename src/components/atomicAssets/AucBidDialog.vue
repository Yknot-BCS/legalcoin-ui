<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { IAuction } from 'atomicmarket/build/API/Explorer/Objects';
import { Asset, Int64 } from '@greymass/eosio';

export default defineComponent({
  name: 'AuctionBidDialog',
  components: {},
  props: {
    aucData: {
      type: Object as PropType<IAuction>,
      required: true
    },
    showAucDialog: {
      type: Boolean as PropType<boolean>,
      required: false
    }
  },
  emits: ['update:showAucDialog', 'updateAssetInfo'],
  setup() {
    return {
      bidPrice: ref('0'),
      transaction: null
    };
  },
  computed: {
    ...mapGetters({
      accountName: 'account/getAccountName'
    }),

    showDialog: {
      get() {
        return this.showAucDialog;
      },
      set(value: boolean) {
        this.$emit('update:showAucDialog', value);
      }
    }
  },

  methods: {
    ...mapActions({ sendTransaction: 'account/sendTransaction' }),

    async aucPlaceBid() {
      let amountStr = Asset.fromUnits(
        Int64.from(this.aucData.price.amount),
        Asset.Symbol.fromParts(
          this.aucData.price.token_symbol,
          this.aucData.price.token_precision
        )
      ).toString();
      let actions = [
        {
          account: 'eosio.token',
          name: 'transfer',
          data: {
            from: 'fuzzytestnet',
            to: 'atomicmarket',
            quantity: amountStr,
            memo: 'deposit'
          }
        },
        {
          account: 'atomicmarket',
          name: 'auctionbid',
          data: {
            bidder: 'fuzzytestnet',
            auction_id: 16157,
            bid: '11.00000000 WAX',
            taker_marketplace: ''
          }
        }
      ];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.transaction = await this.sendTransaction({ actions });
    },

    async tryAucBid() {
      console.log('try auction bid');
      try {
        await this.aucPlaceBid();
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          message: 'Bid placed'
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
    }
  }
});
</script>

<template lang="pug">
q-dialog(v-model='showDialog')
  q-card
    q-card-section
      .text-bold
        | Bid Price
      q-input(
        v-model='bidPrice',
        type='number',
        label='Price (LEGAL)',
        outlined
      )
    q-card-section
      q-btn.q-mr-sm(@click='tryAucBid()', label='PLACE BID', color='primary')
      q-btn(
        @click='$emit("update:showAucDialog", false)',
        label='CANCEL',
        color='primary'
      )
</template>

<style lang="sass"></style>
