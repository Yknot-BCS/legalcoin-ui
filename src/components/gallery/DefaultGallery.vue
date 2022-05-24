<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { atomic_api } from 'src/api/atomic_assets';
import { GalleryCard } from 'src/types';
import GalleryView from 'src/components/gallery/GalleryView.vue';

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
    async function getData() {
      const myGalleryOptions = {
        owner: 'waxgamewax12',
        page: 1,
        order: 'desc',
        limit: 6,
        sort: 'created'
      };
      const DiscoverOptions = {
        collection_blacklist:
          'bridgebridge,testkogs2222,testkogs3333,testkogstest,mutantwarrio,mutantstest2,33testuplift,44testuplift,series2heros,horrorhorror,horrorstest2,horrorstest3,horrorstest4,horrorstest5,horrorstestx,btcotest2222,btcotest3333,btcotest1234,shynies5test,shynies4test,shyniestest2,shyniestest1,btco22222222,artvndngtst1,elementals11,mteora111111',
        page: 1,
        order: 'desc',
        limit: 12,
        sort: 'created'
      };
      const CollectionOptions = {
        author: 'pokemontest1',
        page: 1,
        order: 'desc',
        limit: 12,
        sort: 'created'
      };
      const TemplateOptions = {
        authorized_account: 'waxgamewax12',
        page: 1,
        order: 'desc',
        limit: 12,
        sort: 'created'
      };
      let data = await atomic_api.getAssets(myGalleryOptions as any);
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
      data = await atomic_api.getAssets(DiscoverOptions as any);
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
    q-btn.q-px-md.float-right.text-grey-8(label="view all" flat)
  .col-12
    GalleryView(:data="myGalleryData" type="asset")

.row.q-pa-md
  .col-12
    .q-px-md.text-h6.text-grey-8.text-weight-bold.text-center Discover

  .col-6.px.q-pt-md
    .q-px-md.text-h6.text-grey-8 NFT's
  .col-6
    q-btn.q-px-md.float-right.text-grey-8(label="view all" flat)
  q-seperator
  .col-12.q-px-sm
    GalleryView(:data="discoverData" type="asset")

  .col-6.px.q-pt-md
    .q-px-md.text-h6.text-grey-8 Collections
  .col-6
    q-btn.q-px-md.float-right.text-grey-8(label="view all" flat)
  .col-12.q-px-sm
    GalleryView(:data="collectionData" type="collection")
    

</template>
