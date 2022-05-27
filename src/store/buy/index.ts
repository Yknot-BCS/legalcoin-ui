import { Module } from 'vuex';
import { StateInterface } from '../index';
import { state, BuyStateInterface } from './state';
import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';

export const buy: Module<BuyStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
};
