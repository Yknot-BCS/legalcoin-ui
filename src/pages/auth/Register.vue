<script lang="ts">
import { ref } from 'vue';
import { requiredRule } from './inputRules';
import auth from 'src/auth';
//import { useStore } from 'src/store';
import { useRouter } from 'vue-router';
// import { api } from 'src/api';
import { useQuasar } from 'quasar';

export default {
  setup() {
    const $q = useQuasar();
    //const store = useStore();
    const router = useRouter();
    const userName = ref('');
    const userSurname = ref('');
    const userEmail = ref('');
    const userPassword = ref('');
    function passwordMatchRule(val: string): string | boolean {
      return val === userPassword.value || 'Passwords do not match';
    }
    return {
      userName,
      userSurname,
      userEmail,
      userPassword,
      userRetypePassword: ref(''),
      requiredRule,
      passwordMatchRule,
      onSubmit: async () => {
        try {
          await auth.register(userName, userSurname, userEmail, userPassword);
          // await auth.login(store, userEmail, userPassword);
          $q.notify({
            type: 'positive',
            message: 'Registered'
          });
          // Navigate to home
          await router.push({ name: 'home' });
        } catch (error) {
          $q.notify({
            type: 'negative',
            message: (error as Error).message
          });
        }
      }
    };
  }
};
</script>

<template lang="pug">
.form-wrapper.row.q-pa-md.bg-grey-3
  .text-h5.col-12 Register
  q-form.col-12.row.q-mb-sm.q-gutter-y-lg(@submit='onSubmit')
    q-input.col-6.q-pr-md(
      v-model='userName',
      label='Name',
      lazy-rules,
      :rules='[requiredRule]',
      autocomplete='given-name'
    )
    q-input.col-6(
      v-model='userSurname',
      label='Surname',
      lazy-rules,
      :rules='[requiredRule]',
      autocomplete='family-name'
    )
    q-input.col-12(
      v-model='userEmail',
      label='Email',
      lazy-rules,
      :rules='[requiredRule]',
      autocomplete='email'
    )
    q-input.col-12(
      v-model='userPassword',
      type='password',
      label='Password',
      lazy-rules,
      :rules='[requiredRule]',
      autocomplete='new-password'
    )
    q-input.col-12(
      v-model='userRetypePassword',
      type='password',
      label='Retype Password',
      lazy-rules,
      :rules='[requiredRule, passwordMatchRule]',
      autocomplete='new-password'
    )
    q-btn.col-12(type='submit', color='primary') Create an account
  .col-12.text-center
    span.q-mr-xs Already have an account?
    router-link(to='login') Login
</template>

<style lang="sass" scoped>
.form-wrapper
  flex-basis: 600px
  flex-grow: 0
  flex-shrink: 1
</style>
