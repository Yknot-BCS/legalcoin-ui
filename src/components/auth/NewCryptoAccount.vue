<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'src/store';
import { useQuasar } from 'quasar';
import { api } from 'src/api';
import { requiredRule } from '../../pages/auth/inputRules';

export default defineComponent({
  name: 'Profile',
  components: {},
  setup() {
    const $q = useQuasar();
    const store = useStore();
    const profile = computed(() => store.state.account.profile);
    const localIsAuthenticated = computed(
      (): boolean => !!store.state.account.localAccountName
    );
    const userPassword = ref('');
    async function cryptoNew(accountName?: string) {
      if (profile.value.accountName === '') {
        try {
          // eslint-disable-next-line
          const optionalAccountName = accountName
            ? `accountName: "${accountName}"`
            : '';
          await api.accounts.mutation(`
              {
                cryptoNew(input:{
                  password: "${userPassword.value}"
                  ${optionalAccountName}
                })
              }
            `);
          await store.dispatch('account/refreshProfile');
          $q.notify({
            type: 'positive',
            message: `Added "${profile.value.accountName}" to your profile`
          });
        } catch (error) {
          $q.notify({
            type: 'negative',
            message: (error as Error).message
          });
        }
      } else {
        $q.notify({
          type: 'negative',
          message: 'User already has profile account'
        });
      }
    }
    async function connectExistingAccount() {
      const localAccountName = store.state.account.localAccountName;
      if (localAccountName) {
        await cryptoNew(localAccountName);
      }
    }
    async function createNewAccount() {
      await cryptoNew();
    }
    function cryptoReset() {
      $q.dialog({
        title: 'Crypto Account Reset',
        message:
          'Are you sure you want to reset your crypto account? This will only affect your profile, not the blockchain, but you may loose access to your account.',
        cancel: true,
        focus: 'cancel',
        color: 'negative'
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
      }).onOk(async () => {
        try {
          await api.accounts.mutation(`
            {
              cryptoReset
            }
            `);
          await store.dispatch('account/refreshProfile');
          $q.notify({
            type: 'positive',
            message: 'Reset crypto account'
          });
        } catch (error) {
          $q.notify({
            type: 'negative',
            message: (error as Error).message
          });
        }
      });
    }
    return {
      localIsAuthenticated,
      profile,
      userPassword,
      cryptoReset,
      connectExistingAccount,
      createNewAccount,
      requiredRule
    };
  }
});
</script>

<template lang="pug">
.q-gutter-y-sm
  .col-12.text-bold Profile Crypto Account
  .col-12.text-italic With this account you can sign transactions on the blockchain without connecting an independant wallet (like Anchor).
  .col-12.row(v-if='profile.accountName !== ""')
    .col-12 Profile account name: &nbsp;
      span.text-bold {{ profile.accountName }}
    .col-12 Profile public key: &nbsp;
      span.text-bold {{ profile.publicKey }}
    q-btn.col-12(
      @click='cryptoReset',
      color='negative',
      label='Reset crypto account'
    ) 
  q-card(flat, bordered)(v-else)
    q-item.bg-info You still need to create a crypto account for your profile. Connect an existing account or create a new one below.
    q-card-section
      q-input(
        v-model='userPassword',
        type='password',
        label='Password',
        lazy-rules,
        :rules='[requiredRule]',
        autocomplete='current-password'
      )
    q-card-actions(align='stretch')
      q-btn.col(
        :disable='!localIsAuthenticated',
        @click='connectExistingAccount()',
        type='submit',
        color='primary'
      ) Connect existing account
      q-btn.col(@click='createNewAccount()', type='submit', color='primary') Create new account
</template>
