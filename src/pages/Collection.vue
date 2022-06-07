<script lang="ts">
import {
  ICollection,
  ITemplate
} from 'atomicassets/build/API/Explorer/Objects';
import { defineComponent, ref } from 'vue';
import { atomic_api } from 'src/api/atomic_assets';
import AssetCard from 'src/components/atomicAssets/AssetCard.vue';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default defineComponent({
  name: 'Collection',
  components: { AssetCard },
  setup() {
    const collectionData = ref<ICollection>(
      new Object({ data: { img: '' } }) as ICollection
    );
    const templatesData = ref<ITemplate[]>();

    return {
      templatesData,
      collectionData
    };
  },
  computed: {
    collectionImg(): string {
      return `https://ipfs.io/ipfs/${<string>this.collectionData.data.img}`;
    }
  },
  methods: {
    isLegalCoin(authorized_accounts: string) {
      // Check if the asset is from legalcoin
      if (authorized_accounts === process.env.AA_ACCOUNT) {
        return true;
      } else {
        return false;
      }
    },
    async getCollectionData() {
      this.collectionData = await atomic_api.getCollection(
        this.$route.params.collection as string
      );
    },
    async getCollectionTemplates() {
      this.templatesData = await atomic_api.getTemplates({
        owner: process.env.AA_ACCOUNT,
        collection_name: this.$route.params.collection as string
      });
    }
  },
  async mounted() {
    console.log('Collection mounted');

    // check if asset of template
    if (this.$route.params.collection) {
      console.log('Is Collection');
      await this.getCollectionData();
      await this.getCollectionTemplates();
    }
  }
});
</script>

<template lang="pug">
q-page.q-pa-md.row
  //- Collection Card
  q-card.col-12.col-md-3(style='height: 50rem')
    q-img.asset-img(:src='collectionImg')
    .text Display Name: {{ collectionData.name }}
    .text Author: {{ collectionData.Author }}
    .text Market Fee: {{ collectionData.market_fee }}
    .text Created: {{ new Date(Number(collectionData.created_at_time)).toLocaleDateString() }}

  //- Template cards
  q-card.col-12.col-md-9.row
    .col-6.col-md-3(v-for='template in templatesData')
      q-card.q-ma-sm
        //- .text {{ template }}
        q-card-section
          .text-h6 {{ template.immutable_data.name }}
          .text-subtitle2 {{ template.template_id }}
        q-separator(inset)
        q-img.asset-img(
          :src='`https://ipfs.io/ipfs/${template.immutable_data.img}`'
        )
        q-card-actions
          q-btn(flat) Action 1
  //-     q-card.q-ma-sm(
  //-       v-if='isLegalCoin(asset.collection.authorized_accounts[0])'
  //-     )
  //-       q-card-section
  //-         .row
  //-           .text-h6 {{ asset.collection.collection_name }}
  //-         .row
  //-           .col-6
  //-             .text-subtitle2 GBP 500
  //-           .col-6
  //-             .text-subtitle2.float-right {{ asset.asset_id }}
  //-         .row
  //-           .text-subtitle2 Expected yield 15%
  //-       q-separator(inset)
  //-       router-link(:to='"/asset/" + asset.asset_id')
  //-         q-img.asset-img(:src='"https://ipfs.io/ipfs/" + asset.data.img')
  //-       q-card-actions.q-pa-md
  //-         q-btn.full-width(
  //-           flat,
  //-           color='primary',
  //-           :to='"/asset/" + asset.asset_id'
  //-         ) View Asset
</template>
