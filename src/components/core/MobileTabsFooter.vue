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
  q-tab(name="buy" label="BUY" icon="wallet")
  q-tab(name="wallet" label="GALLERY" icon="wallet")
  q-tab(name="gallery" label="WALLET" icon="mail")
  q-tab(name="account" label="ACCOUNT" icon="person")

</template>

<style lang="sass" scoped>
.footer-background
  border-top: 1px solid $grey-4
</style>
