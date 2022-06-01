<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { IAsset } from 'atomicassets/build/API/Explorer/Objects';
import { IMarketPrice, ISale } from 'atomicmarket/build/API/Explorer/Objects';
import Timeline from 'src/components/atomicAssets/TimeLine.vue';
import { mapGetters, mapActions } from 'vuex';
import { Asset, Int64 } from '@greymass/eosio';

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
      transactionError: null,
      transaction: null
    };
  },

  computed: {
    ...mapGetters({
      accountName: 'account/cryptoAccountName'
    }),
    isOwned() {
      console.log(this.assetData);
      console.log(this.saleData);
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
  },
  methods: {
    ...mapActions({ sendTransaction: 'account/sendTransaction' }),

    async buySale() {
      console.log('tryBuySale');
      console.log(
        Asset.Symbol.fromParts(
          this.saleData.price.token_symbol,
          this.saleData.price.token_precision
        ).toString()
      );
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
