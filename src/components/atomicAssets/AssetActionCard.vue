<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { IAsset } from 'atomicassets/build/API/Explorer/Objects';
import { IMarketPrice, ISale } from 'atomicmarket/build/API/Explorer/Objects';
import Timeline from 'src/components/atomicAssets/TimeLine.vue';
import { mapGetters, mapActions } from 'vuex';

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
    }
  },
  setup() {
    return {
      quantity: ref(1),
      price: ref(500),
      transactionId: ref<string>(null),
      transactionError: null
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

    salePrice(): IMarketPrice {
      return this.saleData.price;
    }
  },
  mounted() {
    // Check if asset is being offered

    console.log(this.assetData);
    console.log(this.saleData);
  },
  methods: {
    ...mapActions({ sendTransaction: 'account/sendTransaction' }),
    buyOffer() {
      console.log('buyOffer');

      //   {"expiration": "2022-05-31T15:00:28",
      //   "ref_block_num": 32172,
      //   "ref_block_prefix": 4133901082,
      //   "max_net_usage_words": 0,
      //   "max_cpu_usage_ms": 0,
      //   "delay_sec": 0,
      //   "context_free_actions": [],
      // "actions": [
      //   {
      //     "account": "atomicmarket",
      //     "name": "assertsale",
      //     "authorization": [
      //       {
      //         "actor": "dewiteleport",
      //         "permission": "active"
      //       }
      //     ],
      //     "data": {
      //       "sale_id": 32186,
      //       "asset_ids_to_assert": [
      //         "1099532301071"
      //       ],
      //       "listing_price_to_assert": "5.00000000 WAX",
      //       "settlement_symbol_to_assert": "8,WAX"
      //     }
      //   },
      //   {
      //     "account": "eosio.token",
      //     "name": "transfer",
      //     "authorization": [
      //       {
      //         "actor": "dewiteleport",
      //         "permission": "active"
      //       }
      //     ],
      //     "data": {
      //       "from": "dewiteleport",
      //       "to": "atomicmarket",
      //       "quantity": "5.00000000 WAX",
      //       "memo": "deposit"
      //     }
      //   },
      //   {
      //     "account": "atomicmarket",
      //     "name": "purchasesale",
      //     "authorization": [
      //       {
      //         "actor": "dewiteleport",
      //         "permission": "active"
      //       }
      //     ],
      //     "data": {
      //       "buyer": "dewiteleport",
      //       "sale_id": 32186,
      //       "intended_delphi_median": 0,
      //       "taker_marketplace": ""
      //     }
      //   }
      // ],
      //   "transaction_extensions": []
      // }
    },
    async tryBuySale() {
      console.log('tryBuySale');
      let actions = [
        {
          account: 'atomicmarket',
          name: 'assertsale',
          data: {
            sale_id: 32186,
            asset_ids_to_assert: ['1099532301071'],
            listing_price_to_assert: '5.00000000 WAX',
            settlement_symbol_to_assert: '8,WAX'
          }
        },
        {
          account: 'eosio.token',
          name: 'transfer',
          data: {
            from: 'dewiteleport',
            to: 'atomicmarket',
            quantity: '5.00000000 WAX',
            memo: 'deposit'
          }
        },
        {
          account: 'atomicmarket',
          name: 'purchasesale',
          data: {
            buyer: 'dewiteleport',
            sale_id: 32186,
            intended_delphi_median: 0,
            taker_marketplace: ''
          }
        }
      ];
      await this.sendTransaction({ actions });
    }
  }
});
</script>

<template lang="pug">
q-card 
  q-card-section
    //- name
    .text-bold
      | {{ assetData?.data?.name }}
    //- by
    .row.justify-between.items-center.fit.wrap
      .col-10.text-italic.text-subtitle1
        | by
        | {{ assetData?.collection?.author }}
      //- expected yield?
      //- share icon
      .col-2.row.justify-center
        q-icon(name='share', size='sm')
    //- timeline
    Timeline(
      startDate='2021/04/30',
      maturityDate='2024/04/30',
      expiryDate='2027/04/30'
    )
    //- when buying, show price, days to maturity, quantity, and total cost, with buy button
    .row.justify-between.q-mt-lg
      .col-6
        .column.content-start 
          | Purchase Price
          .text-subtitle1
            | {{ price }} LEGAL
      .col-6
        .column.content-end.items-end
          | Days to Maturity
          .text-subtitle1
            | 30 days
    .row.justify-between.q-mt-lg
      .col-3
        q-input(v-model='quantity', type='number', label='Quantity', outlined)
      .col-6
        .column.content-end.items-end
          | Total
          .text-subtitle1
            | {{ quantity * price }} LEGAL

    q-btn.full-width.q-mt-lg(
      @click='tryBuySale()',
      label='BUY',
      color='primary'
    )

    //- when owning, show price, days to maturity, with sell button

    //- when mature, show claim button

    | owned: {{ isOwned }}
</template>

<style lang="sass"></style>
