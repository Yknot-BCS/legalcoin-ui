<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { atomic_api } from 'src/api/atomic_assets';

export default defineComponent({
  name: 'Gallery',
  components: {},
  setup() {
    //const data = await atomic_api.getAsset('1099511627786');
    async function getData() {
      const options = { owner: 'pokemontest1', page: 1, limit: 10 };
      return await atomic_api.getAssets(options);
    }
    onMounted(async () => {
      console.log(await getData());
    });
    return {};
  }
});
</script>

<template lang="pug">
q-page
  .row.q-px-md
    .col-12
      .text-h3.text-weight-bold.q-pa-lg Gallery
    .col-6
      .q-px-md.text-h6.text-grey-8 My Gallery 

    .col-6
      q-btn.q-px-md.float-right.text-grey-8(label="view all" flat)
</template>
