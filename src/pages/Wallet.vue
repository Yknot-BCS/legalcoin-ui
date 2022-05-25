<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Asset } from '@greymass/eosio';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'Wallet',
  components: {},
  setup() {
    return { balance: ref('0'), nftCount: ref(0) };
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

      //   TODO get NFT count
    }
  }
});
</script>

<template lang="pug">
q-page.fit.row.wrap.justify-center
    q-card.wallet-card
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
                    label="BUY LEGAL"
                    @click="$router.push({name: 'buytokens', params: {status: 'checkout'}})"
                    ).col.q-mx-sm.q-mt-sm
            .row.col-6
                q-btn(
                    label="WITHDRAW"
                    @click="$router.push({name: 'withdraw'})"
                    ).col.q-mx-sm.q-mt-sm
            .row.col-6
                q-btn(
                    label="BUY NFT"
                    @click="$router.push({name: 'buytokens'})"
                    ).col.q-mx-sm.q-mt-sm
            .row.col-6
                q-btn(
                    label="SELL NFT"
                    @click="$router.push({name: 'withdraw'})"
                    ).col.q-mx-sm.q-mt-sm   
            .row.col-12
                q-btn(
                    label="VIEW TRANSACTION HISTORY"
                    @click="$router.push({name: 'txhistory'})"
                    ).col.q-mx-sm.q-mt-sm
</template>

<style lang="sass" scoped>
.wallet-card
  width: 100%
  max-width: 30rem
  height: 100%
  max-height: 30rem
</style>
