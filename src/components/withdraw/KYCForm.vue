<script lang="ts">
import { defineComponent, ref } from 'vue';
import { User } from 'src/types';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'KYCForm',
  components: {},
  computed: {
    ...mapGetters({
      accountName: 'account/getAccountName',
      isAuthenticated: 'account/isAuthenticated',
      account: 'account/account'
    })
  },
  setup() {
    return { kycStatus: ref('Pending'), kycChecking: ref(false) };
  },
  methods: {
    checkKYC() {
      console.log('Checking KYC');
      // this.kycStatus = 'Complete';
      this.$emit('kycComplete', false);
    },
    doKYC() {
      console.log('Doing KYC');
      let templateID = 'itmpl_GZ2JMK4GHYwnFJWxSvFbyeV3';
      let environment = !process.env.DEVELOPMENT ? 'production' : 'sandbox';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      let account = this.account.profile as User;
      let clientID = 1;
      let email = account.email;
      let redirectURI = window.location.origin + this.$route.path;
      let kycURL = `https://yknot.withpersona.com/verify?inquiry-template-id=${templateID}&environment=${environment}&reference-id=${clientID}&fields[email-address]=${email}&redirect-uri=${redirectURI}`;
      // let encodedURL = encodeURIComponent(kycURL);
      // console.log(encodedURL);
      window.location.href = kycURL;
    }
  },
  mounted() {
    console.log('KYCForm mounted');
    this.checkKYC();
  }
});
</script>

<template lang="pug">
q-card.q-mt-sm
  .row.justify-center
    q-card-section
      .column.justify-center.items-center(v-if='kycChecking')
        | Checking KYC status...
        q-spinner.q-mr-sm(color='primary', size='1.5em')

      .column.justify-center.items-center(v-if='kycChecking == false')
        | KYC Status: {{ kycStatus }}
        q-btn.q-mt-sm(
          v-if='kycStatus !== "Complete"',
          @click='doKYC()',
          color='primary',
          label='Proceed with KYC'
        )
</template>

<style lang="sass"></style>
