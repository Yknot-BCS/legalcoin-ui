<script lang="ts">
import { defineComponent, ref } from 'vue';

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
    trySubmit() {
      console.log('submit');
    }
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
      q-btn(type='submit', color='primary', label='Submit')

//- TODO SWIFT or SEPA payments. Check
//- Name, account number, bank name, bank address, bank code, IBAN, BIC/SWIFT
//- Look at solutions like skrill, wise, currencyfair, revolut
</template>

<style lang="sass"></style>
