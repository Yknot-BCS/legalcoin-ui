<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',
  components: {}
});
</script>

<template lang="pug">
q-layout( view="hHh lpR fff")
  q-header
    q-separator.separator
  q-page-container
    router-view
    q-separator
  q-footer
</template>

<style lang="sass" scoped>
.separator
  height: 2px
  min-height: 2px
</style>
