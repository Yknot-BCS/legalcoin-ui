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
    const profileCryptoAccount = computed(
      () => store.state.account.profile.cryptoAccount
    );
    const cryptoIsAuthenticated = computed(
      // eslint-disable-next-line
      (): boolean => store.getters['account/cryptoIsAuthenticated']
    );
    const userPassword = ref('');
    async function cryptoNew(cryptoAccountName?: string) {
      if (profileCryptoAccount.value.accountName === '') {
        try {
          // eslint-disable-next-line
          const optionalAccountName = cryptoAccountName
            ? `accountName: "${cryptoAccountName}"`
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
            message: `Added "${profileCryptoAccount.value.accountName}" to your profile`
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
      const cryptoAccountName = store.state.account.cryptoAccountName;
      if (cryptoAccountName !== '') {
        await cryptoNew(cryptoAccountName);
      }
    }
    async function createNewAccount() {
      await cryptoNew();
    }
    return {
      cryptoIsAuthenticated,
      profileCryptoAccount,
      userPassword,
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
  .col-12(v-if='profileCryptoAccount.accountName !== ""') Profile account name: &nbsp;
    span.text-bold {{ profileCryptoAccount.accountName }}
  .col-12(v-if='profileCryptoAccount.accountName !== ""') Profile public key: &nbsp;
    span.text-bold {{ profileCryptoAccount.publicKey }}
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
        :disable='!cryptoIsAuthenticated',
        @click='connectExistingAccount()',
        type='submit',
        color='primary'
      ) Connect existing account
      q-btn.col(@click='createNewAccount()', type='submit', color='primary') Create new account
</template>
