<script lang="ts">
import { defineComponent, ref } from 'vue';
import { User } from 'src/types';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'KYCForm',
  components: {},
  setup() {
    return {
      kycStatus: ref(''),
      kycChecking: ref(true),
      userFirstName: ref(''),
      userLastName: ref(''),
      userEmail: ref(''),
      userBirthdate: ref(''),
      userPhone: ref(''),
      userCountry: ref(''),
      UserStreet1: ref(''),
      UserStreet2: ref(''),
      userCity: ref(''),
      userPostalCode: ref(''),
      userSubdivision: ref('')
    };
  },

  computed: {
    ...mapGetters({
      accountName: 'account/getAccountName',
      isAuthenticated: 'account/isAuthenticated',
      account: 'account/account'
    }),
    displayKycStatus() {
      if (this.account) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const user = this.account.profile as User;
        if (user.kyc === 'created') {
          return 'Pending';
        } else if (user.kyc === 'approved') {
          return 'Approved';
        } else if (user.kyc === 'declined') {
          return 'Rejected';
        } else {
          return 'Incomplete';
        }
      }
      return 'Incomplete';
    }
  },

  methods: {
    async checkKYC() {
      console.log('Checking KYC');
      await this.$store.dispatch('account/refreshProfile');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      let account = this.account.profile as User;
      this.kycStatus = account.kyc;
      this.$emit('kycApproved', this.kycStatus === 'approved');
      this.kycChecking = false;
    },
    doKYC() {
      console.log('Doing KYC');
      let templateID = 'itmpl_GZ2JMK4GHYwnFJWxSvFbyeV3';
      let environment = !process.env.DEVELOPMENT ? 'production' : 'sandbox';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      let account = this.account.profile as User;
      let refereceID = account._id;
      let email = account.email;
      let redirectURI = window.location.origin + this.$route.path;
      let kycURL = `https://yknot.withpersona.com/verify?inquiry-template-id=${templateID}&environment=${environment}&reference-id=${refereceID}&fields[email-address]=${email}&redirect-uri=${redirectURI}`;
      // let encodedURL = encodeURIComponent(kycURL);
      // console.log(encodedURL);
      window.location.href = kycURL;
    }
  },
  async mounted() {
    console.log('KYCForm mounted');
    await this.checkKYC();
  }
});
</script>

<template lang="pug">
q-card.q-mt-sm
  .row.justify-center
    q-card-section(v-if='kycChecking')
      .column.justify-center.items-center
        | Checking KYC status...
        q-spinner.q-mr-sm(color='primary', size='1.5em')

    q-card-section(v-if='!kycChecking')
      q-card-section
        .row.justify-center.items-center
          .row 
            | KYC Status: {{ displayKycStatus }}

      q-separator

      q-card-section(v-if='kycStatus === "completed"')
        .row
          | Please wait until KYC is approved. ETA: 1-2 days

      q-card-section(v-if='kycStatus === ""')
        //- Personal Info Form
        .row.fit.justify-center.items-center
          q-btn.q-mt-sm(
            @click='doKYC()',
            color='primary',
            label='Proceed with KYC'
          )
</template>

<style lang="sass"></style>
