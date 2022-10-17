<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';
import axios from 'axios';
import { date } from 'quasar';
import { mapGetters } from 'vuex';
import crypto from 'crypto';
import { required } from 'yargs';

export default defineComponent({
  name: 'TPCardPayment',
  props: {
    paymentId: {
      type: String,
      default: '',
      required: true
    },
    orderId: {
      type: String,
      default: '',
      required: true
    }
  },
  setup() {
    return {};
  },
  computed: {
    ...mapGetters({
      accountName: 'account/getAccountName',
      isAuthenticated: 'account/isAuthenticated'
    }),
    currentUrl(): string {
      console.log(window.location.origin);
      return window.location.origin;
    },
    redirectUrl(): string {
      return `${this.currentUrl}/wallet/buytokens/success?order-id=${this.orderId} `;
    }
  },
  methods: {},
  watch: {
    paymentId: function (newVal, oldVal) {
      console.log('paymentId changed');
      console.log('newVal: ', newVal);
      console.log('oldVal: ', oldVal);
    }
  },
  mounted() {
    let url = process.env.DEVELOPMENT
      ? 'https://eu-test.oppwa.com'
      : 'https://eu-prod.oppwa.com';
    let elementExists = document.getElementById('tpScript');
    if (this.paymentId !== '' && !elementExists) {
      let tpScript = document.createElement('script');
      tpScript.id = 'tpScript';
      tpScript.setAttribute(
        'src',
        `${url}/v1/paymentWidgets.js?checkoutId=${this.paymentId}`
      );
      document.head.appendChild(tpScript);
    }
  }
});
</script>

<template lang="pug">
form.paymentWidgets(:action=`${redirectUrl}`, data-brands='VISA MASTER AMEX')
| {{ currentUrl }}
| {{ orderId }}
| {{ redirectUrl }}
</template>

<style lang="sass" scoped></style>
