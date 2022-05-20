<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';
import axios from 'axios';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'BuyTokens',
  components: {},
  setup() {
    return {
      paymentStatus: ref(''),
      spendAmount: ref(''),
      buyAmount: ref(''),
      order: ref({ order_id: '' }),
      processingFeePercent: ref(0.02)
    };
  },
  computed: {
    ...mapGetters({ account: 'account/cryptoAccountName' }),
    ...mapGetters({ cryptoIsAuthenticated: 'account/cryptoIsAuthenticated' })
  },
  watch: {
    buyAmount(val) {
      this.spendAmount = (val * (1 + this.processingFeePercent)).toFixed(2);
    },
    spendAmount(val) {
      this.buyAmount = (val / (1 + this.processingFeePercent)).toFixed(2);
    }
  },
  methods: {
    async createBuyOrder() {
      console.log(process.env.ISSUER_API_ENDPOINT);
      const issuerAPI = axios.create({
        baseURL: process.env.ISSUER_API_ENDPOINT
      });
      let params = {
        name: 'Buy LEGAL',
        description: 'Fee=?',
        value: this.spendAmount,
        symbol: process.env.LC_SYMBOL,
        precision: 2,
        chain: !process.env.DEVELOPMENT ? 'TLOS' : 'TLOSTEST',
        account: this.account as string,
        contract: process.env.LC_CONTRACT
      };
      const response = await issuerAPI.get('/order', { params: params });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.order = response.data;
    },
    async goToPaygate() {
      try {
        const checkoutAPI = axios.create({
          baseURL: process.env.DEVELOPMENT
            ? 'https://api.sandbox.checkout.com'
            : 'https://api.checkout.com',
          headers: {
            'Content-Type': 'application/json',
            Authorization: process.env.CKO_SECRET_KEY
          }
        });

        let body = {
          amount: Number(this.spendAmount) * 100,
          currency: 'GBP',
          reference: String(this.order.order_id),
          metadata: {
            description: 'Issue from LegalCoin'
          },
          billing: {
            address: {
              country: 'GB'
            }
          },
          customer: {
            name: `${this.$store.state.account.profile.name} ${this.$store.state.account.profile.surname}`,
            email: this.$store.state.account.profile.email // TODO get from store
          },
          success_url: `${process.env.APP_URL}wallet/buytokens/success`, // TODO get URL dynamically
          failure_url: `${process.env.APP_URL}wallet/buytokens/failure`,
          cancel_url: `${process.env.APP_URL}wallet/buytokens/checkout`
        };

        const response = await checkoutAPI.post('/hosted-payments', body);
        console.log(response);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        let redirectUrl = response.data._links.redirect.href as string;
        this.$q.loading.hide();
        window.location.href = redirectUrl;
      } catch (error) {
        this.$q.loading.hide();
        console.log(error);
      }
    },
    async tryBuyTokens() {
      console.log('tryBuyTokens');
      this.$q.loading.show({
        message: 'Going to payment gateway. Hang on...'
      });
      if (this.cryptoIsAuthenticated) {
        await this.createBuyOrder();
        await this.goToPaygate();
      } else {
        this.$q.loading.hide();
        this.$q.notify({
          type: 'negative',
          message: 'Please log in first'
        });
      }
    }
  },
  mounted() {
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

    //- If payment has failed
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
    //- If payment has succeeded
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
