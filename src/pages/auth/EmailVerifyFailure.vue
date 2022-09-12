<script lang="ts">
import auth from 'src/auth';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
export default {
  setup() {
    const router = useRouter();
    const quasar = useQuasar();

    return {
      resendEmail: async () => {
        try {
          await auth.emailVerificationRequest();
          await router.push({ name: 'emailverify-sent' });
        } catch (error) {
          if (error instanceof Error) {
            quasar.notify({
              color: 'red-4',
              textColor: 'white',
              message: error.message,
              timeout: 5000
            });
          }
        }
      }
    };
  }
};
</script>

<template lang="pug">
.row.justify-center
  .form-wrapper.row.q-pa-md.bg-grey-3
    .text-h5.col-12 Email Verification Failed
    p
      | We could not verify your email address, the link you used has expired.
      br
      | To request a new link you can use the button below.
    q-btn.col-12(@click='resendEmail()', color='primary')
      | Resend verification email
</template>

<style lang="sass" scoped>
.form-wrapper
  flex-basis: 600px
  flex-grow: 0
  flex-shrink: 1
</style>
