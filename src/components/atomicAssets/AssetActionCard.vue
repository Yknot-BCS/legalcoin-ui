<script lang="ts">
import { defineComponent, PropType } from 'vue';
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
    return {};
  }
});
</script>

<template lang="pug">
q-card 
  Timeline(
    startDate='2021/04/30',
    maturityDate='2024/04/30',
    expiryDate='2027/04/30'
  )
</template>

<style lang="sass"></style>
