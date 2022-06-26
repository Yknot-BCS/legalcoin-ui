<script lang="ts">
import AuthCard from '../../components/auth/AuthCard.vue';
import { defineComponent, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'src/store';
import auth from 'src/auth';
import { useRouter } from 'vue-router';

export default defineComponent({
  components: {
    AuthCard
  },
  setup() {
    const $q = useQuasar();
    const store = useStore();
    const router = useRouter();
    onMounted(async () => {
      await store.dispatch('account/refreshProfile');
    });
    return {
      logout: async () => {
        store.commit('account/setLogout');
        await router.push({ name: 'login' });
      },
      resendEmail: async () => {
        try {
          await auth.emailVerificationRequest();
          $q.notify({
            type: 'positive',
            message: 'Email sent'
          });
        } catch (error) {
          $q.notify({
            type: 'negative',
            message: (error as Error).message
          });
        }
      }
    };
  }
});
</script>

<template lang="pug">
AuthCard
  .text-h5.col-12.text-weight-bold Let's verify your email
  p.col-12 Check your {{ $store.state.account.profile.email }} inbox to verify your account and get started.
  q-btn.col-12(@click='resendEmail()', color='primary') Resend Email
  q-btn.col-12.q-ml-md(@click='logout()', color='primary') Sign Out
</template>

<style lang="sass" scoped></style>
