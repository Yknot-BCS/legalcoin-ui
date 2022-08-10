<script lang="ts">
import { useStore } from 'src/store';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import auth from 'src/auth';
import { useQuasar } from 'quasar';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const $q = useQuasar();
    const dismissed = ref(false);
    const profile = computed(() => store.state.account.profile);
    const isLoggedIn = computed(() => store.state.account.isLoggedIn);
    const showVerifyEmailBanner = computed(() => {
      return (
        isLoggedIn.value && !profile.value.emailVerified && !dismissed.value
      );
    });
    const showLogoutBanner = computed(() => {
      return (
        isLoggedIn.value &&
        profile.value.emailVerified &&
        !dismissed.value &&
        (profile.value.accountName === '' || !profile.value.accountName)
      );
    });
    const resendEmail = async () => {
      try {
        await auth.emailVerificationRequest();
        $q.notify({
          color: 'positive',
          textColor: 'white',
          message: 'Email verification sent'
        });
        dismissed.value = true;
      } catch (error) {
        if (error instanceof Error) {
          $q.notify({
            color: 'red-4',
            textColor: 'white',
            message: error.message,
            timeout: 5000
          });
        }
      }
    };
    const logout = async () => {
      store.commit('account/setLogout');
      await router.push({ name: 'login' });
      router.go(0); // refresh
    };
    return {
      profile,
      isLoggedIn,
      dismissed,
      resendEmail,
      showVerifyEmailBanner,
      showLogoutBanner,
      logout
    };
  }
};
</script>

<template lang="pug">
.banner-wrapper.q-ma-sm.row.justify-start(
  v-if='showVerifyEmailBanner || showLogoutBanner'
)
  q-banner.bg-primary.text-white.animated.fadeInLeft(
    v-if='showVerifyEmailBanner'
  )(
    rounded
  ) Email not verified. Please check your mail for a verification request. If you have not received one, we can resend the request.
    template(v-slot:action)
      q-btn(flat, label='Dismiss', @click='dismissed = true')
      q-btn(flat, label='Resend', @click='resendEmail')
  q-banner.bg-primary.text-white.animated.fadeInLeft(v-if='showLogoutBanner')(
    rounded
  ) We still need to create an account for you on the blockchain. To complete this process, we need sign you out and back in.
    template(v-slot:action)
      q-btn(flat, label='Dismiss', @click='dismissed = true')
      q-btn(flat, label='Sign out', @click='logout')
</template>

<style lang="sass" scoped>
.banner-wrapper
  position: absolute
  z-index: 1
.avatar
  position: absolute
  margin-top: 5px
.q-banner
  flex-basis: 600px
  flex-grow: 0
  flex-shrink: 1
</style>
