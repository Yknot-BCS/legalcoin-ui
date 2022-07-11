<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';
import axios from 'axios';
import { mapGetters } from 'vuex';
import TokensReceipt from 'src/components/buytokens/TokensReceipt.vue';

export default defineComponent({
  name: 'BuyTokens',
  components: { TokensReceipt },
  setup() {
    const checkoutAPI = axios.create({
      baseURL: process.env.ISSUER_API_ENDPOINT
    });
    return {
      paymentStatus: ref(''),
      spendAmount: ref('0'),
      spendAfterFee: ref(0),
      buyAmount: ref('0'),
      order: ref({ order_id: '' }),
      processingFeePercentage: ref(0.045),
      ratio: ref(1.01), // GBP to LEGAL rate
      checkoutAPI: checkoutAPI,
      paymentId: ref(''),
      minimumAmount: ref(50),
      changingBuyAmount: ref(false)
    };
  },
  computed: {
    ...mapGetters({
      accountName: 'account/getAccountName',
      isAuthenticated: 'account/isAuthenticated',
      account: 'account/account'
    }),
    totalFee(): number {
      return this.processingFee;
    },
    processingFee(): number {
      if (this.changingBuyAmount) {
        return (
          Number(this.spendAfterFee) / (1 - this.processingFeePercentage) -
          this.spendAfterFee
        );
      } else {
        return Number(Number(this.spendAmount) * this.processingFeePercentage);
      }
    },
    displayBuyAmount(): string {
      return Number(this.buyAmount).toFixed(2);
    },
    displayAfterFee(): string {
      return Number(this.spendAfterFee).toFixed(2);
    }
  },
  watch: {
    buyAmount(val) {
      if (this.changingBuyAmount) {
        this.spendAfterFee = val * this.ratio;
        let spendAfterFeeRatio = Number(this.spendAfterFee) + this.totalFee;
        this.spendAmount = Number(spendAfterFeeRatio).toFixed(2);
      }
    },
    spendAmount(val) {
      if (!this.changingBuyAmount) {
        this.spendAfterFee = Number(val) - this.totalFee;
        let buyAfterFeeRatio = Number(this.spendAfterFee) / this.ratio;
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
          description: `Bought ${this.buyAmount} LEGAL`,
          value: this.spendAmount,
          symbol: process.env.LC_SYMBOL,
          precision: process.env.LC_PRECISION,
          chain: !process.env.DEVELOPMENT ? 'TLOS' : 'TLOSTEST', // FIXME should be TLOSTEST
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
      // FIXME the checkout.com secret key is not secure
      // get country code from user's IP
      const ip = await axios.get('https://api.ipify.org');
      const countryCode = await axios.get(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `https://ipapi.co/${ip.data}/country_code`
      );

      try {
        if (this.order.order_id != '') {
          let body = {
            amount: Number(this.spendAmount) * 100,
            currency: 'GBP',
            reference: String(this.order.order_id),
            metadata: {
              description: this.accountName as string
            },
            billing: {
              address: {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                country: countryCode?.data
              }
            },
            customer: {
              name: `${this.$store.state.account.profile.name} ${this.$store.state.account.profile.surname}`,
              email: this.$store.state.account.profile.email
            },
            success_url: `${window.location.origin}/buytokens/success`,
            failure_url: `${window.location.origin}/buytokens/failure`,
            cancel_url: `${window.location.origin}/buytokens/checkout`
          };

          const response = await this.checkoutAPI.post(
            '/hosted-payments/cko',
            body
          );

          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          let redirectUrl = response.data.data._links.redirect.href as string;
          this.$q.loading.hide();
          window.location.href = redirectUrl;
        } else {
          this.$q.notify({
            type: 'negative',
            message: 'Failed to place order, try again'
          });
        }
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
      if (this.isAuthenticated && this.account.isLoggedIn) {
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
  .row.justify-center
    q-form(@submit='tryBuyTokens')
      .row.justify-center
        q-card.q-mt-xl(v-if='paymentStatus === "checkout"')
          q-card-section 
            .text-wallet-heading.text-grey-8
              | Buy LEGAL

          q-card-section.text-body2.q-pb-xs
            | I want to spend:
          q-card-section.text-wallet-bottomline
            q-input(
              outlined,
              label='Amount',
              placeholder='0.00',
              v-model='spendAmount',
              :rules='[(val) => val >= minimumAmount || `Value must be larger than ${minimumAmount}`, (val) => val >= 0 || "Value must be positive"]',
              @focus='changingBuyAmount = false'
            )
              template(v-slot:append)
              | GBP
          q-separator
          q-card-section.text-body2.q-pb-xs
            | I want to buy:
          q-card-section.text-wallet-bottomline
            q-input(
              outlined,
              label='Amount',
              placeholder='0.00',
              v-model='buyAmount',
              @focus='changingBuyAmount = true',
              :rules='[(val) => val >= minimumAmount || `Value must be larger than ${minimumAmount}`, (val) => val >= 0 || "Value must be positive"]'
            )
              template(v-slot:append)
              | LEGAL
          q-separator
          q-card-section.text-wallet-heading.text-grey-8
            | Summary
          q-card-section.text-wallet-bottomline
            //- Dropdown with price, network fee and processing fee
            q-expansion-item.text-wallet-bottomline(
              expand-separator,
              :label='`You get ${displayBuyAmount} LEGAL for £ ${spendAmount}`'
            ) 
              //- template(v-slot:header)                
              //-     q-card-section
              //-         p.col-12
              //-             | You get 
              //-             strong {{displayBuyAmount}} LEGAL
              //-             |  for  
              //-             strong &#163; {{spendAmount}}

              q-card
                q-card-section.row.justify-between.text-wallet-bottomline
                  .col
                    | {{ displayBuyAmount }} LEGAL @ &#163; {{ ratio.toFixed(2) }}
                  | &#163; {{ displayAfterFee }}
              //- q-card
              //-     q-card-section
              //-         | Network Fee: 0.00 GBP
              q-card
                q-card-section.row.justify-between.text-wallet-bottomline
                  .col
                    | Processing Fee:
                    q-icon(name='fa-solid fa-circle-info')
                      q-tooltip(
                        anchor='top middle',
                        self='center middle',
                        max-width='200px'
                      )
                        | This is charged by LegalCoin to cover the costs levied by payment providers such as Visa & Mastercard. This may vary based on the payment method you choose later.
                  | as low as &#163; {{ processingFee.toFixed(2) }}
          q-card-section
            .row.justify-center
              q-btn.outline-btn(flat, label='CONTINUE', type='submit')
          q-card-section.text-wallet-bottomline
            | By continuing you agree to the terms and conditions

    //- Show payment status
    TokensReceipt(
      v-if='paymentStatus === "success" || paymentStatus === "failure"',
      :paymentStatus='paymentStatus',
      :paymentId='paymentId'
    )
</template>

<style lang="sass" scoped></style>
