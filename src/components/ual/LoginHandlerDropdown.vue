<script lang="ts">
import { defineComponent } from 'vue';
import { mapMutations } from 'vuex';
export default defineComponent({
  name: 'LoginHandlerDropdown',
  props: ['account'],
  data() {
    return {
      accounts: [this.account],
      showModal: false
    };
  },
  computed: {
    disconnectLabel(): string {
      return this.accounts.length > 1 ? 'Disconnect all' : 'Disconnect';
    }
  },
  methods: {
    ...mapMutations({
      setLocalAccountName: 'account/setLocalAccountName'
    }),
    getAuthenticator() {
      const wallet = localStorage.getItem('autoLogin');
      const availAuthenticators =
        this.$ual.getAuthenticators().availableAuthenticators;
      const idx = availAuthenticators.findIndex(
        (auth) => auth.constructor.name === wallet
      );
      return availAuthenticators[idx];
    },
    async onLogout(): Promise<void> {
      const authenticator = this.getAuthenticator();
      try {
        authenticator && (await authenticator.logout());
        this.clearAccount();
      } catch (error) {
        console.log('Authenticator logout error', error);
        this.clearAccount();
      }
      if (this.$route.path !== '/') {
        await this.$router.push({ path: '/' });
      }
    },
    clearAccount(): void {
      localStorage.removeItem('account');
      this.setLocalAccountName('');
    }
  }
});
</script>

<template lang="pug">
q-btn-dropdown.row(color='secondary', :label='account', dense, outline)
  .row
    q-btn.account-button.col(
      @click='onLogout',
      color='primary',
      :label='disconnectLabel'
    )
</template>

<style lang="sass" scoped></style>
