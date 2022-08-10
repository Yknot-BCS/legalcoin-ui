<script lang="ts">
import auth from 'src/auth';
import AuthCard from '../../components/auth/AuthCard.vue';

import { ref } from 'vue';
import { defineComponent } from 'vue';
import { requiredRule } from './inputRules';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

export default defineComponent({
  components: {
    AuthCard
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const quasar = useQuasar();
    const userPassword = ref('');
    function passwordMatchRule(val: string): string | boolean {
      return val === userPassword.value || 'Passwords do not match';
    }
    return {
      userPassword,
      userPasswordConfirm: ref(''),
      requiredRule,
      passwordMatchRule,
      onSubmit: async () => {
        try {
          await auth.passwordResetNew(
            route.query['resetToken'] as string,
            userPassword.value
          );
          await router.push({ name: 'passwordresetsuccess' });
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
  AuthCard
    .text-h5.col-12.text-weight-bold Set New Password
    p.col-12 to continue to LegalCoin
    q-form.col-12.row.q-mb-sm.q-gutter-y-lg(@submit='onSubmit')
      q-input.col-12(
        v-model='userPassword',
        type='password',
        label='Password',
        lazy-rules,
        :rules='[requiredRule]',
        autocomplete='new-password'
      )
      q-input.col-12(
        v-model='userPasswordConfirm',
        type='password',
        label='Retype Password',
        lazy-rules,
        :rules='[requiredRule, passwordMatchRule]',
        autocomplete='new-password'
      )
      q-btn.col-12(type='submit', color='primary') Reset Password
</template>

<style lang="sass" scoped>
.form-wrapper
  flex-basis: 600px
  flex-grow: 0
  flex-shrink: 1
</style>
