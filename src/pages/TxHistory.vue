<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { mapGetters } from 'vuex';
import TxCard from 'src/components/txhistory/TxCard.vue';

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
    return { transactions: ref([]), buyOrders: ref([]) };
  },
  computed: {
    ...mapGetters({
      accountName: 'account/cryptoAccountName',
      cryptoIsAuthenticated: 'account/cryptoIsAuthenticated'
    })
  },
  methods: {
    async getBuyOrders() {
      const issuerAPI = axios.create({
        baseURL: process.env.ISSUER_API_ENDPOINT,
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.accountName as string //FIXME this is a hack
        }
      });

      const response = await issuerAPI.get(
        `getorders/${<string>this.accountName}`
      );
      console.log(response.data);

      /* eslint-disable */
      let rawOrders = response.data[0];
      /* eslint-enable */

      let buyOrders: TxCardProps[] = [];
      for (const order of rawOrders) {
        console.log(order);
        buyOrders.push({
          action: 'Buy LEGAL',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          description: order?.item_description as string,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          date: new Date(order?.created),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          amount: order.item_price as number
        });
        console.log(buyOrders);
      }
      // sort buyOrders by date descending
      buyOrders.sort((a, b) => {
        return b.date.getTime() - a.date.getTime();
      });
      this.transactions.push(...buyOrders);
    }
  },
  async mounted() {
    await this.getBuyOrders();
  }
});
</script>

<template lang="pug">
q-page
  q-card(v-if="cryptoIsAuthenticated")
    h3 Transaction History
    q-separator

    TxCard(v-for="(tx, index) in transactions" :key="index" :action="tx.action" :description="tx.description" :date="tx.date" :amount="tx.amount")
    
  q-card(v-else)
    h3 You must be logged in to view this page
    

</template>
