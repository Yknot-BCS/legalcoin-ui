<script lang="ts">
import { useStore } from 'src/store';
import { useQuasar, useDialogPluginComponent } from 'quasar';
import { SignTransactionResponse } from 'universal-authenticator-library';
import { defineComponent, computed, ref } from 'vue';
import {
  APIClient,
  Asset,
  Action,
  AnyAction,
  Transaction,
  PrivateKey,
  SignedTransaction,
  APIError
} from '@greymass/eosio';
import { api } from 'src/api';
import { requiredRule } from '../../pages/auth/inputRules';
export default defineComponent({
  props: {
    actions: {
      type: Array,
      required: true
    }
  },
  emits: [...useDialogPluginComponent.emits],
  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();
    const store = useStore();
    const $q = useQuasar();
    const cryptoAccount = computed(
      () => store.state.account.profile.cryptoAccount
    );
    const userPassword = ref('');
    const getPrivateKey = async (): Promise<PrivateKey> => {
      try {
        type CryptoPrivateKeyResponse = {
          cryptoPrivateKey: string;
        };
        const res = (await api.accounts.query(`
          {
            cryptoPrivateKey(input: {password: "${userPassword.value}"})
          }
        `)) as CryptoPrivateKeyResponse;
        const privateKey = PrivateKey.from(res.cryptoPrivateKey);
        return privateKey;
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: (error as Error).message
        });
      }
    };
    const signTransaction = async () => {
      const privateKey = await getPrivateKey();

      // TODO Move to eosio_core

      const info = await api.eosioCore.v1.chain.get_info();
      const header = info.getTransactionHeader();

      const actions = props.actions as AnyAction[];
      const typedActions: Action[] = [];
      for (const action of actions) {
        const { abi } = await api.eosioCore.v1.chain.get_abi(action.account);
        if (!abi) {
          throw new Error(`ABI for ${action.account.toString()} not found`);
        }
        // console.log(cryptoAccount.value.accountName);
        if (!action.authorization || !action.authorization.length) {
          action.authorization = [
            { actor: cryptoAccount.value.accountName, permission: 'active' }
          ];
        }
        console.log(action, abi);
        typedActions.push(Action.from(action, abi));
      }

      const transaction = Transaction.from({
        ...header,
        actions: typedActions
      });

      // Sign transaction
      const signature = privateKey.signDigest(
        transaction.signingDigest(info.chain_id)
      );
      const signedTransaction = SignedTransaction.from({
        ...transaction,
        signatures: [signature]
      });

      let signedTransactionResponse: SignTransactionResponse;
      try {
        await api.eosioCore.v1.chain.push_transaction(signedTransaction);

        signedTransactionResponse = {
          wasBroadcast: true,
          transactionId: transaction.id.toString(),
          transaction: transaction
        };

        store.commit('account/setSignedTransaction', signedTransactionResponse);
      } catch (error) {
        signedTransactionResponse = {
          wasBroadcast: false,
          transaction: transaction
        };
        if (error instanceof APIError) {
          signedTransactionResponse.error = {
            code: error.code.toString(),
            message: error.message,
            name: error.name
          };
        }
        store.commit('account/setSignedTransaction', signedTransactionResponse);
      } finally {
        onDialogOK();
      }
    };
    return {
      cryptoAccount,
      userPassword,
      getPrivateKey,
      signTransaction,
      requiredRule,
      dialogRef,
      onDialogHide,
      onDialogCancel
    };
  }
});
</script>

<template lang="pug">
q-dialog(ref='dialogRef', @hide='onDialogHide', persistent)
  q-card
    q-form(@submit='signTransaction')
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
        q-btn(@click='onDialogCancel') Cancel
        q-btn(type='submit', color='primary') Confirm
</template>

<style lang="sass">
.q-card
  flex-basis: 400px
</style>
