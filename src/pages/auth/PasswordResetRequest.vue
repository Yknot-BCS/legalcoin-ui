<script lang="ts">
import auth from 'src/auth';
import AuthCard from '../../components/auth/AuthCard.vue';

import { ref } from 'vue';
import { defineComponent } from 'vue';
import { requiredRule } from './inputRules';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

export default defineComponent({
  components: {
    AuthCard
  },
  setup() {
    const userEmail = ref('');
    const router = useRouter();
    const quasar = useQuasar();
    return {
      userEmail,
      requiredRule,
      onSubmit: async () => {
        try {
          await auth.passwordResetRequest(userEmail);
          await router.push({
            name: 'passwordresetsent',
            params: { email: userEmail.value }
          });
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
});
</script>

<template lang="pug">
.row.justify-center
  AuthCard.col
    .text-h5.col-12.text-weight-bold Reset Password
    p.col-12 If you forgot your password, enter your email and we will send you a reset link.
    q-form.col-12.row.q-mb-sm.q-gutter-y-lg(@submit='onSubmit')
      q-input.col-12(
        v-model='userEmail',
        type='email',
        label='Email',
        lazy-rules,
        :rules='[requiredRule]',
        autocomplete='email'
      )
      q-btn.col-12(type='submit', color='primary') Reset Password
    .col-12.text-center.q-mt-lg
      router-link(to='login') Back to Sign In

//-   .col-12.text-center.q-m-t
//-     router-link(to='login') Return to Sign In
</template>

<style lang="sass" scoped></style>
