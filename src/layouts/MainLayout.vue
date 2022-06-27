<script lang="ts">
import Header from 'src/components/core/Header.vue';
import Footer from 'src/components/core/Footer.vue';
import { useStore } from 'src/store';
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import auth from 'src/auth';
import DevBanner from 'src/components/dev/DevBanner.vue';
import CompleteRegistrationBanners from 'src/components/auth/CompleteRegistrationBanners.vue';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    let sessionTimeout: ReturnType<typeof setTimeout>;
    async function logout(): Promise<void> {
      store.commit('account/setLogout');
      await router.push({ name: 'home' });
      router.go(0); // refresh
    }
    function refreshSession() {
      clearTimeout(sessionTimeout);
      const sessionLength = auth.getSessionExpiry() - Date.now();
      if (sessionLength > 0) {
        sessionTimeout = setTimeout(() => {
          void logout();
        }, sessionLength - 1000 * 60 * 1); // 1 min before expiry
      } else void logout();
    }
    onMounted(async () => {
      // Refresh profile if session is still open
      if (auth.isLoggedIn()) {
        store.commit('account/setisLoggedIn', true);
        await store.dispatch('account/refreshProfile');
        refreshSession();
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
  components: {
    Header,
    Footer,
    DevBanner,
    CompleteRegistrationBanners
  }
};
</script>

<template lang="pug">
q-layout(view='hHh lpR fff')
  dev-banner(v-if='DEVELOPMENT')
  Header
  CompleteRegistrationBanners
  q-page-container
    router-view
    q-separator
  q-footer(v-if='$q.screen.gt.sm')
    Footer
  q-page-scroller(position='bottom-right', :scroll-offset='150')
    q-btn(fab, color='primary', icon='arrow_upward')
</template>

<style lang="sass" scoped>
.separator
  height: 2px
  min-height: 2px
</style>
