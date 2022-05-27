import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { BuyStateInterface } from './state';
import { atomic_api } from 'src/api/atomic_assets';
import { GalleryCard } from 'src/types';
import { useRouter } from 'vue-router';

export const actions: ActionTree<BuyStateInterface, StateInterface> = {
  async updateFilter(
    { commit, dispatch, state },
    filter: BuyStateInterface['filter']
  ) {
    const router = useRouter();
    commit('setFilter', filter);
    let newFilter = {};
    switch (filter) {
      case 'Assets':
        newFilter = { ...state.assetFilter, limit: 48 };
        await dispatch('updateAssetFilter', newFilter);
        break;
      case 'Collections':
        newFilter = { ...state.collectionFilter, limit: 48 };
        await dispatch('updateCollectionFilter', newFilter);
        break;
      case 'Templates':
        newFilter = { ...state.templateFilter, limit: 48 };
        await dispatch('updateTemplateFilter', newFilter);
        await router.push('/buy');
        break;
      default:
        newFilter = { ...state.assetFilter, limit: 6 };
        await dispatch('updateAssetFilter', newFilter);
        newFilter = { ...state.collectionFilter, limit: 6 };
        await dispatch('updateCollectionFilter', newFilter);
        newFilter = { ...state.templateFilter, limit: 6 };
        await dispatch('updateTemplateFilter', newFilter);
        await router.push('/buy');
    }
  },
  async updateAssetFilter(
    { dispatch, commit },
    filter: BuyStateInterface['assetFilter']
  ) {
    commit('setAssetFilter', filter);
    await dispatch('updateAssets', filter);
  },
  async updateCollectionFilter(
    { dispatch, commit },
    filter: BuyStateInterface['collectionFilter']
  ) {
    commit('setCollectionFilter', filter);
    await dispatch('updateCollections', filter);
  },
  async updateTemplateFilter(
    { dispatch, commit },
    filter: BuyStateInterface['templateFilter']
  ) {
    commit('setTemplateFilter', filter);
    await dispatch('updateTemplates', filter);
  },
  async updateAll({ dispatch }) {
    await dispatch('updateAssets');
    await dispatch('updateCollections');
    await dispatch('updateTemplates');
  },

  async updateAssets({ commit, state }) {
    const data = await atomic_api.getAssets(state.assetFilter);
    const gallerydata = data.map((asset) => {
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
    commit('setAssets', gallerydata);
  },
  async updateCollections({ commit, state }) {
    const data = await atomic_api.getCollections(state.collectionFilter);
    const gallerydata = data.map((asset) => {
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
    commit('setCollections', gallerydata);
  },
  async updateTemplates({ commit, state }) {
    const data = await atomic_api.getTemplates(state.templateFilter);
    console.log(data);
    const gallerydata = data.map((template) => {
      return {
        name: template.contract,
        imageUrl:
          template.immutable_data.img &&
          (template.immutable_data.img as string).includes('http')
            ? (template.immutable_data.img as string)
            : 'https://ipfs.io/ipfs/' + (template.immutable_data.img as string),
        collection: template.collection.collection_name,
        template: '',
        schema: '',
        id: template.template_id
      } as GalleryCard;
    });
    commit('setTemplates', gallerydata);
  }
};
