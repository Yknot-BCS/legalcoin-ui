<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { IAsset } from 'atomicassets/build/API/Explorer/Objects';
import Timeline from 'src/components/atomicAssets/TimeLine.vue';

export default defineComponent({
  name: 'AssetActionCard',
  components: { Timeline },
  props: {
    assetData: {
      type: Object as PropType<IAsset>,
      required: true
    }
  },
  setup() {
    return { quantity: ref(1), price: ref(500) };
  },
  mounted() {
    console.log(this.assetData);
  },
  methods: {
    buyOffer() {
      console.log('buyOffer');
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
    .row.justify-between.content-center.items-center
      .col-10.text-italic.text-subtitle1
      | by
      | {{ assetData?.collection?.author }}
      //- expected yield?
      //- share icon
      .col-2
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

    q-btn.full-width.q-mt-lg(@click='buyOffer()', label='BUY', color='primary')

    //- when owning, show price, days to maturity, with sell button

    //- when mature, show claim button
</template>

<style lang="sass"></style>
