<script lang="ts">
import { defineComponent, computed, PropType, ref } from 'vue';
import DetailsTable from 'src/components/atomicAssets/DetailsTable.vue';
import Description from 'src/components/atomicAssets/Description.vue';
import Timeline from 'src/components/TimeLine.vue';
import { IAsset } from 'atomicassets/build/API/Explorer/Objects';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default defineComponent({
  name: 'Asset',
  components: { DetailsTable, Description, Timeline },
  props: {
    assetData: {
      type: Object as PropType<IAsset>,
      required: true
    }
  },
  setup(props) {
    const Data = computed(() => props.assetData);
    console.log(Data);
    return {
      Data,
      tab: ref('description')
    };
  }
});
</script>

<template lang="pug">
.row.justify-center.page-background(v-if="$q.screen.gt.md")
  .col-12.page-view.q-py-lg
    .row.q-pa-md.justify-center
      .col-xs-12.col-sm-12.col-md-6
        q-card
          q-card-section
            .text-h5 {{assetData?.collection?.collection_name}}
            .text-subtitle1.text-weight-light {{'by '+ assetData?.owner}}
          q-card-section
            q-img.asset-img(:src="assetData?.data?.img")
          q-card-section
            .row
              .col-6
                .row.q-py-sm.q-px-md
                  .col-12.text-subtitle2 PRICE: 500 LegalCoin(LCP)
              .col-6
                q-btn.full-width(v-if="1" flat color="primary" label="Request Buyback")
                  q-icon.flip-horizontal.q-px-md(name="reply")
          q-card-section
            .container
              Timeline(startDate="2021/04/30" maturityDate="2024/04/30" expiryDate="2027/04/30")
          q-card-section
            q-tabs(
                v-model="tab"
                dense
                align="left"
                active-color="primary"
                class="text-grey-8"
                :breakpoint="0"
              )
                q-tab(name="description" label="Description")
                q-tab(name="details" label="Details")

            q-tab-panels(v-model="tab" animated)
              q-tab-panel(name="description")
                q-card(flat)
                  q-card-section
                    .text-h6 Description:
                  q-separator(inset)
                q-card-section
                  Description(description="Some description here")
              q-tab-panel(name="details")
                DetailsTable

.row.justify-center(v-else)
  .col-12.page-view.q-py-lg
    .row.q-pa-sm
      .col-12
        q-card(flat)
          q-img.asset-img(:src="assetData.data.img")
      .col-12.q-py-md
        .container
          Timeline(startDate="2021/04/30" maturityDate="2024/04/30" expiryDate="2027/04/30")
      .col-12.q-py-md
        q-tabs(
            v-model="tab"
            dense
            align="left"
            active-color="primary"
            class="text-grey-8"
            :breakpoint="0"
          )
            q-tab(name="description" label="Description")
            q-tab(name="details" label="Details")

        q-tab-panels(v-model="tab" animated)
          q-tab-panel(name="description")
            q-card(flat)
              q-card-section
                .text-h6 Description:
              q-separator(inset)
            q-card-section
              Description(description="Some description here")
          q-tab-panel(name="details")
            DetailsTable

</template>

<style lang="sass" scoped>
.page-view
  width: 100%
  max-width: 1400px
.page-background
  background: #f0f0f0
.asset-img
  width: 100%
  height: 675px
.container
  border: 1px solid $grey-6
  border-radius: 13px
</style>
