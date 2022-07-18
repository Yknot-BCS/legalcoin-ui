/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Checksum160,
  Checksum256,
  Float64,
  Name,
  NameType,
  UInt128,
  UInt64,
  Asset
} from '@greymass/eosio';

import { AccountDetails, Action, Token, Userres, Block } from './Actions';

export type TableIndexType =
  | Name
  | UInt64
  | UInt128
  | Float64
  | Checksum256
  | Checksum160;

export interface GetTableRowsParams {
  /** The name of the smart contract that controls the provided table. */
  code: NameType;
  /** Name of the table to query. */
  table: NameType;
  /** The account to which this data belongs, if omitted will be set to be same as `code`. */
  scope: string | TableIndexType;
  /** Lower lookup bound. */
  key_type: string;
}

interface AccountsApi {
  query: (query: string) => Promise<unknown>;
  mutation: (query: string) => Promise<unknown>;
}

export type ApiClient = {
  getAccount: (address: string) => Promise<AccountDetails>;
  getCreator: (address: string) => Promise<any>;
  getTokens: (address: string) => Promise<Token[]>;
  getTransactions: (address?: string) => Promise<Action[]>;
  getTransaction: (address: string) => Promise<Action[]>;
  getChildren: (address: string) => Promise<Action[]>;
  getTableRows: (tableInput: GetTableRowsParams) => Promise<unknown>;
  getTokenBalances: (
    tokenContract: string,
    address: string
  ) => Promise<Asset[]>;
  getTableByScope: (address: string) => Promise<Userres[]>;
  getBlock: (block: string) => Promise<Block>;
  accounts: AccountsApi;
};
