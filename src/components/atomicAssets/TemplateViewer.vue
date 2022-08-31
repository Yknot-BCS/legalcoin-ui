<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import DetailsTable from 'src/components/atomicAssets/DetailsTable.vue';
import Description from 'src/components/atomicAssets/Description.vue';
import Timeline from 'src/components/atomicAssets/TimeLine.vue';
import { ITemplate } from 'atomicassets/build/API/Explorer/Objects';
import { ISale } from 'atomicmarket/build/API/Explorer/Objects';
import TemplateActionCard from 'src/components/atomicAssets/TemplateActionCard.vue';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default defineComponent({
  name: 'TemplateCardView',
  components: { DetailsTable, Description, Timeline, TemplateActionCard },
  emits: ['updateAssetInfo'],
  props: {
    templateData: {
      type: Object as PropType<ITemplate>,
      required: true
    },
    saleData: {
      type: Object as PropType<ISale>,
      required: false
    }
  },
  setup() {
    return {
      tab: ref('description')
    };
  },
  computed: {
    assetImg(): string {
      return `${process.env.IPFS_ENDPOINT}/ipfs/${<string>(
        this.templateData.immutable_data?.img
      )}`;
    }
  }
});
</script>

<template lang="pug">
.row.col-12.q-pt-xl.justify-center
  //- Image
  q-card.col-6.q-my-sm.q-mx-md(flat)
    q-img.asset-img(
      :src='assetImg',
      placeholder-src='~src/assets/LC-Placeholder.png'
    )
      template(v-slot:loading)
        .text-primary
          .row.q-py-xl
          .q-pt-xl Loading...

  //- Actions
  TemplateActionCard.col-6.q-my-sm.q-mx-md(
    :templateData='templateData',
    :saleData='saleData',
    @update-asset-info='$emit("updateAssetInfo", $event)'
  )

  //- Details and Description
.row.col-12.q-pa-sm.justify-center
  q-card.col-6.q-my-sm.q-mx-md(flat)
    q-tabs.text-grey-8(
      v-model='tab',
      dense,
      align='left',
      active-color='primary',
      :breakpoint='0'
    )
      q-tab(name='description', label='Description')
      q-tab(name='details', label='Details')

    q-tab-panels(v-model='tab', animated)
      q-tab-panel(name='description')
        Description(:templateData='templateData')
      q-tab-panel(name='details')
        DetailsTable(
          :data='templateData?.immutable_data',
          :schema='templateData?.schema'
        )
  q-card.col-6.q-my-sm.q-mx-md(flat)
</template>

<style lang="sass" scoped>
.page-view
  width: 100%
  max-width: 1400px
// .page-background
//   background: #f0f0f0
.asset-img
  width: 100%
  height: 100%
// .container
//   border: 1px solid $grey-6
//   border-radius: 13px
.asset-container
  width: 100%
  max-width: 30rem
</style>
