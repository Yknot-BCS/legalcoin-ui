import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { BuyStateInterface } from './state';

export const getters: GetterTree<BuyStateInterface, StateInterface> = {
  getFilter({ filter }): BuyStateInterface['filter'] {
    return filter;
  }
};
