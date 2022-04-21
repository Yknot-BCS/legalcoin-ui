<script lang="ts">
import { defineComponent } from 'vue';
import Header from 'src/components/core/Header.vue';
import Footer from 'src/components/core/Footer.vue';
import MobileTabsFooter from 'src/components/core/MobileTabsFooter.vue';

export default defineComponent({
  name: 'MainLayout',
  components: { Header, Footer, MobileTabsFooter }
});
</script>

<template lang="pug">
q-layout( view="hHh lpR fff")
  Header
  q-page-container
    router-view
    q-separator
  q-footer
    Footer(v-if='$q.screen.gt.sm')
    MobileTabsFooter(v-if='$q.screen.lt.md')
</template>

<style lang="sass" scoped>
.separator
  height: 2px
  min-height: 2px
</style>
