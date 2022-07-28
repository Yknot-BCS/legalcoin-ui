<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  data() {
    this.$rollbar.info('Hello world.');
    return {};
  }
});
</script>

<template lang="pug">
router-view
</template>
