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
      valueRatio: ref(1.0)
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
        .text-h6.text-grey-14
          | Balance
      q-card-section
        .text-wallet-topline.text-bold.text-grey-10
          | {{ balance }} LCP (LEGALCOIN POUND)
        .text-body2.text-grey-10
          | {{ gbpValue }} (GBP)
          //- TODO get GBP value
      q-separator.q-mx-md
      q-card-section
        .text-wallet-topline.text-bold.text-grey-10
          | {{ nftCount }} NFTS
        .text-body2.text-grey-10
          | {{ nftValue.toFixed(2) }} (LCP)
      q-separator.q-mx-md
      q-card-section
        .text-h6.text-grey-14
          | Options
        .row.justify-center.q-mt-sm
          .row.col-6
            q-btn.wallet-btn.col.q-mx-sm.q-mt-sm(
              label='BUY LEGALCOIN',
              flat,
              @click='$router.push({ name: "buytokens", params: { status: "checkout" } })'
            )
          .row.col-6
            q-btn.wallet-btn.col.q-mx-sm.q-mt-sm(
              label='WITHDRAW',
              disable,
              flat,
              @click='$router.push({ name: "withdraw" })'
            )
            q-tooltip Coming soon!
          .row.col-6
            q-btn.wallet-btn.col.q-mx-sm.q-mt-sm(
              label='SELL MY NFT',
              flat,
              @click='nothing'
            )
          .row.col-6
            q-btn.wallet-btn.col.q-mx-sm.q-mt-sm(
              label='SELL MY NFT',
              flat,
              @click='nothing'
            )
          .row.col-12
            q-btn.wallet-btn.col.q-mx-sm.q-mt-sm(
              label='VIEW TRANSACTION HISTORY',
              flat,
              @click='$router.push({ name: "txhistory" })'
            )
</template>

<style lang="sass" scoped>
.wallet-btn
  border: 0.5px solid grey
  font-family: 'ralewayregular'
</style>
