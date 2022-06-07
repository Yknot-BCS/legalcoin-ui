<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'src/store';
import { useQuasar } from 'quasar';
import { AnyAction } from '@greymass/eosio';
import { SignTransactionResponse } from 'universal-authenticator-library';
import { requiredRule } from '../../pages/auth/inputRules';

export default defineComponent({
  name: 'Profile',
  components: {},
  setup() {
    const SYS = computed(() => process.env.NETWORK_TOKEN);
    const $q = useQuasar();
    const store = useStore();
    const cryptoAccountName = computed(
      () => store.state.account.profile.cryptoAccount.accountName
    );
    const toAccount = ref('zzzzzzzzb.ya');
    const quantity = ref('1.0000');
    async function send() {
      if (isNaN(Number(quantity.value))) {
        $q.notify({
          type: 'negative',
          message: 'Quantity must be a number'
        });
        return;
      }
      const qty = Number(quantity.value).toFixed(4);
      const action = {
        account: 'eosio.token',
        name: 'transfer',
        authorization: [
          { actor: cryptoAccountName.value, permission: 'active' }
        ],
        data: {
          from: cryptoAccountName.value,
          to: toAccount.value,
          quantity: `${qty} ${SYS.value}`,
          memo: 'Test platform signer'
        }
      } as AnyAction; // TODO cast to modified AnyAction (create new type) (auth not needed)

      try {
        const res = (await store.dispatch('account/sendTransaction', {
          actions: [action]
        })) as SignTransactionResponse;
        console.log(res.transactionId);
        $q.notify({
          type: 'positive',
          message: 'Transaction signed'
        });
        $q.dialog({
          title: 'Transaction signed',
          message: `Transaction ID: ${res.transactionId}`
        });
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: (error as Error).message
        });
      }
    }
    return {
      send,
      toAccount,
      quantity,
      SYS,
      requiredRule
    };
  }
});
</script>

<template lang="pug">
q-form(@submit='send')
  q-card 
    q-card-section 
      .text-bold Transfer example
    q-card-section
      q-input.col-12(
        v-model='toAccount',
        label='To Account',
        lazy-rules,
        :rules='[requiredRule]'
      )
      q-input.col-12(
        v-model='quantity',
        label='Quantity',
        lazy-rules,
        :rules='[requiredRule]',
        :suffix='SYS'
      )
    q-card-actions(align='stretch')
      q-btn.col(type='submit', color='primary') Send
</template>
