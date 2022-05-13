<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'BuyTokens',
  components: {},
  setup() {
    return {
      spendAmount: ref(''),
      buyAmount: ref('')
    };
  },
  methods: {
    async createBuyOrder() {
      let order = {};
      console.log(process.env.ISSUER_API_ENDPOINT);
      const issuerAPI = axios.create({
        baseURL: process.env.ISSUER_API_ENDPOINT
      });
      console.log('issuerAPI', issuerAPI);
      let params = {
        name: 'Buy Legal',
        description: 'Oi',
        value: this.spendAmount,
        symbol: 'DEWIE',
        precision: 4,
        chain: 'TLOSTEST',
        account: 'fuzztestnets',
        contract: 'dewaldtokens'
      };
      const response = await issuerAPI.get('/order', { params: params });
      console.log(response.data);
      //   return response.data;
    },
    goToCheckout() {
      let checkout = {};
    },
    async tryBuyTokens() {
      console.log('tryBuyTokens');
      //   TODO if authenticated, create buy order
      await this.createBuyOrder();
      //  TODO once order is created, redirect to checkout.com
    }
  }
});
</script>

<template lang="pug">
q-page 
    q-card()
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

</template>
