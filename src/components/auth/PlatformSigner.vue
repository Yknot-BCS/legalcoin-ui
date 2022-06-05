<script lang="ts">
import { useStore } from 'src/store';
import { defineComponent, computed } from 'vue';
export default defineComponent({
  setup() {
    const store = useStore();
    const showSignModal = computed(
      () => store.state.account.showPlatformSigner
    );
    const closeModal = () =>
      store.commit('account/setShowPlatformSigner', false);
    return {
      showSignModal,
      closeModal
    };
  }
});
</script>

<template lang="pug">
q-dialog(v-model='showSignModal')
  q-card
    q-card-section Platform Signer
    q-card-actions 
      q-btn(@click='closeModal()') Cancel
</template>

<style lang="sass"></style>
