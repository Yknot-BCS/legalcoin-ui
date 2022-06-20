/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { GeneralStateInterface } from './state';
import { atomic_api, atomic_market_api } from 'src/api/atomic_assets';
import { Template } from 'src/types';

// Split multiple with ","
const collection_whitelist = 'emission.lc';

export const actions: ActionTree<GeneralStateInterface, StateInterface> = {
  async updateSearch({ commit, dispatch }, search: string) {
    commit('setSearch', search);
    await dispatch('updateOptions');
  },
  async updateOptions({ commit, state }) {
    const options = [];
    const assetOptions = {
      owner: process.env.AA_ACCOUNT,
      page: 1,
      order: 'desc',
      limit: 3,
      search: state.search,
      sort: 'created'
    };
    const CollectionOptions = {
      authorized_account: process.env.AA_ACCOUNT,
      page: 1,
      order: 'desc',
      limit: 3,
      search: state.search,
      sort: 'created'
    };
    const TemplateOptions = {
      collection_whitelist,
      page: 1,
      order: 'desc',
      limit: 3,
      match: state.search,
      sort: 'created'
    };
    const assetData = await atomic_market_api.getAssets(assetOptions as any);
    if (assetData.length > 0) {
      options.push({
        label: 'Assets',
        groupLabel: true,
        group: 'asset',
        disabled: true,
        id: ''
      });
    }
    assetData.forEach((asset) => {
      options.push({
        label: asset.name,
        groupLabel: false,
        group: 'asset',
        disabled: false,
        id: asset.asset_id
      });
    });
    const collectionData = await atomic_api.getCollections(
      CollectionOptions as any
    );
    if (collectionData.length > 0) {
      options.push({
        label: 'Collections',
        groupLabel: true,
        group: 'collection',
        disabled: true,
        id: ''
      });
    }
    collectionData.forEach((collection) => {
      options.push({
        label: collection.data.name,
        groupLabel: false,
        group: 'collection',
        disabled: false,
        id: collection.data.name
      });
    });
    const templateData = (await atomic_api.getTemplates(
      TemplateOptions as any
    )) as Template[];
    if (templateData.length > 0) {
      options.push({
        label: 'Templates',
        groupLabel: true,
        group: 'template',
        disabled: true,
        id: ''
      });
    }
    templateData.forEach((template) => {
      options.push({
        label: template.name,
        groupLabel: false,
        group: 'template',
        disabled: false,
        id: template.template_id
      });
    });
    commit('setOptions', options);
  }
};
