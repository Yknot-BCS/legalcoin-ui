<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { Computed, mapGetters } from 'vuex';
import { useStore } from 'src/store';
import { useQuasar } from 'quasar';
import { AnyAction } from '@greymass/eosio';
import { SignTransactionResponse } from 'universal-authenticator-library';
import LinkCryptoAccount from 'src/components/auth/LinkCryptoAccount.vue';
import NewCryptoAccount from 'src/components/auth/NewCryptoAccount.vue';

export default defineComponent({
  name: 'Template',
  components: { LinkCryptoAccount, NewCryptoAccount },
  computed: {
    ...mapGetters({
      account: 'account/account'
    })
  },
  setup() {
    const SYS = computed(() => process.env.NETWORK_TOKEN);
    const store = useStore();
    const $q = useQuasar();
    const cryptoAccountName = computed(
      () => store.state.account.profile.cryptoAccount.accountName
    );
    async function showSignModal() {
      const action = {
        account: 'eosio.token',
        name: 'transfer',
        authorization: [
          { actor: cryptoAccountName.value, permission: 'active' }
        ],
        data: {
          from: cryptoAccountName.value,
          to: 'zzzzzzzzb.ya',
          quantity: `1.0000 ${SYS.value}`,
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
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: (error as Error).message
        });
      }
    }
    return {
      hideProfile: ref(false),
      emailNotifications: ref(false),
      showSignModal
    };
  }
});
</script>

<template lang="pug">
q-page.fit.row.wrap.justify-center
  q-card.settings-card
    q-card-section
      .text-h6.text-grey-8
        | My Account Settings
    q-card-section
      .row.justify-start.items-center
        | {{ account.profile.name }} {{ account.profile.surname }}
        q-btn(
          :to='{ name: "editprofile" }',
          icon='edit',
          flat,
          outline,
          color='grey-6'
        )
      .col
        q-btn(:to='{ name: "profile" }', flat, outline, padding='none')
          .text-italic
            | View My Profile
    q-separator
    //- q-card-section
    //-     .text-bold
    //-         | My Gallery

    //-     | Hide profile
    //-     q-toggle(v-model="hideProfile")
    //- q-separator
    //- q-card-section
    //-     .text-bold
    //-         | E-mail notifications

    //-     | Enabled
    //-     q-toggle(v-model="emailNotifications")
    //- q-separator
    q-card-section
      .text-bold
        | Link Connected Accounts

      link-crypto-account
    q-separator
    q-card-section
      NewCryptoAccount
    q-separator 
    q-card-section 
      q-btn(@click='showSignModal()') Show Profile Signer
</template>

<style lang="sass" scoped>
.settings-card
  width: 100%
  max-width: 30rem
  height: 100%
</style>
