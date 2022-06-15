<script lang="ts">
import { defineComponent, ref } from 'vue';
import { atomic_api, atomic_market_api } from 'src/api/atomic_assets';
import { ITemplate } from 'atomicassets/build/API/Explorer/Objects';
import { ISale } from 'atomicmarket/build/API/Explorer/Objects';
import TemplateViewer from 'src/components/atomicAssets/TemplateViewer.vue';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default defineComponent({
  name: 'Template',
  components: { TemplateViewer },
  setup() {
    const saleData = ref<ISale>(new Object({}) as ISale);
    const templateData = ref<ITemplate>(new Object({}) as ITemplate);

    return {
      saleData,
      templateData
    };
  },
  computed: {
    isLegalCoin() {
      // Check if the asset is from legalcoin
      if (
        this.templateData?.collection?.authorized_accounts[0] ===
        process.env.AA_ACCOUNT
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    async getTemplateData() {
      this.templateData = await atomic_api.getTemplate(
        this.$route.params.collection_name as string,
        this.$route.params.template_id as string
      );
      console.log(this.templateData);
    },

    async getSaleData() {
      let saleFilter = {
        asset_id:
          this.$route.params.asset === undefined
            ? ''
            : this.$route.params.asset,
        page: 1,
        order: 'asc',
        limit: 100,
        collection_name:
          this.$route.params.collection_name === undefined
            ? ''
            : (this.$route.params.collection_name as string),
        template_id:
          this.$route.params.template_id === undefined
            ? ''
            : this.$route.params.template_id,
        state: 1,
        seller:
          this.$route.query.seller === undefined ? '' : this.$route.query.seller
      } as unknown;
      this.saleData = (await atomic_market_api.getSales(saleFilter))[0];
      console.log(this.saleData);
    },

    async updateTemplateInfo() {
      await this.getTemplateData();
      await this.getSaleData();
    }
  },
  async mounted() {
    if (this.$route.params.template_id) {
      console.log('Is Template');
      await this.updateTemplateInfo();
    }
  }
});
</script>

<template lang="pug">
.div(v-if='isLegalCoin')
  TemplateViewer(
    :templateData='templateData',
    :saleData='saleData',
    @update-asset-info='updateTemplateInfo()'
  )
q-page.row.fit.wrap.justify-center(v-else)
  q-card.warn-card.row.justify-center
    | This is not a LegalCoin asset
</template>

<style lang="sass" scoped>
.warn-card
  width: 100%
  max-width: 300px
  height: 100%
</style>