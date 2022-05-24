<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';
import axios from 'axios';
import { date } from 'quasar';

export default defineComponent({
  name: 'TokensReceipt',
  props: {
    paymentStatus: {
      type: String,
      default: ''
    },
    paymentId: {
      type: String,
      default: ''
    }
  },
  setup() {
    const checkoutAPI = axios.create({
      baseURL: process.env.DEVELOPMENT
        ? 'https://api.sandbox.checkout.com'
        : 'https://api.checkout.com',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.CKO_SECRET_KEY
      }
    });
    return {
      checkoutAPI: checkoutAPI,
      amount: ref(0),
      paymentDate: ref(new Date()),
      approved: ref(false),
      currency: ref(''),
      orderRef: ref(''),
      status: ref(''),
      hasError: ref(false),
      errorMessage: ref('')
    };
  },
  computed: {
    displayDate() {
      return date.formatDate(this.paymentDate, 'DD MMM, YYYY');
    }
  },
  methods: {
    async tryGetPaymentInfo(paymentId: string) {
      console.log('tryGetPaymentInfo');

      const response = await this.checkoutAPI.get(`/payments/${paymentId}`);
      console.log(response.data);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.amount = response.data?.amount / 100;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.paymentDate = new Date(response.data?.requested_on as string);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.currency = response.data?.currency as string;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.orderRef = response.data?.reference as string;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.status = response.data?.status as string;
    },
    async tryGetOrderInfo(pg_id: string) {
      console.log('tryGetOrderInfo');

      const issuerAPI = axios.create({
        baseURL: process.env.ISSUER_API_ENDPOINT
      });

      const response = await issuerAPI.get(`/order/${pg_id}`);

      console.log(response.data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (response.data[0]?.error_code != 0) {
        this.hasError = true;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.errorMessage = response.data[0]?.error_message as string;
      }
    }
  },
  async mounted() {
    await this.tryGetPaymentInfo(this.paymentId);
    await this.tryGetOrderInfo(this.paymentId);
  }
});
</script>

<template lang="pug">
h5 Transaction Summary

//- | Receipt for
//-     | Buying of LEGAL
//- If payment has succeeded
q-card(v-if="paymentStatus === 'success'")
    q-card-section.row
        .col-2.text-center
            q-icon(name="fa-solid fa-money-bill-wave")
        .col-10
            .col
                | Amount
            .col
                | {{ amount.toFixed(2) }} {{currency}}
    q-separator
    q-card-section.row
        .col-2.text-center
            q-icon(name="fa-solid fa-calendar-days")
        .col-10
            .col
                | Date
            .col
                | {{ displayDate }} 
    q-separator
    q-card-section.row
        .col-2.text-center
            q-icon(name="fa-solid fa-tag")
        .col-10
            .col
                | Order Number
            .col
                | {{ orderRef }}
    q-separator
    q-card-section(v-if="hasError==true").row
        .col-2.text-center
            q-icon(name="fa-solid fa-bug", color="red")
        .col-10
            .col(style="color: red;")
                | Order failed to issue tokens
            .col(style="color: red;")
                | {{ errorMessage }}
    q-separator
    .row
        q-btn(
        label="View Balance"
        @click="$router.push({name: 'wallet'})"
        ).col-12
        //- TODO add fee and any other details
//- If payment has failed
q-card(v-if="paymentStatus === 'failure'")
    q-card-section
        | Payment failed
    q-card-section
        | {{status}}
    q-card-section
        | Please review your transaction and try again.
    q-card-section
        q-btn(
            color="primary"
            label="Back"
            @click="$router.push({name: 'wallet'})"
            )
</template>

<style lang="sass" scoped></style>
