<script lang="ts">
import { useStore } from 'src/store';
import { useQuasar } from 'quasar';
import { defineComponent, computed, ref } from 'vue';
import { api } from 'src/api';
import { requiredRule } from '../../pages/auth/inputRules';
export default defineComponent({
  setup() {
    const store = useStore();
    const $q = useQuasar();
    const showSignModal = computed(
      () => store.state.account.showPlatformSigner
    );
    const cryptoAccount = computed(
      () => store.state.account.profile.cryptoAccount
    );
    const userPassword = ref('');
    const closeModal = () =>
      store.commit('account/setShowPlatformSigner', false);
    const getPrivateKey = async (): Promise<string> => {
      try {
        type CryptoPrivateKeyResponse = {
          cryptoPrivateKey: string;
        };
        const res = (await api.accounts.query(`
          {
            cryptoPrivateKey(input: {password: "${userPassword.value}"})
          }
        `)) as CryptoPrivateKeyResponse;
        return res.cryptoPrivateKey;
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: (error as Error).message
        });
      }
    };
    const sendTransaction = async () => {
      const privateKey = await getPrivateKey();
    };
    return {
      showSignModal,
      cryptoAccount,
      userPassword,
      closeModal,
      getPrivateKey,
      sendTransaction,
      requiredRule
    };
  }
});
</script>

<template lang="pug">
q-dialog(v-model='showSignModal')
  q-card
    q-card-section
      .text-h5 Confirm Transaction
    q-card-section
      div Signing with {{ cryptoAccount.accountName }}
      div Please enter your password to confirm the transaction.
    q-card-section
      q-input(
        v-model='userPassword',
        type='password',
        label='Password',
        lazy-rules,
        :rules='[requiredRule]',
        autocomplete='current-password'
      )
    q-card-actions(align='right')
      q-btn(@click='closeModal()') Cancel
      q-btn(@click='sendTransaction()', color='primary') Confirm
</template>

<style lang="sass">
.q-card
  flex-basis: 400px
</style>
