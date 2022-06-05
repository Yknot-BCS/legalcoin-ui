<script lang="ts">
import { useStore } from 'src/store';
import { defineComponent, computed } from 'vue';
export default defineComponent({
  setup() {
    const store = useStore();
    const showSignModal = computed(
      () => store.state.account.showPlatformSigner
    );
    const cryptoAccount = computed(
      () => store.state.account.profile.cryptoAccount
    );
    const closeModal = () =>
      store.commit('account/setShowPlatformSigner', false);
    return {
      showSignModal,
      cryptoAccount,
      closeModal
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
    q-card-actions(align='right')
      q-btn(@click='closeModal()') Cancel
      q-btn(@click='closeModal()', color='primary') Confirm
</template>

<style lang="sass">
.q-card
  flex-basis: 400px
</style>
