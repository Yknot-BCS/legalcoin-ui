<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import { atomic_api, atomic_market_api } from 'src/api/atomic_assets';
import { GalleryCard } from 'src/types';
import GalleryView from 'src/components/gallery/GalleryView.vue';
import { useStore } from 'src/store';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default defineComponent({
  name: 'Gallery',
  components: { GalleryView },
  setup() {
    //const data = await atomic_api.getAsset('1099511627786');
    const myGalleryData = ref<GalleryCard[]>([]);
    const discoverData = ref<GalleryCard[]>([]);
    const collectionData = ref<GalleryCard[]>([]);
    const templateData = ref<GalleryCard[]>([]);
    const store = useStore();

    const accountName = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => store.getters['account/cryptoAccountName'] as string
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log(accountName);
    async function getData() {
      const myGalleryOptions = {
        owner: accountName.value,
        page: 1,
        order: 'desc',
        limit: 6,
        sort: 'created'
      };
      const DiscoverOptions = {
        collection_blacklist: 'fuzzytestnet',
        page: 1,
        order: 'desc',
        limit: 12,
        sort: 'created'
      };
      const CollectionOptions = {
        author: 'thelawisgood',
        page: 1,
        order: 'desc',
        limit: 12,
        sort: 'created'
      };
      const TemplateOptions = {
        authorized_account: 'fuzzytestnet',
        page: 1,
        order: 'desc',
        limit: 12,
        sort: 'created'
      };
      let data = await atomic_market_api.getAssets(myGalleryOptions as any);
      console.log(data);
      myGalleryData.value = data.map((asset) => {
        return {
          name: asset.data.name as string,
          imageUrl:
            asset.data.img && (asset.data.img as string).includes('http')
              ? (asset.data.img as string)
              : 'https://ipfs.io/ipfs/' + (asset.data.img as string),
          collection: asset.collection.collection_name,
          template: asset.template.template_id,
          schema: asset.schema.schema_name,
          id: asset.asset_id
        } as GalleryCard;
      });
      data = await atomic_market_api.getAssets(DiscoverOptions as any);
      discoverData.value = data.map((asset) => {
        return {
          name: asset.data.name as string,
          imageUrl:
            asset.data.img && (asset.data.img as string).includes('http')
              ? (asset.data.img as string)
              : 'https://ipfs.io/ipfs/' + (asset.data.img as string),
          collection: asset.collection.collection_name,
          template: asset.template.template_id,
          schema: asset.schema.schema_name,
          id: asset.asset_id
        } as GalleryCard;
      });
      let CollectionData = await atomic_api.getCollections(
        CollectionOptions as any
      );
      collectionData.value = CollectionData.map((asset) => {
        return {
          name: asset.data.name as string,
          imageUrl:
            asset.data.img && (asset.data.img as string).includes('http')
              ? (asset.data.img as string)
              : 'https://ipfs.io/ipfs/' + (asset.data.img as string),
          collection: asset.collection_name,
          template: '',
          schema: '',
          id: asset.contract
        } as GalleryCard;
      });
      let TemplateData = await atomic_api.getCollections(
        TemplateOptions as any
      );
      templateData.value = TemplateData.map((asset) => {
        return {
          name: asset.data.name as string,
          imageUrl:
            asset.data.img && (asset.data.img as string).includes('http')
              ? (asset.data.img as string)
              : 'https://ipfs.io/ipfs/' + (asset.data.img as string),
          collection: asset.collection_name,
          template: '',
          schema: '',
          id: asset.contract
        } as GalleryCard;
      });
    }
    onMounted(async () => {
      void (await getData());
    });
    return {
      getData,
      myGalleryData,
      discoverData,
      collectionData,
      templateData
    };
  }
});
</script>

<template lang="pug">
.row.q-pa-md
  .col-12
    .text-h3.text-weight-bold.q-pa-lg Gallery
  .col-6
    .q-px-md.text-h6.text-grey-8 My Gallery

  .col-6
    q-btn.q-px-md.float-right.text-grey-8(label='view all', flat)
  .col-12
    GalleryView(:data='myGalleryData', type='asset')

.row.q-pa-md
  .col-12
    .q-px-md.text-h6.text-grey-8.text-weight-bold.text-center Discover

  .col-6.px.q-pt-md
    .q-px-md.text-h6.text-grey-8 NFT's
  .col-6
    q-btn.q-px-md.float-right.text-grey-8(label='view all', flat)
  q-seperator
  .col-12.q-px-sm
    GalleryView(:data='discoverData', type='asset')

  .col-6.px.q-pt-md
    .q-px-md.text-h6.text-grey-8 Collections
  .col-6
    q-btn.q-px-md.float-right.text-grey-8(label='view all', flat)
  .col-12.q-px-sm
    GalleryView(:data='collectionData', type='collection')
</template>
