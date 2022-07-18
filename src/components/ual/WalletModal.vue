<script lang="ts">
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Wallet',
  data() {
    return {
      authenticators: {},
      error: null,
      loading: {}
    };
  },
  computed: {
    ...mapGetters({ account: 'account/getAccountName' })
  },
  methods: {
    ...mapActions({ cryptoLogin: 'account/cryptoLogin' }),
    ...mapMutations({ setAuthenticator: 'account/setAuthenticator' }),
    async onLogin(idx: number) {
      const authenticator =
        this.$ual.getAuthenticators().availableAuthenticators[idx];
      this.error = null;
      try {
        await this.cryptoLogin({
          account: this.account as string,
          authenticator
        });
        // TODO route to home page
        // await this.$router.push({ path: '/' });
        // this.$router.go(0);
      } catch (e) {
        this.error = e;
      }
    }
  }
});
</script>

<template lang="pug">
q-dialog.modal-container
  .modal-header-container
    //- q-icon( name='add_circle_outline' size='2.5rem' color="white") 
    //- h3.modal-header Attach an account
  q-separator
  q-list
    q-item(
      v-for='(wallet, idx) in $ual.authenticators',
      :key='wallet.getStyle().text',
      v-ripple,
      :style='{ background: wallet.getStyle().background, color: wallet.getStyle().textColor }'
    )
      q-item-section.cursor-pointer(avatar, @click='onLogin(idx)')
        img(:src='wallet.getStyle().icon', width='30')
      q-item-section.cursor-pointer(@click='onLogin(idx)') {{ wallet.getStyle().text }}
      q-item-section.flex(avatar)
        q-spinner(
          v-if='loading === wallet.getStyle().text',
          :color='wallet.getStyle().textColor',
          size='2em'
        )
        q-btn(
          v-else,
          :color='wallet.getStyle().textColor',
          icon='get_app',
          @click='openUrl(wallet.getOnboardingLink())',
          target='_blank',
          dense,
          flat,
          size='12px'
        )
          q-tooltip Get app
    q-item(
      v-if='error',
      :active='!!error',
      active-class='bg-red-1 text-grey-8'
    )
      q-item-section {{ error }}
</template>

<style lang="sass"></style>
