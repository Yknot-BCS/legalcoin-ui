<script lang="ts">
import { ref } from 'vue';
import { requiredRule } from './inputRules';
import auth from 'src/auth';
import { useStore } from 'src/store';
import { useRouter } from 'vue-router';
// import { api } from 'src/api';
import { useQuasar } from 'quasar';

export default {
  setup() {
    const $q = useQuasar();
    const store = useStore();
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
          await auth.register(
            store,
            userName,
            userSurname,
            userEmail,
            userPassword
          );
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
  q-form(@submit="onSubmit").col-12.row.q-mb-sm.q-gutter-y-lg
    q-input(
        v-model="userName"
        label="Name"
        lazy-rules
        :rules="[ requiredRule ]"
        autocomplete="given-name"
    ).col-6.q-pr-md
    q-input(
        v-model="userSurname"
        label="Surname"
        lazy-rules
        :rules="[ requiredRule ]"
        autocomplete="family-name"
    ).col-6
    q-input(
        v-model="userEmail"
        label="Email"
        lazy-rules
        :rules="[ requiredRule ]"
        autocomplete="email"
    ).col-12
    q-input(
        v-model="userPassword"
        type="password"
        label="Password"
        lazy-rules
        :rules="[ requiredRule ]"
        autocomplete="new-password"
    ).col-12
    q-input(
        v-model="userRetypePassword"
        type="password"
        label="Retype Password"
        lazy-rules
        :rules="[ requiredRule, passwordMatchRule ]"
        autocomplete="new-password"
    ).col-12
    q-btn(type="submit" color="primary").col-12 Create an account
  .col-12.text-center
    span.q-mr-xs Already have an account?
    router-link(to="login") Login

</template>

<style lang="sass" scoped>
.form-wrapper
  flex-basis: 600px
  flex-grow: 0
  flex-shrink: 1
</style>
