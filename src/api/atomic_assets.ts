import { ExplorerApi } from 'atomicassets';
import { AtomicMarketApi } from 'atomicmarket';
import { GalleryCard } from 'src/types';
import { useRoute } from 'vue-router';

export const atomic_api = new ExplorerApi(
  process.env.ATOMICASSETS_API_ENDPOINT,
  'atomicassets',
  { fetch }
);

export const atomic_market_api = new AtomicMarketApi(
  process.env.ATOMICASSETS_API_ENDPOINT,
  'atomicmarket',
  { fetch }
);

export const get_assets = async function (
  ApiParams: any,
  Page: number,
  ItemsPerPage: number,
  DataParams: { key: string; value: string }[]
): Promise<{ data: GalleryCard[]; count: number }> {
  const rawData = await atomic_api.getAssets(
    ApiParams,
    Page,
    ItemsPerPage,
    DataParams
  );
  const count = await atomic_api.countAssets(ApiParams, DataParams);
  const data = rawData.map((asset) => {
    return {
      ...asset.data,
      to: '/asset/' + asset.asset_id,
      yield: getYield(asset.data.mintprice, asset.data.maturedvalue),
      name: asset.data.name as string,
      imageUrl:
        asset.data.img && (asset.data.img as string).includes('http')
          ? (asset.data.img as string)
          : 'https://ipfs.io/ipfs/' + (asset.data.img as string),
      collection: asset.collection.collection_name,
      template: asset.template.template_id,
      schema: asset.schema.schema_name,
      id: asset.asset_id
    } as GalleryCard;
  });
  return { data, count };
};

export const get_collections = async function (
  ApiParams: any,
  Page: number,
  ItemsPerPage: number
): Promise<{ data: GalleryCard[]; count: number }> {
  const count = await atomic_api.countTemplates(ApiParams);
  const rawData = await atomic_api.getCollections(
    ApiParams,
    Page,
    ItemsPerPage
  );
  const data = rawData.map((collection) => {
    return {
      name: collection.data.name as string,
      imageUrl:
        collection.data.img && (collection.data.img as string).includes('http')
          ? (collection.data.img as string)
          : 'https://ipfs.io/ipfs/' + (collection.data.img as string),
      collection: collection.collection_name,
      template: '',
      schema: '',
      id: collection.contract
    } as GalleryCard;
  });
  return { data, count };
};

export const get_templates = async function (
  ApiParams: any,
  Page: number,
  ItemsPerPage: number,
  DataParams: { key: string; value: string }[]
): Promise<{ data: GalleryCard[]; count: number }> {
  const count = await atomic_api.countTemplates(ApiParams, DataParams);
  const rawData = await atomic_api.getTemplates(
    ApiParams,
    Page,
    ItemsPerPage,
    DataParams
  );
  const data = rawData.map((template) => {
    return {
      ...template.immutable_data,
      to: `/template/${template.collection.collection_name}/${template.template_id}`,
      yield: getYield(
        template.immutable_data.mintprice,
        template.immutable_data.maturedvalue
      ),
      name: template.collection.name,
      imageUrl:
        template.immutable_data.img &&
        (template.immutable_data.img as string).includes('http')
          ? (template.immutable_data.img as string)
          : 'https://ipfs.io/ipfs/' + (template.immutable_data.img as string),
      collection: template.collection.collection_name,
      template: '',
      schema: '',
      id: template.template_id
    } as GalleryCard;
  });
  return { data, count };
};

export const assetToAmount = function (asset: string, decimals = -1): number {
  try {
    let qty: string = asset.split(' ')[0];
    const val: number = parseFloat(qty);
    if (decimals > -1) qty = val.toFixed(decimals);
    return val;
  } catch (error) {
    return 0;
  }
};

export const getYield = function (cost: string, profit: string): string {
  try {
    const val =
      ((assetToAmount(profit) - assetToAmount(cost)) / assetToAmount(cost)) *
      100;
    return val.toFixed(0).toString() + '%';
  } catch (error) {
    return '0%';
  }
};

export const getQueryDataOptions = function (q: unknown): {
  key: string;
  value: string;
}[] {
  console.log('here');
  const route = useRoute();
  const dataOptions = [];
  const query = route.query;
  if (query['filter[tier]'] && query['filter[tier]'] !== 'All') {
    dataOptions.push({ key: 'tier', value: query['filter[tier]'] as string });
  }
  return dataOptions;
};

export const getQueryApiOptions = function (q: unknown): {
  search: string;
  sort: string;
  order: string;
} {
  const route = useRoute();
  const query = route.query;
  const dataOptions = {
    search: (query['search'] as string) || '',
    sort: (query['sort'] as string) || 'created',
    order: (query['order'] as string) || 'desc'
  };
  console.log(dataOptions);
  return dataOptions;
};

export const getQueryPage = function (q: unknown): number {
  const route = useRoute();
  const query = route.query;
  return Number(query['page'] as string) || 1;
};

export const getQueryLimit = function (q: unknown): number {
  const route = useRoute();
  const query = route.query;
  return Number(query['limit'] as string) || 6;
};