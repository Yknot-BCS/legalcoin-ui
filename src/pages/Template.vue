<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'Template',
  components: {},
  setup() {
    const route = useRoute();
    const collectionId = computed(() => route.params.collection);
    const templateId = computed(() => route.params.template);
    return { collectionId, templateId };
  }
});
</script>

<template lang="pug">
q-page
  h1 Template {{ collectionId + ' / ' + templateId }}
</template>
