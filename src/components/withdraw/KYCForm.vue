<script lang="ts">
import { defineComponent, ref } from 'vue';
import { User } from 'src/types';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'KYCForm',
  components: {},
  setup() {
    return {
      step: ref(1),
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

  //- q-card-section(v-if='kycStatus === ""')
  q-stepper(
    v-if='kycStatus === ""',
    v-model='step',
    color='primary',
    vertical,
    animated,
    contracted,
    infinite
  )
    q-step(:name='1', title='Basic Info', icon='person', :done='step > 0')
      .row.justify-between.q-col-gutter-md
        .col
          q-input(
            outlined,
            v-model='userFirstName',
            label='First Name',
            lazy-rules,
            :rules='[(val) => val.length > 0 || "First name is required"]'
          )
        .col
          q-input(
            outlined,
            v-model='userLastName',
            label='Last Name',
            lazy-rules,
            :rules='[(val) => val.length > 0 || "Last name is required"]'
          )

      q-input(
        outlined,
        v-model='userBirthdate',
        label='Birthdate',
        lazy-rules,
        :rules='[(val) => val.length > 0 || "Birthdate is required"]'
      )
      //- q-stepper-navigation
      q-btn(@click='step = 2', color='primary', label='Continue')

    q-step(:name='2', title='Contact', icon='contact_phone', :done='step > 1')
      q-input(
        outlined,
        v-model='userEmail',
        label='Email',
        lazy-rules,
        :rules='[(val) => val.length > 0 || "Email is required"]'
      )
      q-input(
        outlined,
        v-model='userPhone',
        label='Phone',
        lazy-rules,
        :rules='[(val) => val.length > 0 || "Phone is required"]'
      )
      //- q-stepper-navigation
      q-btn(@click='step = 3', color='primary', label='Continue')
      q-btn(@click='step = 1', color='primary', label='Back', flat)

    q-step(:name='3', title='Address', icon='home', :done='step > 2')
      q-input(
        outlined,
        v-model='userCountry',
        label='Country',
        lazy-rules,
        :rules='[(val) => val.length > 0 || "Country is required"]'
      )
      q-input(
        outlined,
        v-model='UserStreet1',
        label='Street 1',
        lazy-rules,
        :rules='[(val) => val.length > 0 || "Street 1 is required"]'
      )
      q-input(
        outlined,
        v-model='UserStreet2',
        label='Street 2',
        lazy-rules,
        :rules='[(val) => val.length > 0 || "Street 2 is required"]'
      )
      q-input(
        outlined,
        v-model='userCity',
        label='City',
        lazy-rules,
        :rules='[(val) => val.length > 0 || "City is required"]'
      )
      q-input(
        outlined,
        v-model='userPostalCode',
        label='Postal Code',
        lazy-rules,
        :rules='[(val) => val.length > 0 || "Postal Code is required"]'
      )
      q-input(
        outlined,
        v-model='userSubdivision',
        label='Subdivision',
        lazy-rules
      )

      //- q-stepper-navigation
      q-btn(@click='step = 4', color='primary', label='Continue')
      q-btn(@click='step = 2', color='primary', label='Back', flat)

    q-step(
      :name='4',
      title='Smart Verification',
      icon='face',
      :done='step > 4'
    )
      .row.justify-center
        q-btn.q-mt-sm(
          @click='doKYC()',
          color='primary',
          label='Proceed with KYC'
        )
      //- q-stepper-navigation
      //-   q-btn(color='primary', label='Finish')
</template>

<style lang="sass"></style>
