<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';
import { mapGetters } from 'vuex';
import { requiredRule } from 'src/pages/auth/inputRules';

export default defineComponent({
  name: 'WithdrawTokens',
  data() {
    return {
      amount: '',
      bank: '',
      acc: '',
      branch: '',
      swiftCode: '',
      submitResult: [],
      swift: false,
      balanceErrror: 'Your balance is less than the desired amount'
    };
  },

  setup() {
    return {
      balance: ref('0'),
      nftCount: ref(0),
      nftValue: ref(0),
      valueRatio: ref(1.0),
      polling: ref(),
      requiredRule
    };
  },
  computed: {
    ...mapGetters({
      accountName: 'account/getAccountName',
      isAuthenticated: 'account/isAuthenticated'
    }),
    gbpValue(): string {
      return (Number(this.balance) * (1 / this.valueRatio)).toFixed(2);
    }
  },
  methods: {
    logForm() {
      console.log(
        this.amount,
        this.bank,
        this.acc,
        this.branch,
        this.swiftCode
      );
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
q-page.q-pt-xl
  .row.justify-center
    q-card.q-my-xl(v-if='isAuthenticated')
      q-card-section
        .text-h4.text-grey-8
          | Withdraw Tokens
      q-separator
      q-card-section
        .text-heading.text-grey-8
          | Balance
        .text-wallet.text-bold 
          | {{ balance }} LEGAL &#8776 £ {{ gbpValue }} (GBP)
      q-separator
      q-card-section
        q-form.q-gutter-md(@submit='onSubmit')
          q-input(
            v-model='amount',
            label='Amount (in LEGAL)',
            lazy-rules,
            type='number',
            :rules='[requiredRule, (val) => (val && val <= 100) || "Too damn high"]'
          )
          .div(v-show='swift')
            q-input(
              v-model='swiftCode',
              label='Swift Code',
              lazy-rules,
              type='text',
              :rules='[requiredRule, (val) => (val && val.length >= 8) || "Swift codes cannot be less than 8 characters", (val) => (val && val.length <= 11) || "Swift codes cannot be more than 11 characters"]'
            )
          .div(v-show='!swift')
            q-input(
              v-model='bank',
              label='Bank Name',
              lazy-rules,
              :rules='[requiredRule]'
            )
            q-input(
              v-model='acc',
              label='Account Number',
              lazy-rules,
              type='number',
              :rules='[requiredRule]'
            )
            q-input(
              v-model='branch',
              label='Branch Code',
              lazy-rules,
              type='number',
              :rules='[requiredRule]'
            )
          q-checkbox(name='swift', v-model='swift', label='Swift Payment')
          .row.justify-center
            q-btn.col(label='Submit', type='submit', color='primary')
        q-card(v-if='submitResult.length > 0')
          q-card-section
            | Submitted form data
          q-separator
          q-card-section
            .div(v-for='(item, index) in submitResult', :key='index') | {{ item.name }} = {{ item.value }}
    q-card.q-my-xl(v-else)
      q-card-section
        h3 You must be logged in to view this page
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
