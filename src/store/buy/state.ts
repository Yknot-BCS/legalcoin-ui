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
  assets: GalleryCard[];
  collections: GalleryCard[];
  templates: GalleryCard[];
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
    assets: [],
    collections: [],
    templates: []
  };
}
