<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'Collection',
  components: {},
  setup() {
    const route = useRoute();
    const collectionId = computed(() => route.params.collection);
    return { collectionId };
  }
});
</script>

<template lang="pug">
q-page
  h1 Collection {{ collectionId }}
</template>
