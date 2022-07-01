<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { mapGetters } from 'vuex';
import TxCard from 'src/components/txhistory/TxCard.vue';
import crypto from 'crypto';

// define a type with the properties of the TxCard component
export interface TxCardProps {
  action: string;
  description: string;
  date: Date;
  amount: number;
}

export default defineComponent({
  name: 'Template',
  components: { TxCard },
  setup() {
    return {
      transactions: ref([]),
      buyOrders: ref([]),
      currentPage: ref(1),
      txPerPage: ref(10),
      loading: ref(false)
    };
  },
  computed: {
    ...mapGetters({
      accountName: 'account/getAccountName',
      isAuthenticated: 'account/isAuthenticated'
    }),
    maxPages(): number {
      return Math.ceil(this.transactions.length / this.txPerPage);
    },
    pagedTransactions(): TxCardProps[] {
      return <TxCardProps[]>(
        this.transactions.slice(
          (this.currentPage - 1) * this.txPerPage,
          this.currentPage * this.txPerPage
        )
      );
    }
  },
  methods: {
    async getBuyOrders() {
      try {
        const hash = crypto
          .createHmac('sha256', process.env.ISSUER_SECRET)
          .update(this.accountName)
          .digest('hex');

        const issuerAPI = axios.create({
          baseURL: process.env.ISSUER_API_ENDPOINT,
          headers: {
            'Content-Type': 'application/json',
            Authorization: hash
          }
        });

        const response = await issuerAPI.get(
          `getorders/${<string>this.accountName}`
        );
        //   console.log(response.data);

        /* eslint-disable */
        let rawOrders = response.data[0];
        /* eslint-enable */

        let buyOrders: TxCardProps[] = [];
        for (const order of rawOrders) {
          // console.log(order);
          buyOrders.push({
            action: 'Buy LEGAL',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            description: order?.item_description as string,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            date: new Date(order?.created),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            amount: order.item_price as number
          });
          // console.log(buyOrders);
        }
        // sort buyOrders by date descending
        buyOrders.sort((a, b) => {
          return b.date.getTime() - a.date.getTime();
        });
        this.transactions.push(...buyOrders);
      } catch (error) {
        this.loading = false;
        console.error(error);
      }
    }
  },
  async mounted() {
    this.loading = true;
    await this.getBuyOrders();
    this.loading = false;
  }
});
</script>

<template lang="pug">
q-page
  .row.justify-center
    q-card.q-my-lg(v-if='isAuthenticated')
      q-card-section
        .text-body1.text-grey-8
          | Transaction History

      q-card-section(v-if='transactions.length > 0')
        TxCard(
          v-for='(tx, index) in pagedTransactions',
          :key='index',
          :action='tx.action',
          :description='tx.description',
          :date='tx.date',
          :amount='tx.amount'
        )
      q-card-section(v-else-if='loading')
        .row.justify-center
          q-spinner-clock(color='primary', size='2em')
      q-card-section(v-else)
        | No transaction history

      q-card-section.q-pa-lg.flex.flex-center
        q-pagination(
          v-model='currentPage',
          :max='maxPages',
          direction-links,
          :max-pages='5',
          boundary-numbers
        )
    q-card(v-else)
      h3 You must be logged in to view this page
</template>

<style lang="sass" scoped></style>
