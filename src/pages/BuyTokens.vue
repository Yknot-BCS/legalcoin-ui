<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';
import axios from 'axios';
import { Checkout } from 'checkout-sdk-node';
import { mapGetters } from 'vuex';
import fetch from 'node-fetch';

export default defineComponent({
  name: 'BuyTokens',
  components: {},
  setup() {
    return {
      paymentStatus: ref(''),
      spendAmount: ref(''),
      buyAmount: ref(''),
      order: ref({ order_id: '' }),
      cko: ref<Checkout>(
        new Checkout(process.env.CKO_SECRET_KEY, {
          pk: process.env.CKO_PUBLIC_KEY
        })
      )
    };
  },
  computed: {
    ...mapGetters({ account: 'account/cryptoAccountName' }),
    ...mapGetters({ isAuthenticated: 'account/cryptoIsAuthenticated' })
  },
  methods: {
    async createBuyOrder() {
      console.log(process.env.ISSUER_API_ENDPOINT);
      const issuerAPI = axios.create({
        baseURL: process.env.ISSUER_API_ENDPOINT
      });
      console.log('issuerAPI', issuerAPI);
      let params = {
        name: 'Buy LEGAL',
        description: 'Fee=?',
        value: this.spendAmount,
        symbol: process.env.LC_SYMBOL,
        precision: 4,
        chain: !process.env.DEVELOPMENT ? 'TLOS' : 'TLOSTEST',
        account: this.account as string,
        contract: process.env.LC_CONTRACT
      };
      const response = await issuerAPI.get('/order', { params: params });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.order = response.data;
      console.log(response.data);
      console.log(response.headers);
      //   return response.data;
    },
    async goToCheckout() {
      console.log(this.cko);
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const payment = await this.cko.payments.get(
          'pay_w6ktefehnck2zlguyvocdvuhry'
        );
        console.log(payment);
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        console.log(error.body);
      }

      //   try {
      //     const hosted = await this.cko.hostedPayments.create({
      //       amount: Number(this.spendAmount) * 100,
      //       currency: 'GBP',
      //       reference: this.order.order_id,
      //       //   billing: {
      //       //     address: {
      //       //       address_line1: 'Checkout.com',
      //       //       address_line2: '90 Tottenham Court Road',
      //       //       city: 'London',
      //       //       state: 'London',
      //       //       zip: 'W1T 4TJ',
      //       //       country: 'GB'
      //       //     }
      //       //   },
      //       success_url: 'localhost:8080/wallet/buytokens/success',
      //       cancel_url: 'localhost:8080/wallet/buytokens/checkout',
      //       failure_url: 'localhost:8080/wallet/buytokens/failure'
      //     });
      //     console.log(hosted);
      //     // Redirect to hosted payment page
      //     // window.location.href = <string>hosted._links.redirect.href;
      //   } catch (err) {
      //     console.log(err);
      //   }
    },
    async tryBuyTokens() {
      console.log('tryBuyTokens');
      //   TODO if authenticated, create buy order
      if (this.isAuthenticated) {
        // await this.createBuyOrder();
        //   TODO go to processing payment page
        //  TODO once order is created, redirect to checkout.com
        await this.goToCheckout();
      } else {
        this.$q.notify({
          type: 'negative',
          message: 'Please log in first'
        });
      }
    }
  },
  mounted() {
    console.log('mounted');
    // TODO handle checkout, failure, success params
    console.log(this.$route.params.status);
    this.paymentStatus = <string>this.$route.params.status;
  }
});
</script>

<template lang="pug">
q-page 
    q-card(v-if="paymentStatus === 'checkout'")
        h3 Buy LEGAL
        q-card-section
            | I want to spend
        q-card-section
            q-input(
                type="number"
                label="Amount"
                placeholder="0.00"
                v-model="spendAmount"
                )
        q-card-section
            | I want to buy
        q-card-section
            q-input(
                type="number"
                label="Amount"
                placeholder="0.00"
                v-model="buyAmount"
                )
        q-card-section
            | Summary
        q-card-section
            //- Dropdown with price, network fee and processing fee
            q-expansion-item(
                expand-separator
                label="You get 1 LEGAL token for 1.00 GBP")      
                q-card
                    q-card-section
                        | 1 LEGAL @ 1.00 GBP
                q-card
                    q-card-section
                        | Network Fee: 0.00 GBP
                q-card
                    q-card-section
                        | Processing Fee: 0.00 GBP
        q-card-section
            div(class="fit row wrap justify-center")
                q-btn(
                    color="primary"
                    label="Continue"
                    @click="tryBuyTokens()"
                    )
        q-card-section
            | By continuing you agree to the terms and conditions

        q-card-section(v-if="true")
            iframe(
                src="https://pay.sandbox.checkout.com/page/hpp_H6KwEaJhugAl"
                width="100%"
                height="500px"
                frameborder="0"                
                )
    q-card(v-if="paymentStatus === 'failure'")
        q-card-section
            | Payment failed
        q-card-section
            | Reason
        q-card-section
            q-btn(
                color="primary"
                label="Back"
                @click="$router.push({name: 'wallet'})"
                )

    q-card(v-if="paymentStatus === 'success'")
        q-card-section
            | Payment Success
        q-card-section
            | Info
        q-card-section
            q-btn(
                color="primary"
                label="View Balance"
                @click="$router.push({name: 'wallet'})"
                )

</template>
