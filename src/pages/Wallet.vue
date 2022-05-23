<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Asset } from '@greymass/eosio';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'Wallet',
  components: {},
  setup() {
    return { balance: ref(''), nftCount: ref(0) };
  },
  computed: {
    ...mapGetters({
      account: 'account/cryptoAccountName',
      cryptoIsAuthenticated: 'account/cryptoIsAuthenticated'
    })
  },
  async mounted() {
    console.log(this.account);
    if (this.cryptoIsAuthenticated) {
      const tokenBal: Asset[] = await this.$api.getTokenBalances(
        process.env.LC_CONTRACT,
        this.account
      );
      this.balance = tokenBal[0].value.toFixed(2);
      //   console.log(tokenBal[0].value);
    }
  }
});
</script>

<template lang="pug">
q-page
    q-card
      q-card-section
        | My Balance
      q-card-section
        .text-bold    
            | {{balance}} LEGAL
        .text
            | {{balance}} (GBP)
      q-separator.q-mx-md
      q-card-section
        .text-bold  
            | {{nftCount}} NFTS
        .text
            | xxx (LEGAL)
      q-separator.q-mx-md
      q-card-section
        | Options
        .fit.row.wrap.justify-center.q-mt-sm
            .row.col-6
                q-btn(
                    color="primary"
                    label="BUY LEGAL"
                    @click="$router.push({name: 'buytokens', params: {status: 'checkout'}})"
                    ).col.q-mx-sm.q-mt-sm
            .row.col-6
                q-btn(
                    color="primary"
                    label="WITHDRAW"
                    @click="$router.push({name: 'withdraw', params: {status: 'checkout'}})"
                    ).col.q-mx-sm.q-mt-sm
            .row.col-6
                q-btn(
                    color="primary"
                    label="BUY NFT"
                    @click="$router.push({name: 'buytokens', params: {status: 'checkout'}})"
                    ).col.q-mx-sm.q-mt-sm
            .row.col-6
                q-btn(
                    color="primary" 
                    label="SELL NFT"
                    @click="$router.push({name: 'withdraw', params: {status: 'checkout'}})"
                    ).col.q-mx-sm.q-mt-sm   
            .row.col-12
                q-btn(
                    color="primary"
                    label="VIEW TRANSACTION HISTORY"
                    @click="$router.push({name: 'withdraw', params: {status: 'checkout'}})"
                    ).col.q-mx-sm.q-mt-sm
</template>
