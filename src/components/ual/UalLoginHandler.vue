<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapMutations } from 'vuex';
import LoginHandlerDropdown from './LoginHandlerDropdown.vue';
import WalletModal from './WalletModal.vue';
export default defineComponent({
  name: 'LoginHandler',
  components: { LoginHandlerDropdown, WalletModal },
  data() {
    return {
      showDropdown: false,
      showModal: false
    };
  },
  mounted() {
    const storedAccount = localStorage.getItem('account');
    if (storedAccount) {
      this.setAccountName(storedAccount);
    }
  },
  computed: {
    ...mapGetters({ account: 'account/cryptoAccountName' })
  },
  methods: {
    ...mapMutations({
      setAccountName: 'account/setCryptoAccountName'
    })
  }
});
</script>

<template lang="pug">
.text-white.q-my-xs
  LoginHandlerDropdown(v-if='account', :account='account')
  q-btn(
    v-else,
    @click='showModal = true',
    label='Connect Wallet',
    outline,
    dense
  )
  WalletModal(v-model='showModal')
</template>

<style scoped lang="sass"></style>
