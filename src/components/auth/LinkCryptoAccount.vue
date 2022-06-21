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
      const linkedAccounts = store.state.account.profile.linkedAccounts;
      const localAccountName = store.state.account.localAccountName;
      if (localAccountName !== '') {
        if (!linkedAccounts.includes(localAccountName)) {
          try {
            const newLinkedAccounts = JSON.stringify([
              ...linkedAccounts,
              localAccountName
            ]);
            // eslint-disable-next-line
            await api.accounts.mutation(`
              {
                profileUpdate(input:{
                  linkedAccounts: ${newLinkedAccounts}
                })
              }
            `);
            await store.dispatch('account/refreshProfile');
            $q.notify({
              type: 'positive',
              message: `Linked "${localAccountName}" to your profile`
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
            message: `"${localAccountName}" is already linked`
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
q-btn(v-if='cryptoIsAuthenticated', @click='linkConnectedAccount()') Link Connected Account
</template>
