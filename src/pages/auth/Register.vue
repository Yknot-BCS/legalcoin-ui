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
    const $q = useQuasar();
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
});
</script>

<template lang="pug">
q-card.row.col.animated.fadeInDown(v-if='$q.screen.gt.sm')
  .col-4.self-center(style='z-index: 1')
    img.float-right.q-mr-xl.q-mb-xl(
      src='~assets/legalcoin-full.png',
      style='width: 13rem'
    )
  .col-2
    .div.triangle.bg-primary.float-right
  AuthCard.col-6(flat)
    .text-body1.text-weight-bold.text-grey-10.col-12 Create An Account
    q-form.text-body1.col-12.row.q-mb-sm.q-gutter-y-lg(@submit='onSubmit')
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
      q-btn.col-12(type='submit', color='secondary', text-color='black') CREATE NEW ACCOUNT
    .col-12.text-center.q-mt-md
      span.q-mr-xs Already have an account?
      router-link(to='login') Sign In
AuthCard.bg-grey-1.col-6.animated.fadeInDown(v-else)
  img(src='~assets/legalcoin-full.png', style='width: 13rem')
  .text-body1.text-weight-bold.text-grey-10.col-12 Create An Account
  q-form.text-body1.col-12.row.q-mb-sm.q-gutter-y-lg(@submit='onSubmit')
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
    q-btn.col-12(type='submit', color='primary', text-color='black') CREATE NEW ACCOUNT
  .col-12.text-center.q-mt-md
    span.q-mr-xs Already have an account?
    router-link(to='login') Sign In
</template>

<style lang="sass" scoped></style>
