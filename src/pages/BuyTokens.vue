<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';
import axios from 'axios';
import { mapGetters } from 'vuex';
import TokensReceipt from 'src/components/BuyTokens/TokensReceipt.vue';

export default defineComponent({
  name: 'BuyTokens',
  components: { TokensReceipt },
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
      paymentStatus: ref(''),
      spendAmount: ref('0'),
      buyAmount: ref('0'),
      order: ref({ order_id: '' }),
      processingFee: ref(3.99),
      ratio: ref(1.01), // GBP to LEGAL rate
      checkoutAPI: checkoutAPI,
      paymentId: ref(''),
      minimumAmount: ref(50),
      changingBuyAmount: ref(false)
    };
  },
  computed: {
    ...mapGetters({
      accountName: 'account/cryptoAccountName',
      cryptoIsAuthenticated: 'account/cryptoIsAuthenticated',
      account: 'account/account'
    }),
    totalFee(): number {
      return this.processingFee;
    },
    displayBuyAmount(): string {
      return Number(this.buyAmount).toFixed(2);
    },
    displayAfterFee(): string {
      return Number(Number(this.spendAmount) - this.totalFee).toFixed(2);
    }
  },
  watch: {
    buyAmount(val) {
      if (this.changingBuyAmount) {
        let spendAfterFee = Number(val) + this.totalFee;
        let spendAfterFeeRatio = spendAfterFee * this.ratio;
        this.spendAmount = Number(spendAfterFeeRatio).toFixed(2);
      }
    },
    spendAmount(val) {
      if (!this.changingBuyAmount) {
        let buyAfterFee = Number(val) - this.totalFee;
        let buyAfterFeeRatio = buyAfterFee / this.ratio;
        this.buyAmount = Number(buyAfterFeeRatio).toFixed(2);
      }
    }
  },
  methods: {
    async createBuyOrder() {
      console.log(process.env.ISSUER_API_ENDPOINT);
      try {
        const issuerAPI = axios.create({
          baseURL: process.env.ISSUER_API_ENDPOINT
        });
        let params = {
          name: 'Buy LEGAL',
          description: 'Fee=?',
          value: this.spendAmount,
          symbol: process.env.LC_SYMBOL,
          precision: process.env.LC_PRECISION,
          chain: !process.env.DEVELOPMENT ? 'TLOS' : 'TLOSTEST',
          account: this.accountName as string,
          contract: process.env.LC_CONTRACT
        };
        const response = await issuerAPI.get('/order', { params: params });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.order = response.data;
      } catch (error) {
        this.$q.loading.hide();
        console.error(error);
      }
    },
    async goToPaygate() {
      try {
        let body = {
          amount: Number(this.spendAmount) * 100,
          currency: 'GBP',
          reference: String(this.order.order_id),
          metadata: {
            description: this.accountName as string
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

        const response = await this.checkoutAPI.post('/hosted-payments', body);
        console.log(response);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        let redirectUrl = response.data._links.redirect.href as string;
        this.$q.loading.hide();
        window.location.href = redirectUrl;
      } catch (error) {
        this.$q.loading.hide();
        console.error(error);
      }
    },
    async tryBuyTokens() {
      console.log('tryBuyTokens');
      this.$q.loading.show({
        message: 'Navigating to payment gateway. Hang on...'
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (this.cryptoIsAuthenticated && this.account.isAuthenticated) {
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
    this.spendAmount = '100';
    this.paymentStatus = <string>this.$route.params.status;

    if (this.paymentStatus === 'success' || this.paymentStatus === 'failure') {
      console.log(this.paymentStatus);
      this.paymentId = <string>this.$route.query['cko-payment-id'];
    }
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
                :rules="[ val => val >= minimumAmount || `Value must be larger than ${minimumAmount}` ]"
                @focus="changingBuyAmount = false"
                )
        q-card-section
            | I want to buy
        q-card-section
            q-input(
                type="number"
                label="Amount"
                placeholder="0.00"
                v-model="buyAmount"
                @focus="changingBuyAmount = true"                
                )
        q-card-section
            | Summary
        q-card-section
            //- Dropdown with price, network fee and processing fee
            q-expansion-item(
                expand-separator
                :label="`You get ${displayBuyAmount} LEGAL for £ ${this.spendAmount}`"                
                )  
                //- template(v-slot:header)                
                //-     q-card-section
                //-         p.col-12
                //-             | You get 
                //-             strong {{displayBuyAmount}} LEGAL
                //-             |  for  
                //-             strong &#163; {{spendAmount}}
          
  
                q-card
                    q-card-section.fit.row.justify-between
                        .col
                            | {{displayBuyAmount}} LEGAL @ &#163; {{ratio.toFixed(2)}}
                        | &#163; {{displayAfterFee}}
                //- q-card
                //-     q-card-section
                //-         | Network Fee: 0.00 GBP
                q-card
                    q-card-section.fit.row.justify-between
                        .col
                            | Processing Fee: 
                            q-icon(name="fa-solid fa-circle-info")
                                q-tooltip(anchor="top middle" self="center middle" max-width="200px")
                                    | This is charged by LegalCoin to cover the costs levied by payment providers such as Visa & Mastercard. This may vary based on the payment method you choose later.
                        | as low as &#163; {{processingFee.toFixed(2)}}
        q-card-section
            div(class="fit row wrap justify-center")
                q-btn(
                    color="primary"
                    label="Continue"
                    @click="tryBuyTokens()"
                    )
        q-card-section
            | By continuing you agree to the terms and conditions

    
    //- Show payment status
    TokensReceipt(v-if="paymentStatus === 'success' || paymentStatus === 'failure'" :paymentStatus="paymentStatus" :paymentId="paymentId")
    

</template>