<script lang="ts">
import { defineComponent, ref } from 'vue';
import { mapGetters } from 'vuex';
// import { useStore } from 'src/store';
// import { useQuasar } from 'quasar';
import LinkCryptoAccount from 'src/components/auth/LinkCryptoAccount.vue';
import NewCryptoAccount from 'src/components/auth/NewCryptoAccount.vue';
import TransferTokensForm from 'src/components/auth/TransferTokensForm.vue';
import UpdatePassword from 'src/components/auth/UpdatePassword.vue';

export default defineComponent({
  name: 'Template',
  data() {
    return {
      showUpdatePassword: false
    };
  },
  components: {
    LinkCryptoAccount,
    NewCryptoAccount,
    TransferTokensForm,
    UpdatePassword
  },
  computed: {
    ...mapGetters({
      account: 'account/account',
      accountName: 'account/getAccountName'
    })
  },
  setup() {
    return {
      hideProfile: ref(false),
      emailNotifications: ref(false),
      kycKey: ref(false)
    };
  }
});
</script>

<template lang="pug">
q-page.fit.row.wrap.justify-center
  q-card.settings-card
    q-card-section
      .text-h5.text-grey-8.q-mt-xl.q-mr-lg
        | Account Settings
    q-card-section
      .row.justify-start.items-center.text-grey-8
        | {{ account.profile.name }} {{ account.profile.surname }}
        q-btn.edit-btn(
          :to='{ name: "editprofile" }',
          icon='edit',
          flat,
          outline,
          color='grey-6'
        )
      .col
        q-btn(
          :to='{ name: "profile" }',
          flat,
          outline,
          padding='none',
          font-size='15px'
        )
          .text-italic
            | View My Profile
    q-separator
    q-card-section
      q-btn(@click='showUpdatePassword = true', v-if='!showUpdatePassword') Change Password
      UpdatePassword(v-else)
    q-separator
    q-card-section
      .text-bold Profile
      div Email: {{ account.profile.email }}
      div Platform Account: {{ account.profile.accountName }}
      div Connected Account: {{ accountName }}

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
    //- q-card-section
    //-   .text-bold
    //-     | Link Connected Accounts

    //-   link-crypto-account
    //- q-separator
    //- q-card-section
    //-   NewCryptoAccount
    //- q-separator 
    //- q-card-section
    //-   TransferTokensForm
</template>

<style lang="sass" scoped>
.settings-card
  width: 100%
  max-width: 30rem
  height: 100%

.edit-btn
  left: 210px

.btn-width
  width: 350px
  justify-center: center
  font-size: 20px
  background-color: orange
  border-radius: 5px
</style>
