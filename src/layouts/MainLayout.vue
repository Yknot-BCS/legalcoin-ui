<script lang="ts">
import Header from 'src/components/core/Header.vue';
import Footer from 'src/components/core/Footer.vue';
import MobileTabsFooter from 'src/components/core/MobileTabsFooter.vue';
import { useStore } from 'src/store';
import { onMounted, computed } from 'vue';
import auth from 'src/auth';
import DevBanner from 'src/components/dev/DevBanner.vue';

export default {
  setup() {
    const store = useStore();
    onMounted(async () => {
      // Refresh profile if session is still open
      if (auth.isLoggedIn()) {
        store.commit('account/setisLoggedIn', true);
        await store.dispatch('account/refreshProfile');
      } else {
        store.commit('account/setisLoggedIn', false);
      }
    });
    return {
      DEVELOPMENT: computed(
        () => process.env.DEVELOPMENT?.toLowerCase() === 'true'
      )
    };
  },
  components: { Header, Footer, MobileTabsFooter, DevBanner }
};
</script>

<template lang="pug">
q-layout( view="hHh lpR fff")
  dev-banner(v-if="DEVELOPMENT")
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
