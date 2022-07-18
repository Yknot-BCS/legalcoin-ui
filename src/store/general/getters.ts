import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { GeneralStateInterface } from './state';

export const getters: GetterTree<GeneralStateInterface, StateInterface> = {
  getOptions({ options }): GeneralStateInterface['options'] {
    return options;
  }
};
