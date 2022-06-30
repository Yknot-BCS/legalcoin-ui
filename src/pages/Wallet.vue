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
      valueRatio: ref(1.0),
      polling: ref()
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
    async getNftCount() {
      if (this.isAuthenticated) {
        //  get NFT count
        const myGalleryOptions = {
          owner: this.accountName as string,
          page: 1,
          order: 'desc',
          limit: 6,
          sort: 'created',
          authorized_account: [process.env.AA_ACCOUNT]
        };
        let data = await atomic_market_api.getAssets(
          myGalleryOptions as unknown
        );
        // console.log(data);
        this.nftCount = data.length;
        // get NFT worth in LEGAL
        this.nftValue = 0;
        for (const asset of data) {
          if (asset?.data?.mintprice) {
            this.nftValue += Asset.from(asset.data.mintprice).value;
          }
        }
      }
    }
  },
  async mounted() {
    await this.getBalance();
    await this.getNftCount();

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.polling = setInterval(async () => {
      void (await this.getBalance());
      void (await this.getNftCount());
    }, 5000);
  },
  beforeUnmount() {
    clearInterval(this.polling);
  }
});
</script>

<template lang="pug">
q-page
  .row.justify-center
    q-card.q-mt-xl
      q-card-section
        .text-wallet-heading.text-grey-8
          | Balance
      q-card-section
        .text-wallet-topline.text-bold 
          | {{ balance }} LEGAL (LEGALCOIN)
        .text-wallet-bottomline
          | £ {{ gbpValue }} (GBP)
          //- TODO get GBP value
      q-separator.q-mx-md
      q-card-section
        .text-wallet-topline.text-bold 
          | {{ nftCount }} NFTS
        .text-wallet-bottomline
          | {{ nftValue.toFixed(2) }} (LEGAL)
      q-separator.q-mx-md
      q-card-section
        .text-wallet-heading.text-grey-8
          | Options
        .row.justify-center.q-mt-sm
          .row.col-6
            q-btn.col.q-mx-sm.q-mt-sm.wallet-btn(
              label='BUY LEGALCOIN',
              flat,
              @click='$router.push({ name: "buytokens", params: { status: "checkout" } })'
            )
          .row.col-6
            q-btn.col.q-mx-sm.q-mt-sm.wallet-btn(
              label='WITHDRAW',
              disable,
              flat,
              @click='$router.push({ name: "withdraw" })'
            )
            q-tooltip Coming soon!
          .row.col-12
            q-btn.col.q-mx-sm.q-mt-sm.wallet-btn(
              label='VIEW TRANSACTION HISTORY',
              flat,
              @click='$router.push({ name: "txhistory" })'
            )
</template>

<style lang="sass" scoped>
.wallet-btn
  border: 0.5px solid $gray-80
  font-family: 'ralewayregular'
  border-radius: 6px 6px 6px 6px
.text-wallet-heading
  font-size: 1.25rem
  font-family: 'ralewayregular'
.text-wallet-topline
  font-size: 0.88rem
  font-family: 'heveticaneue'
.text-wallet-bottomline
  font-size: 0.88rem
  font-family: 'ralewayregular'
</style>
