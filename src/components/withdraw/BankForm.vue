<script lang="ts">
import { defineComponent, ref } from 'vue';
import { api } from 'src/api';

export default defineComponent({
  name: 'KYCForm',
  components: {},
  props: {},
  computed: {},
  setup() {
    return {
      swiftCode: ref(''),
      fullname: ref(''),
      accountNumber: ref(''),
      bankName: ref(''),
      bankCode: ref(''),
      bankAddress: ref('')
    };
  },
  methods: {
    async trySubmit() {
      try {
        // eslint-disable-next-line
        await api.accounts.mutation(`
              {
                profileUpdate(input: {bankInfo: 
                  {name: "${this.fullname}", 
                  accountNumber: "${this.accountNumber}",
                  bankName: "${this.bankName}",
                  bankCode: "${this.bankCode}",
                  bankAddress: "${this.bankAddress}",
                  swiftCode: "${this.swiftCode}"
                  }
                } )
              }
            `);
        await this.$store.dispatch('account/refreshProfile');
        this.$q.notify({
          type: 'positive',
          message: 'Bank Information Updated'
        });
        this.$emit('bankComplete', true);
      } catch (e: unknown) {
        if (typeof e === 'string') {
          e.toUpperCase(); // works, `e` narrowed to string
        } else if (e instanceof Error) {
          console.log(e);
          this.$q.notify({
            color: 'red-4',
            textColor: 'white',
            message: e.message
          });
        }
      }
    },
    loadBankInfo() {
      const bankInfo = this.$store.state.account.profile.bankInfo;
      if (bankInfo) {
        this.fullname = bankInfo.name;
        this.accountNumber = bankInfo.accountNumber;
        this.bankName = bankInfo.bankName;
        this.bankCode = bankInfo.bankCode;
        this.bankAddress = bankInfo.bankAddress;
        this.swiftCode = bankInfo.swiftCode;
      }
    }
  },
  mounted() {
    this.loadBankInfo();
  }
});
</script>

<template lang="pug">
q-card.q-mt-sm
  q-form(@submit='trySubmit', ref='sendForm')
    .row.justify-center.q-mt-md.q-col-gutter-sm
      .col-5
        q-input(
          v-model='fullname',
          label='Name',
          outlined,
          :rules='[(val) => !!val || "Name is required"]'
        )
      .col-5
        q-input(
          v-model='bankName',
          label='Bank Name',
          outlined,
          :rules='[(val) => !!val || "Bank Name is required"]'
        )
      .col-5
        q-input(
          v-model='accountNumber',
          label='Account Number',
          outlined,
          :rules='[(val) => !!val || "Account Number is required"]'
        )
      .col-5
        q-input(v-model='bankAddress', label='Bank Address', outlined)
      .col-5
        q-input(v-model='bankCode', label='Bank Code (Optional)', outlined)
      .col-5
        q-input(
          v-model='swiftCode',
          label='SWIFT/BIC',
          outlined,
          :rules='[(val) => !!val || "SWIFT is required"]'
        )
    .row.justify-center.q-my-md
      q-btn(type='submit', color='primary', label='Update')

//- TODO SWIFT or SEPA payments. Check
//- Name, account number, bank name, bank address, bank code, IBAN, BIC/SWIFT
//- Look at solutions like skrill, wise, currencyfair, revolut
</template>

<style lang="sass"></style>
