<script lang="ts">
import { defineComponent } from 'vue';
import DefaultGallery from 'src/components/gallery/DefaultGallery.vue';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default defineComponent({
  name: 'Gallery',
  components: { DefaultGallery },
  setup() {
    return {};
  }
});
</script>

<template lang="pug">
q-page
  DefaultGallery
</template>
