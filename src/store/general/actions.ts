/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { GeneralStateInterface } from './state';
import { atomic_api } from 'src/api/atomic_assets';
import { Template } from 'src/types';

export const actions: ActionTree<GeneralStateInterface, StateInterface> = {
  async updateSearch({ commit, dispatch }, search: string) {
    commit('setSearch', search);
    await dispatch('updateOptions');
  },
  async updateOptions({ commit, state }) {
    const options = [];
    const collection_whitelist = state.collections;
    const CollectionOptions = {
      authorized_account: process.env.AA_ACCOUNT,
      page: 1,
      order: 'desc',
      limit: 3,
      sort: 'created'
    };
    const TemplateOptions = {
      collection_whitelist,
      page: 1,
      order: 'desc',
      limit: 4,
      match: state.search,
      sort: 'created'
    };
    const AccountOptions = {
      page: 1,
      order: 'desc',
      limit: 3,
      match_owner: state.search,
      sort: 'created'
    };
    const accountData = await atomic_api.getAccounts(AccountOptions as any);
    if (accountData.length > 0) {
      options.push({
        label: 'Accounts',
        groupLabel: true,
        group: 'account',
        disabled: true,
        id: ''
      });
    }
    accountData.forEach((account) => {
      options.push({
        label: account.account,
        groupLabel: false,
        group: 'account',
        disabled: false,
        id: account.account
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
    commit('setOptions', options);
  },
  async getCollectionsList({ commit }) {
    const collectionsfilter = {
      authorized_account: process.env.AA_ACCOUNT,
      limit: 100,
      order: 'desc',
      sort: 'created'
    } as unknown;
    const data = await atomic_api.getCollections(collectionsfilter);
    const dataList = data.map((col) => col.collection_name);
    commit('setCollections', dataList.toString());
  }
};
