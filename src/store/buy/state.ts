import {
  AssetsApiParams,
  CollectionApiParams,
  TemplateApiParams
} from 'atomicassets/build/API/Explorer/Params';
import { GalleryCard } from 'src/types';

export interface BuyStateInterface {
  filter: string;
  assetFilter: AssetsApiParams;
  collectionFilter: CollectionApiParams;
  templateFilter: TemplateApiParams;
  accountData: {
    assets: number;
    collections: number;
    templates: number;
  };
  assets: GalleryCard[];
  collections: GalleryCard[];
  templates: GalleryCard[];
  assetPaging: number;
  templatePaging: number;
  collectionPaging: number;
  sort: string;
  order: string;
}

export function state(): BuyStateInterface {
  return {
    filter: 'All',
    assetFilter: {
      owner: 'alpacaworlds',
      page: 1,
      order: 'desc',
      limit: 6,
      sort: 'created'
    } as unknown,
    collectionFilter: {
      author: 'alpacaworlds',
      page: 1,
      order: 'desc',
      limit: 12,
      sort: 'created'
    } as unknown,
    templateFilter: {
      authorized_account: 'alpacaworlds',
      page: 1,
      order: 'desc',
      limit: 12,
      sort: 'created'
    } as unknown,
    accountData: {
      assets: 0,
      collections: 0,
      templates: 0
    },
    assets: [],
    collections: [],
    templates: [],
    assetPaging: 1,
    templatePaging: 1,
    collectionPaging: 1,
    sort: 'created',
    order: 'desc'
  };
}
