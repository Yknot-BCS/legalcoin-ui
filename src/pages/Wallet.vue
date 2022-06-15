<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Asset } from '@greymass/eosio';
import { mapGetters } from 'vuex';
import { atomic_market_api } from 'src/api/atomic_assets';

export default defineComponent({
  name: 'Wallet',
  components: {},
  setup() {
    return {
      balance: ref('0'),
      nftCount: ref(0),
      nftValue: ref(0),
      valueRatio: ref(1.01) // TODO determine this ratio dynamically
    };
  },
  computed: {
    ...mapGetters({
      accountName: 'account/cryptoAccountName',
      cryptoIsAuthenticated: 'account/cryptoIsAuthenticated'
    }),

    gbpValue(): string {
      return (Number(this.balance) * (1 / this.valueRatio)).toFixed(2);
    }
  },
  async mounted() {
    if (this.cryptoIsAuthenticated) {
      const tokenBal: Asset[] = await this.$api.getTokenBalances(
        process.env.LC_CONTRACT,
        this.accountName
      );
      if (tokenBal.length > 0) {
        this.balance = tokenBal[0].value.toFixed(2);
      }

      //  get NFT count
      const myGalleryOptions = {
        owner: this.accountName as string,
        page: 1,
        order: 'desc',
        limit: 6,
        sort: 'created',
        authorized_account: [process.env.AA_ACCOUNT]
      };
      let data = await atomic_market_api.getAssets(myGalleryOptions as unknown);
      // console.log(data);
      this.nftCount = data.length;
      // TODO get NFT worth in LEGAL
      for (const asset of data) {
        if (asset?.data?.mintprice) {
          this.nftValue += Asset.from(asset.data.mintprice).value;
        }
      }
    }
  }
});
</script>

<template lang="pug">
q-page
  .row.justify-center
    q-card
      q-card-section
        .text-h6.text-grey-8
          | My Balance
      q-card-section
        .text-bold 
          | {{ balance }} LEGAL
        .text
          | {{ gbpValue }} (GBP)
          //- TODO get GBP value
      q-separator.q-mx-md
      q-card-section
        .text-bold 
          | {{ nftCount }} NFTS
        .text
          | {{ nftValue.toFixed(2) }} (LEGAL)
      q-separator.q-mx-md
      q-card-section
        .text-h6.text-grey-8
          | Options
        .row.justify-center.q-mt-sm
          .row.col-6
            q-btn.col.q-mx-sm.q-mt-sm(
              label='BUY LEGAL',
              @click='$router.push({ name: "buytokens", params: { status: "checkout" } })'
            )
          .row.col-6
            q-btn.col.q-mx-sm.q-mt-sm(
              label='WITHDRAW',
              disable,
              @click='$router.push({ name: "withdraw" })'
            )
            q-tooltip Coming soon!
          .row.col-12
            q-btn.col.q-mx-sm.q-mt-sm(
              label='VIEW TRANSACTION HISTORY',
              @click='$router.push({ name: "txhistory" })'
            )
</template>

<style lang="sass" scoped></style>
