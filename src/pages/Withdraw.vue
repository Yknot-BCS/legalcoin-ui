<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';
import { mapGetters } from 'vuex';
import KYCForm from 'src/components/withdraw/KYCForm.vue';
import TxTokenForm from 'src/components/withdraw/TxTokenForm.vue';
import BankForm from 'src/components/withdraw/BankForm.vue';

export default defineComponent({
  name: 'Withdraw',
  components: { KYCForm, TxTokenForm, BankForm },
  setup() {
    return {
      step: ref(0),
      kycApproved: ref(false),
      depositComplete: ref(true),
      bankComplete: ref(false)
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
  methods: {}
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
          KYCForm(@kycApproved='(n: boolean) => (kycApproved = n)')

          q-stepper-navigation
            q-btn(
              @click='step = 2',
              color='primary',
              label='Continue',
              :disable='!kycApproved'
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
          | Please transfer the desired LEGAL tokens to the LegalCoin wallet address below.
          TxTokenForm(@depositComplete='(n: boolean) => (depositComplete = n)')

          q-stepper-navigation
            q-btn(
              @click='step = 3',
              color='primary',
              label='Continue',
              :disable='!depositComplete'
            )
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
          | Please enter your bank details below. GBP will be deposited into this account.
          | Please note that we can only deposit into to the following countires.
          | All fees will be paid by the user.

          BankForm(@bankComplete='(n: boolean) => (bankComplete = n)')

          q-stepper-navigation
            q-btn(
              @click='step = 4',
              color='primary',
              label='Continue',
              :disable='!bankComplete'
            )
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
