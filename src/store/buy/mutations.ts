import { MutationTree } from 'vuex';
import { BuyStateInterface } from './state';
import { GalleryCard } from 'src/types';

export const mutations: MutationTree<BuyStateInterface> = {
  setFilter(state: BuyStateInterface, filter: BuyStateInterface['filter']) {
    state.filter = filter;
  },
  setAssets(state: BuyStateInterface, assets: GalleryCard[]) {
    state.assets = assets;
  },
  setCollections(state: BuyStateInterface, collections: GalleryCard[]) {
    state.collections = collections;
  },
  setTemplates(state: BuyStateInterface, templates: GalleryCard[]) {
    state.templates = templates;
  },
  setCollectionFilter(
    state: BuyStateInterface,
    filter: BuyStateInterface['collectionFilter']
  ) {
    state.collectionFilter = filter;
  },
  setAssetFilter(
    state: BuyStateInterface,
    filter: BuyStateInterface['assetFilter']
  ) {
    state.assetFilter = filter;
  },
  setTemplateFilter(
    state: BuyStateInterface,
    filter: BuyStateInterface['templateFilter']
  ) {
    state.templateFilter = filter;
  },
  setAccountData(
    state: BuyStateInterface,
    data: BuyStateInterface['accountData']
  ) {
    state.accountData = data;
  },
  setTemplatePaging(state: BuyStateInterface, page: number) {
    state.templatePaging = page;
  },
  setAssetPaging(state: BuyStateInterface, page: number) {
    state.assetPaging = page;
  },
  setCollectionPaging(state: BuyStateInterface, page: number) {
    state.collectionPaging = page;
  }
};
