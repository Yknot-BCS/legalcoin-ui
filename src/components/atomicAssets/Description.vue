<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import { ITemplate } from 'atomicassets/build/API/Explorer/Objects';

export default defineComponent({
  name: 'Description',
  components: {},
  props: {
    templateData: {
      type: Object as PropType<ITemplate>,
      required: false
    }
  },
  setup(props) {
    const description = computed(
      () => props.templateData.immutable_data?.description as string
    );
    const maxSupply = computed(() => props.templateData.max_supply);
    const issuedSupply = computed(() => props.templateData.issued_supply);
    return { description, maxSupply, issuedSupply };
  }
});
</script>

<template lang="pug">
.row
  .col-12
    .text-body1 {{ description }}
  .col-12.q-mt-lg
    .text-subtitle1 Remaining Supply: {{ Number(maxSupply) - Number(issuedSupply) }}/{{ maxSupply }}
</template>

<style lang="sass"></style>
