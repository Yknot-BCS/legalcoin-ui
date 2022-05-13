<script lang="ts">
import { ref } from 'vue';

export default {
  setup() {
    return {
      tab: ref('buy')
    };
  }
};
</script>

<template lang="pug">
q-tabs.bg-white.text-grey.footer-background(no-caps dense active-color="primary" indicator-color="transparent" v-model="tab")
  q-route-tab(name="buy" label="BUY" icon="wallet" :to="{ name: 'buy' }" exact)
  q-route-tab(name="gallery" label="GALLERY" icon="fas fa-th" :to="{ name: 'gallery' }" exact)
  q-route-tab(name="wallet" label="WALLET" icon="fas fa-wallet" :to="{ name: 'wallet' }" exact)
  q-route-tab(name="account" label="ACCOUNT" icon="person" :to="{ name: 'profile', params: {profile: 'fuzz'}}" exact)
</template>

<style lang="sass" scoped>
.footer-background
  border-top: 1px solid $grey-4
</style>
