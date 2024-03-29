<script lang="ts">
import { defineComponent, ref } from 'vue';
import { User } from 'src/types';
import { mapGetters } from 'vuex';
import qs from 'qs';
import { api } from 'src/api';

export default defineComponent({
  name: 'KYCForm',
  components: {},
  setup() {
    return {
      polling: ref(),
      step: ref(1),
      kycStatus: ref(''),
      kycChecking: ref(true),
      userFirstName: ref(''),
      userLastName: ref(''),
      userEmail: ref(''),
      userBirthdate: ref('2000-12-30'),
      userPhone: ref(''),
      userCountry: ref(''),
      userStreet1: ref(''),
      userStreet2: ref(''),
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
        } else if (user.kyc === 'completed') {
          return 'Pending Approval';
        } else if (user.kyc === 'declined') {
          return 'Rejected';
        } else {
          return user.kyc;
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
    async doKYC() {
      console.log('Doing KYC');
      // Update KYC profile info
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      let account = this.account.profile as User;
      let refereceID = account._id;

      try {
        // eslint-disable-next-line
        await api.accounts.mutation(`
          {
            kycProfileUpdate(input:{
              referenceId: "${refereceID}",
              nameFirst: "${this.userFirstName}",
              nameLast: "${this.userLastName}",
              birthdate: "${this.userBirthdate}",
              emailAddress: "${this.userEmail}",
              phoneNumber: "${this.userPhone}",
              addressStreet1: "${this.userStreet1}",
              addressStreet2: "${this.userStreet2}",
              addressCity: "${this.userCity}",
              addressSubdivision: "${this.userSubdivision}",
              addressPostalCode: "${this.userPostalCode}",
              countryCode : "${this.userCountry}",
            })
          }
        `);
      } catch (error) {
        console.log(error);
        this.$q.notify({
          type: 'negative',
          message: (error as Error).message
        });
      }

      let templateID = 'itmpl_GZ2JMK4GHYwnFJWxSvFbyeV3';
      let environment = !process.env.DEVELOPMENT ? 'production' : 'sandbox';
      let redirectURI = window.location.origin + this.$route.path;

      // Fields
      // FIXME country code
      // TODO this isn't enough to update the user profile, will need to make a call to the backend
      let fields = qs.stringify(
        {
          fields: {
            'name-first': this.userFirstName,
            'name-last': this.userLastName,
            birthdate: this.userBirthdate,
            'email-address': this.userEmail,
            'phone-number': this.userPhone,
            'address-country-code': this.userCountry,
            'address-street-1': this.userStreet1,
            'address-street-2': this.userStreet2,
            'address-city': this.userCity,
            'address-postal-code': this.userPostalCode,
            'address-subdivision': this.userSubdivision
          }
        },
        { encode: true }
      );
      // console.log(fields);
      let kycURL = `https://yknot.withpersona.com/verify?inquiry-template-id=${templateID}&environment=${environment}&reference-id=${refereceID}&redirect-uri=${redirectURI}&${fields}`;
      window.location.href = kycURL;
    }
  },
  mounted() {
    console.log('KYCForm mounted');
    // poll for KYC status
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.polling = setInterval(async () => {
      void (await this.checkKYC());
    }, 5000);
  },
  beforeUnmount() {
    clearInterval(this.polling);
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
    v-if='kycStatus === "" && !kycChecking',
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
        type='date',
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
        type='email',
        :rules='[(val) => val.length > 0 || "Email is required"]'
      )
      q-input(
        outlined,
        v-model='userPhone',
        label='Phone',
        lazy-rules,
        type='tel',
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
        v-model='userStreet1',
        label='Street Address',
        lazy-rules,
        :rules='[(val) => val.length > 0 || "Street Address is required"]'
      )
      q-input(outlined, v-model='userStreet2', label='Apt/Suite', lazy-rules)

      .row.q-col-gutter-sm.q-mt-sm.q-mb-md
        .col
          q-input(outlined, v-model='userCity', label='City', lazy-rules)
        .col
          q-input(
            outlined,
            v-model='userSubdivision',
            label='Region',
            lazy-rules
          )
        .col
          q-input(
            outlined,
            v-model='userPostalCode',
            label='Postal Code',
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
          label='Continue Smart Verification'
        )
      //- q-stepper-navigation
      //-   q-btn(color='primary', label='Finish')
</template>

<style lang="sass"></style>
