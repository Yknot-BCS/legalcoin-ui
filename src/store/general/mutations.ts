import { MutationTree } from 'vuex';
import { GeneralStateInterface } from './state';

export const mutations: MutationTree<GeneralStateInterface> = {
  setSearch(state: GeneralStateInterface, search: string) {
    state.search = search;
  },
  setOptions(
    state: GeneralStateInterface,
    options: GeneralStateInterface['options']
  ) {
    state.options = options;
  }
};
