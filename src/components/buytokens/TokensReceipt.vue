<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';
import axios from 'axios';
import { date } from 'quasar';
import { mapGetters } from 'vuex';
import crypto from 'crypto';

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
    return {
      amount: ref(0),
      paymentDate: ref(new Date()),
      approved: ref(false),
      currency: ref(''),
      orderRef: ref(''),
      status: ref(''),
      hasError: ref(false),
      errorMessage: ref(''),
      polling: ref(),
      issueInProgress: ref(false)
    };
  },
  computed: {
    ...mapGetters({
      accountName: 'account/getAccountName',
      isAuthenticated: 'account/isAuthenticated'
    }),
    displayDate() {
      return date.formatDate(this.paymentDate, 'DD MMM, YYYY');
    }
  },
  methods: {
    async tryGetOrderInfo(pg_id: string) {
      //   console.log('tryGetOrderInfo');
      const hash = crypto
        .createHmac('sha256', process.env.ISSUER_SECRET)
        .update(this.accountName)
        .digest('hex');

      const issuerAPI = axios.create({
        baseURL: process.env.ISSUER_API_ENDPOINT,
        headers: {
          'Content-Type': 'application/json',
          Authorization: hash
        }
      });

      const response = await issuerAPI.get(
        `/getorders/${<string>this.accountName}`,
        { params: { pg_id: pg_id } }
      );

      /* eslint-disable */
      let order = response.data[0][0];
      this.amount = order?.item_price as number;
      this.paymentDate = new Date(order?.created as string);
      this.currency = 'GBP' as string;
      this.orderRef = order?.id as string;
      this.status = order?.pg_payment_status?.status as string;
      /* eslint-disable */

      if (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        order?.error_code === undefined ||
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        order?.error_code === null
      ) {
        this.issueInProgress = true;
      }
      if (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        order?.error_code !== 0 &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        order?.error_code !== null &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        order?.error_code !== undefined
      ) {
        this.hasError = true;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.errorMessage = order?.error_message as string;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      } else if (order?.error_code === 0) {
        this.hasError = false;
        this.errorMessage = '';
        this.issueInProgress = false;
        clearInterval(this.polling);
      }
    }
  },
  async mounted() {
    // await this.tryGetPaymentInfo(this.paymentId);
    await this.tryGetOrderInfo(this.paymentId);

    if (this.issueInProgress) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this.polling = setInterval(async () => {
        void (await this.tryGetOrderInfo(this.paymentId));
      }, 3000);
    }
  },
  beforeUnmount() {
    clearInterval(this.polling);
  }
});
</script>

<template lang="pug">
//- | Receipt for
//-     | Buying of LEGAL
//- If payment has succeeded
q-card.receipt-card(v-if='paymentStatus === "success"')
  q-card-section 
    .text-h5.text-grey-8 
      | Transaction Summary

  q-card-section.row
    .col-2.text-center
      q-icon(name='fa-solid fa-money-bill-wave')
    .col-10
      .col
        | Amount
      .col
        | {{ amount }} {{ currency }}
  q-separator
  q-card-section.row
    .col-2.text-center
      q-icon(name='fa-solid fa-calendar-days')
    .col-10
      .col
        | Date
      .col
        | {{ displayDate }}
  q-separator
  q-card-section.row
    .col-2.text-center
      q-icon(name='fa-solid fa-tag')
    .col-10
      .col
        | Order Number
      .col
        | {{ orderRef }}
  q-separator
  q-card-section.row
    .col-2.text-center
      q-spinner-clock(v-if='issueInProgress')
      q-icon(v-else, name='fa-solid fa-hourglass') 
    .col-10
      .col
        | Payout Status
      .col(v-if='issueInProgress')
        | Issuing tokens in progress
      .col(v-if='!issueInProgress')
        | Issuing tokens completed
        //- TODO - add link to transaction on block explorer
  q-separator
  q-card-section.row(v-if='hasError == true')
    .col-2.text-center
      q-icon(name='fa-solid fa-bug', color='red')
    .col-10
      .col(style='color: red')
        | Order failed to issue tokens
      .col(style='color: red')
        | {{ errorMessage }}
  q-separator
  .row
    q-btn.col-12(
      label='View Balance',
      @click='$router.push({ name: "wallet" })'
    )
    //- TODO add fee and any other details
//- If payment has failed
q-card(v-if='paymentStatus === "failure"')
  q-card-section
    | Payment failed
  q-card-section
    | {{ status }}
  q-card-section
    | Please review your transaction and try again.
  q-card-section
    q-btn(
      color='primary',
      label='Back',
      @click='$router.push({ name: "wallet" })'
    )
</template>

<style lang="sass" scoped>
.receipt-card
  width: 100%
  max-width: 30rem
  height: 100%
  max-height: 30rem
</style>
