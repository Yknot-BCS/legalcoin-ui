<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { mapGetters } from 'vuex';
import TxCard from 'src/components/txhistory/TxCard.vue';

export default defineComponent({
  name: 'Template',
  components: { TxCard },
  setup() {
    return { transactions: ref([]) };
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
      this.transactions = response.data[0]; 
      /* eslint-disable */
    }
  },
  async mounted() {
    await this.getBuyOrders();
  }
});
</script>

<template lang="pug">
q-page
  q-card
    h3 Transaction History
    q-separator
    TxCard
    .div
        | {{transactions}}
    

</template>
