<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'src/store';
import { useQuasar } from 'quasar';
import { api } from 'src/api';

export default defineComponent({
  name: 'Profile',
  components: {},
  setup() {
    const $q = useQuasar();
    const store = useStore();
    const cryptoIsAuthenticated = computed(
      // eslint-disable-next-line
      (): boolean => store.getters['account/cryptoIsAuthenticated']
    );
    async function linkConnectedAccount() {
      const linkedAccounts =
        store.state.account.profile.cryptoAccount.linkedAccounts;
      const cryptoAccountName = store.state.account.cryptoAccountName;
      if (cryptoAccountName !== '') {
        if (!linkedAccounts.includes(cryptoAccountName)) {
          try {
            const newLinkedAccounts = JSON.stringify([
              ...linkedAccounts,
              cryptoAccountName
            ]);
            // eslint-disable-next-line
            await api.accounts.mutation(`
              {
                profileUpdate(input:{
                  cryptoAccount: {
                    linkedAccounts: ${newLinkedAccounts}
                  }
                })
              }
            `);
            await store.dispatch('account/refreshProfile');
            $q.notify({
              type: 'positive',
              message: `Linked "${cryptoAccountName}" to your profile`
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
            message: `"${cryptoAccountName}" is already linked`
          });
        }
      }
    }
    return {
      cryptoIsAuthenticated,
      linkConnectedAccount
    };
  }
});
</script>

<template lang="pug">
q-btn(v-if="cryptoIsAuthenticated" @click="linkConnectedAccount()") Link Connected Account
</template>
