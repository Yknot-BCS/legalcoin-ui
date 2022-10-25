<script lang="ts">
import { defineComponent, ref } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { Asset } from '@greymass/eosio';
import { QForm } from 'quasar';
import { api } from 'src/api';

export default defineComponent({
  name: 'KYCForm',
  components: {},
  props: {},
  setup() {
    return {
      to: ref(process.env.DEPOSIT_ACCOUNT),
      amount: ref(''),
      memo: ref(''),
      transaction: ref({ transactionId: '' }),
      balance: ref(''),
      polling: ref(),
      depositCompleted: ref(false),
      depositedAmount: ref('0.00')
    };
  },
  computed: {
    ...mapGetters({
      accountName: 'account/getAccountName',
      isAuthenticated: 'account/isAuthenticated',
      account: 'account/account'
    })
  },
  async mounted() {
    await this.getBalance();

    // await this.getDepositedAmount(); //TODO taken out for now

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
            from: (this.accountName as string).toLowerCase(),
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

    async updateOfframp() {
      // make graphql mutation
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      let userId = this.account.profile._id as string;
      let txId = this.transaction?.transactionId;
      // eslint-disable-next-line
      await api.accounts.mutation(`
        {
          offrampNew(input: {
          userId: "${userId}",
          txId: "${txId}",
          status: "pending",
          amount: "${parseFloat(this.amount).toFixed(
            Number(process.env.LC_PRECISION)
          )} ${process.env.LC_SYMBOL}"
        })
        }
      `);
    },

    async trySend() {
      try {
        await this.send();
        await this.updateOfframp();
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Sent'
        });
        this.amount = '';
        (this.$refs['sendForm'] as QForm).reset();
        this.depositCompleted = true;
        this.$emit('depositComplete', this.depositCompleted);
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
    },

    async getDepositedAmount() {
      // get table rows
      const rows = await api.eosioCore.v1.chain.get_table_rows({
        code: process.env.DEPOSIT_ACCOUNT,
        scope: process.env.LC_SYMBOL,
        table: 'deposits',
        limit: 1000,
        json: true
      });
      if (rows.rows.length > 0) {
        const deposits = rows.rows.filter(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (row) => row.from === this.accountName
        );
        // sum up the quantity from each row
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const total: number = deposits.reduce((acc, cur) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          return Number(acc) + Asset.fromString(cur.quantity).value;
        }, 0);
        this.depositedAmount = total.toFixed(Number(process.env.LC_PRECISION));
      }
    }
  }
});
</script>

<template lang="pug">
q-card.q-mt-sm(v-if='!depositCompleted')
  q-card-section.q-pa-md
    q-form(@submit='trySend', ref='sendForm')
      .row.justify-center
        | Balance: {{ balance }}
        | LEGAL

      //- .row.justify-center
      //-   | Already Deposited: {{ depositedAmount }}
      //-   | LEGAL

      .row.justify-center.q-mt-md
        q-input(
          outlined,
          v-model='amount',
          label='Amount',
          :rules='[validateInputAmount]'
        )

      .row.justify-center
        q-btn(type='submit', color='primary', label='Send')
q-card.q-mt-sm(v-else)
  q-card-section.q-pa-md
    .row.justify-center
      | Deposit completed
</template>

<style lang="sass"></style>
