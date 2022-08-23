/**
 * Add another endpoint resource:
 *  - add a unique file in src/api/
 *  - for new method,  export and import here, add to api export
 *  - for existing method enpoint, export from service file and update the import statement here
 */
import {
  getCreator,
  getTokens,
  getTransactions,
  getTransaction,
  getChildren,
  getTableByScope,
  getBlock
} from './hyperion'; //  e.g. './new-service' method name stays the same
import {
  eosioCore,
  getTableRows,
  getTokenBalances,
  getAccount
} from './eosio_core';
import accounts from './accounts';

export const api = {
  getAccount,
  getCreator,
  getTokens,
  getTransactions,
  getTransaction,
  getChildren,
  getTableRows,
  getTokenBalances,
  getTableByScope,
  getBlock,
  accounts,
  eosioCore
};
