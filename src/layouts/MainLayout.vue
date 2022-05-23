<script lang="ts">
import Header from 'src/components/core/Header.vue';
import Footer from 'src/components/core/Footer.vue';
import MobileTabsFooter from 'src/components/core/MobileTabsFooter.vue';
import { useStore } from 'src/store';
import { onMounted, computed } from 'vue';
import auth from 'src/auth';
import UalLoginHandler from 'src/components/ual/UalLoginHandler.vue';

export default {
  setup() {
    const store = useStore();
    onMounted(() => {
      // Check if still authenticated on local storage
      if (auth.isAuthenticated()) {
        store.commit('account/setIsAuthenticated', true);
      } else {
        store.commit('account/setIsAuthenticated', false);
      }
    });
    return {
      DEVELOPMENT: computed(
        () => process.env.DEVELOPMENT?.toLowerCase() === 'true'
      )
    };
  },
  components: { Header, Footer, MobileTabsFooter, UalLoginHandler }
};
</script>

<template lang="pug">
q-layout( view="hHh lpR fff")
  q-toolbar( v-if="DEVELOPMENT").dev-banner 
    .q-mr-sm.text-secondary Development
    UalLoginHandler
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

.dev-banner
  background: $primary
  min-height: 0.2rem
  justify-content: center
</style>
