<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';
import axios from 'axios';
import { mapGetters } from 'vuex';
import TokensReceipt from 'src/components/buytokens/TokensReceipt.vue';
import TPCardPayment from 'src/components/buytokens/TPCardPayment.vue';

export default defineComponent({
  name: 'BuyTokens',
  components: { TokensReceipt, TPCardPayment },
  setup() {
    const issuerAPI = axios.create({
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
      issuerAPI: issuerAPI,
      paymentId: ref(''),
      minimumAmount: ref(50),
      changingBuyAmount: ref(false),
      redirectString: ref(''),
      tpId: ref(''),
      paygateSelected: ref(false)
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
    },
    currentUrl(): string {
      return window.location.origin;
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
      try {
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
        const response = await this.issuerAPI.get('/order', { params: params });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.order = response.data;
      } catch (error) {
        this.$q.loading.hide();
        console.error(error);
      }
    },
    async goToPaygate() {
      try {
        if (this.order.order_id != '') {
          let body = {
            entityId: process.env.PG_ENTITY_ID,
            amount: Number(this.spendAmount),
            currency: 'GBP',
            paymentType: 'DB',
            merchantTransactionId: this.order.order_id,
            descriptor: this.accountName as string
          };

          const response = await this.issuerAPI.post(
            '/hosted-payments/tp',
            body
          );
          // console.log(response);

          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          this.tpId = response.data.data.id as string;
          // console.log(this.tpId);

          this.paygateSelected = true;

          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          // let redirectUrl = response.data.data._links.redirect.href as string;
          this.$q.loading.hide();
          // window.location.href = redirectUrl;
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

    if (this.$route.query.redirect) {
      this.redirectString = `?redirect=${<string>this.$route.query.redirect}`;
    }

    if (this.paymentStatus === 'success' || this.paymentStatus === 'failure') {
      this.paymentId = <string>this.$route.params.orderId;
    }
  }
});
</script>

<template lang="pug">
img.polygon.tr.animated.fadeInRight.slower(src='~assets/polygons/pg1.svg')
img.polygon.tr.animated.fadeInRight.slow(src='~assets/polygons/pg2.svg')
img.polygon.tr(src='~assets/polygons/pg3.svg')
img.polygon.br.animated.fadeInLeft.slow(src='~assets/polygons/pg4.svg')
img.polygon.br.animated.fadeInLeft.slower(src='~assets/polygons/pg5.svg')
img.polygon.br(src='~assets/polygons/pg6.svg')
q-page.q-py-xl
  .row.justify-center
    q-form(@submit='tryBuyTokens')
      .row.justify-center
        q-card(v-if='paymentStatus === "checkout" && !paygateSelected')
          q-card-section 
            .text-heading.text-grey-8
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
                .col.text-primary
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
                .col.text-primary
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

    //- Payment Methods
    TPCardPayment(
      v-if='tpId !== ""',
      :paymentId='tpId',
      :orderId='String(order.order_id)'
    )

    //- Show payment status
    TokensReceipt(
      v-if='paymentStatus === "success" || paymentStatus === "failure"',
      :paymentStatus='paymentStatus',
      :paymentId='paymentId'
    )
</template>

<style lang="sass" scoped>
.polygon
  position: absolute
  z-index: -1
  &.tr
    right: 0rem
    top: 0rem
  &.br
    left: 0rem
    bottom: 0rem
</style>
