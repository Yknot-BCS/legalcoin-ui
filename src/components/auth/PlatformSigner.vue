<script lang="ts">
import { useStore } from 'src/store';
import { useQuasar, useDialogPluginComponent } from 'quasar';
import { SignTransactionResponse } from 'universal-authenticator-library';
import { defineComponent, computed, ref } from 'vue';
import {
  Action,
  AnyAction,
  Transaction,
  PrivateKey,
  SignedTransaction
} from '@greymass/eosio';
import { UALErrorType } from 'universal-authenticator-library';
import { UALPlatformSignerError } from 'src/components/auth/UALPlatformSignerError';
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
    const profile = computed(() => store.state.account.profile);
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
        if (!action.authorization || !action.authorization.length) {
          action.authorization = [
            { actor: profile.value.accountName, permission: 'active' }
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

        // TODO Review this conversion from PushTransactionResponse to SignTransactionResponse
        signedTransactionResponse = {
          wasBroadcast: true,
          transactionId: transaction.id.toString(),
          transaction: transaction
        };

        store.commit('account/setSignedTransaction', signedTransactionResponse);
      } catch (error) {
        const message = 'Unable to sign transaction';
        const type = UALErrorType.Signing;
        const cause = error;
        const ualError = new UALPlatformSignerError(message, type, cause);

        // State can be used by downstream tasks to get a return value from the signer
        store.commit('account/setSignedTransaction', null);
        store.commit('account/setSingedTransactionError', ualError);
      } finally {
        onDialogOK();
      }
    };
    return {
      profile,
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
      q-separator
      q-card-section
        .text-italic Please enter your password to confirm the transaction
        q-input.q-my-sm(
          v-model='userPassword',
          type='password',
          label='Password',
          lazy-rules,
          :rules='[requiredRule]',
          autocomplete='current-password'
        )
        q-card(bordered, flat)
          q-expansion-item(expand-separator, label='Transaction Details')
            q-card
              q-card-section {{ actions }}
      //- q-separator
      //- q-card-section
        //- .text-italic You are about to sign a transaction on the blockchain
      q-card-actions(align='right')
        q-btn(@click='onDialogCancel') Cancel
        q-btn(type='submit', color='primary') Confirm
</template>

<style lang="sass">
.q-card
  flex-basis: 500px
</style>
