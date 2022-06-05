import { ITemplate } from 'atomicassets/build/API/Explorer/Objects';

export interface Asset {
  contract: string;
  asset_id: string;
  owner: string;
  name: string;
  is_transferable: true;
  is_burnable: true;
  template_mint: string;
  collection: CollectionData;
  schema: SchemaData;
  template: TemplateData;
  backed_tokens: BackedTokens[];
  immutable_data: unknown;
  mutable_data: unknown;
  data: unknown;
  burned_by_account: string;
  burned_at_block: string;
  burned_at_time: string;
  updated_at_block: string;
  updated_at_time: string;
  transferred_at_block: string;
  transferred_at_time: string;
  minted_at_block: string;
  minted_at_time: string;
}

export interface Collection {
  contract: string;
  collection_name: string;
  name: string;
  author: string;
  allow_notify: true;
  authorized_accounts: string[];
  notify_accounts: string[];
  market_fee: number;
  data: unknown;
  created_at_block: string;
  created_at_time: string;
}

export interface CollectionData {
  collection_name: string;
  name: string;
  author: string;
  allow_notify: true;
  authorized_accounts: string[];
  notify_accounts: string[];
  market_fee: number;
  created_at_block: string;
  created_at_time: string;
}

interface SchemaData {
  schema_name: string;
  format: Format[];
  created_at_block: string;
  created_at_time: string;
}

export interface Schema {
  contract: string;
  schema_name: string;
  format: Format[];
  created_at_block: string;
  created_at_time: string;
  collection: CollectionData;
}

export interface Template extends ITemplate {
  name: string;
}

export interface TemplateData {
  template_id: string;
  max_supply: string;
  issued_supply: string;
  is_transferable: true;
  is_burnable: true;
  immutable_data: unknown;
  created_at_time: string;
  created_at_block: string;
}

export interface Offer {
  contract: string;
  offer_id: string;
  sender_name: string;
  recipient_name: string;
  memo: string;
  state: number;
  is_sender_contract: true;
  is_recipient_contract: true;
  sender_assets: Asset[];
  recipient_assets: Asset[];
  updated_at_block: string;
  updated_at_time: string;
  created_at_block: string;
  created_at_time: string;
}

export interface Transfer {
  contract: string;
  transfer_id: string;
  sender_name: string;
  recipient_name: string;
  memo: string;
  assets: Asset[];
  created_at_block: string;
  created_at_time: string;
}

export interface Account {
  account: string;
  assets: string;
}

export interface Config {
  contract: string;
  version: string;
  collection_format: Format[];
  supported_tokens: SupportedTokens[];
}

export interface Sale {
  market_contract: string;
  assets_contract: string;
  sale_id: string;
  seller: string;
  buyer: string;
  offer_id: string;
  price: Price;
  listing_price: number;
  listing_symbol: string;
  assets: Asset[];
  maker_marketplace: string;
  taker_marketplace: string;
  collection: CollectionData;
  state: number;
  updated_at_block: string;
  updated_at_time: string;
  created_at_block: string;
  created_at_time: string;
}

export interface Auctions {
  market_contract: string;
  assets_contract: string;
  auction_id: string;
  seller: string;
  buyer: string;
  price: Price;
  assets: Asset[];
  bids: Bid[];
  maker_marketplace: string;
  taker_marketplace: string;
  collection: CollectionData;
  state: number;
  end_time: string;
  updated_at_block: string;
  updated_at_time: string;
  created_at_block: string;
  created_at_time: string;
}

export interface BuyOffer {
  market_contract: string;
  assets_contract: string;
  buyoffer_id: string;
  seller: string;
  buyer: string;
  price: Price;
  assets: Asset[];
  maker_marketplace: string;
  taker_marketplace: string;
  collection: CollectionData;
  state: number;
  memo: string;
  decline_memo: string;
  updated_at_block: string;
  updated_at_time: string;
  created_at_block: string;
  created_at_time: string;
}

export interface Pricing {
  sale_id: string;
  auction_id: string;
  buyoffer_id: string;
  template_mint: string;
  price: string;
  token_symbol: string;
  token_precision: number;
  token_contract: string;
  block_time: string;
}

export interface CollectionStats {
  symbol: SupportedTokens;
  results: CollectionStatsResult[];
}

interface Format {
  name: string;
  type: string;
}

interface BackedTokens {
  token_contract: string;
  token_symbol: string;
  token_precision: number;
  amount: string;
}

interface SupportedTokens {
  token_contract: string;
  token_symbol: string;
  token_precision: number;
}

interface Price {
  amount: string;
  token_precision: number;
  token_contract: string;
  token_symbol: string;
}

interface Bid {
  number: number;
  account: string;
  amount: string;
  created_at_block: string;
  created_at_time: string;
  txid: string;
}

export interface CollectionStatsResult {
  contract: string;
  collection_name: string;
  name: string;
  author: string;
  allow_notify: true;
  authorized_accounts: string[];
  notify_accounts: string[];
  market_fee: number;
  data: unknown;
  created_at_block: string;
  created_at_time: string;
  listings: string;
  volume: string;
  sales: string;
}
