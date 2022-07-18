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
      this.setLocalAccountName(storedAccount);
    }
  },
  computed: {
    ...mapGetters({ account: 'account/account' })
  },
  methods: {
    ...mapMutations({
      setLocalAccountName: 'account/setLocalAccountName'
    })
  }
});
</script>

<template lang="pug">
.text-white.q-my-xs
  LoginHandlerDropdown(
    v-if='account.localAccountName',
    :account='account.localAccountName'
  )
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
