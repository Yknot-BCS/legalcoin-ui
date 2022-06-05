<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { Computed, mapGetters } from 'vuex';
// import { useStore } from 'src/store';
// import { useQuasar } from 'quasar';
import LinkCryptoAccount from 'src/components/auth/LinkCryptoAccount.vue';
import NewCryptoAccount from 'src/components/auth/NewCryptoAccount.vue';
import TransferTokensForm from 'src/components/auth/TransferTokensForm.vue';

export default defineComponent({
  name: 'Template',
  components: { LinkCryptoAccount, NewCryptoAccount, TransferTokensForm },
  computed: {
    ...mapGetters({
      account: 'account/account'
    })
  },
  setup() {
    return {
      hideProfile: ref(false),
      emailNotifications: ref(false)
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
      TransferTokensForm
</template>

<style lang="sass" scoped>
.settings-card
  width: 100%
  max-width: 30rem
  height: 100%
</style>
