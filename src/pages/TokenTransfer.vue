<script lang="ts">
import { defineComponent, ref } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { Asset } from '@greymass/eosio';
import { QForm } from 'quasar';

export default defineComponent({
  name: 'TokenTransfer',
  components: {},
  setup() {
    return {
      to: ref(''),
      amount: ref(''),
      memo: ref(''),
      transaction: ref({}),
      balance: ref(''),
      polling: ref()
    };
  },
  computed: {
    ...mapGetters({
      accountName: 'account/getAccountName',
      isAuthenticated: 'account/isAuthenticated'
    })
  },
  async mounted() {
    await this.getBalance();

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.polling = setInterval(async () => {
      void (await this.getBalance());
    }, 5000);
  },

  methods: {
    ...mapActions({ sendTransaction: 'account/sendTransaction' }),

    async getBalance() {
      if (this.isAuthenticated) {
        const tokenBal: Asset[] = await this.$api.getTokenBalances(
          process.env.LC_CONTRACT,
          this.accountName
        );
        if (tokenBal.length > 0) {
          this.balance = tokenBal[0].value.toFixed(2);
        }
      }
    },

    async accountExistsOnChain(account: string) {
      try {
        await this.$api.getAccount(account);
        return true;
      } catch (error) {
        return false;
      }
    },

    validateInputAmount(val: number) {
      return (val > 0 && !isNaN(val)) || 'Incorrect amount';
    },

    async send() {
      if (!(await this.accountExistsOnChain(this.to))) {
        this.$q.notify({
          type: 'negative',
          message: `Account ${this.to} does not exist`
        });
        return;
      }

      const actions = [
        {
          account: process.env.LC_CONTRACT,
          name: 'transfer',
          data: {
            from: (<string>this.accountName).toLowerCase(),
            to: this.to,
            quantity: `${parseFloat(this.amount).toFixed(
              Number(process.env.LC_PRECISION)
            )} ${process.env.LC_SYMBOL}`,
            memo: this.memo
          }
        }
      ];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.transaction = await this.sendTransaction({ actions });
    },

    async trySend() {
      try {
        await this.send();
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Sent'
        });
        this.memo = '';
        this.amount = '';
        this.to = '';
        (this.$refs['sendForm'] as QForm).reset();
      } catch (e: unknown) {
        if (typeof e === 'string') {
          e.toUpperCase(); // works, `e` narrowed to string
        } else if (e instanceof Error) {
          this.$q.notify({
            color: 'red-4',
            textColor: 'white',
            message: e.message
          });
        }
      }
    }
  }
});
</script>

<template lang="pug">
q-page.q-py-xl
  .row.justify-center
    q-card
      q-form(@submit='trySend', ref='sendForm')
        q-card-section
          .text-heading.text-grey-8
            | Transfer LEGAL
        q-card-section
          //- Balance
          .row.justify-center
            | Balance: {{ balance }}
            | LEGAL
          //- To
          .row.justify-center.q-mt-md
            q-input.col-10(
              outlined,
              autocapitalize='off',
              bottom-slots,
              v-model='to',
              label='To',
              counter,
              maxlength='12',
              :rules='[accountExistsOnChain]',
              error-message='Account does not exist',
              lazy-rules,
              debounce='1000',
              no-error-icon
            )

          //- Amount
          .row.justify-center.q-mt-md
            q-input.col-10(
              outlined,
              bottom-slots,
              suffix='LEGAL',
              v-model='amount',
              label='Amount',
              maxlength='12',
              no-error-icon,
              :rules='[validateInputAmount]'
            )

          //- Memo 
          .row.justify-center.q-mt-md
            q-input.col-10(
              outlined,
              bottom-slots,
              v-model='memo',
              label='Memo',
              counter,
              maxlength='200',
              type='textarea'
            )

          //- Submit
          .row.justify-center
            q-btn.col-3(
              size='lg',
              color='primary',
              dense,
              no-shadow,
              label='Send',
              type='submit'
            )
</template>
