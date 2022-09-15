<script lang="ts">
import { User } from 'src/types';
import { defineComponent } from 'vue';
import { ref } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'Withdraw',
  components: {},
  setup() {
    return {
      step: ref(0),
      kycStatus: ref('Pending'),
      kycChecking: ref(false)
    };
  },
  computed: {
    ...mapGetters({
      accountName: 'account/getAccountName',
      isAuthenticated: 'account/isAuthenticated',
      account: 'account/account'
    })
  },
  watch: {},
  methods: {
    checkKYC() {
      console.log('Checking KYC');
      // this.kycStatus = 'Complete';
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
    console.log('Withdraw mounted');
    this.checkKYC();
  }
});
</script>

<template lang="pug">
q-page(v-if='isAuthenticated')
  .row.justify-center
    q-card.q-mt-xl
      //- Insert a 5 step stepper here
      q-stepper(v-model='step', vertical, color='primary', animated)
        //- Step 0: Introduction
        q-step(:name='0', title='LEGAL to FIAT', icon='face', :done='step > 0')
          | Please follow the steps very carefully to withdraw your LEGAL tokens to your bank account.
          | Failure to do so, can result in a loss of funds or longer processing times.
          q-stepper-navigation
            q-btn(@click='step = 1', color='primary', label='Continue')

        //- Step 1: Check if KYC is complete, Do KYC if not complete
        q-step(:name='1', title='Complete KYC', icon='face', :done='step > 1')
          | We need to verify your identity before we can process your withdrawal.
          q-card.q-mt-sm
            .row.justify-center
              q-card-section
                .column.justify-center.items-center(v-if='kycChecking')
                  | Checking KYC status...
                  q-spinner.q-mr-sm(color='primary', size='1.5em')

                .column.justify-center.items-center(
                  v-if='kycChecking == false'
                )
                  | KYC Status: {{ kycStatus }}
                  q-btn.q-mt-sm(
                    v-if='kycStatus !== "Complete"',
                    @click='doKYC()',
                    color='primary',
                    label='Proceed with KYC'
                  )
          q-stepper-navigation
            q-btn(
              @click='step = 2',
              color='primary',
              label='Continue',
              :disable='kycStatus !== "Complete"'
            )
            q-btn.q-ml-sm(
              @click='step = 0',
              color='primary',
              label='Back',
              flat
            )

        //- Step 2: Transfer LEGAL to LC wallet, Check if LC wallet has LEGAL
        q-step(
          :name='2',
          title='Transfer LEGAL tokens',
          icon='currency_exchange',
          :done='step > 2'
        )
          | For each ad campaign that you create, you can control how much you're willing to
          q-stepper-navigation
            q-btn(@click='step = 3', color='primary', label='Continue')
            q-btn.q-ml-sm(
              @click='step = 1',
              color='primary',
              label='Back',
              flat
            )

        //- Step 3: Enter bank details, Check if bank details are correct
        q-step(
          :name='3',
          title='Confirm Bank Details',
          icon='account_balance',
          :done='step > 3'
        )
          | For each ad campaign that you create, you can control how much you're willing to
          q-stepper-navigation
            q-btn(@click='step = 4', color='primary', label='Continue')
            q-btn.q-ml-sm(
              @click='step = 2',
              color='primary',
              label='Back',
              flat
            )

        //- Step 4: Complete
        q-step(:name='4', title='Complete', icon='flag', :done='step > 4')
          | For each ad campaign that you create, you can control how much you're willing to
          q-stepper-navigation
            q-btn(
              @click='$router.push({ name: "wallet" })',
              color='primary',
              label='Finish'
            )
q-page(v-else)
  .row.justify-center
    q-card.q-mt-xl
      .row.justify-center
        | Must be logged in to continue
</template>

<style lang="sass" scoped></style>
