import { ExplorerApi } from 'atomicassets';
import { AtomicMarketApi } from 'atomicmarket';
import { GalleryCard } from 'src/types';
import { useRoute } from 'vue-router';
import { ISale } from 'atomicmarket/build/API/Explorer/Objects';

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
  collection_whitelist?: string;
} {
  const route = useRoute();
  const query = route.query;
  let dataOptions = {} as {
    search: string;
    sort: string;
    order: string;
    collection_whitelist?: string;
  };
  dataOptions = {
    search: (query['search'] as string) || '',
    sort: (query['sort'] as string) || 'created',
    order: (query['order'] as string) || 'desc'
  };
  if (query['collections']) {
    dataOptions = {
      ...dataOptions,
      collection_whitelist: query['collections'] as string
    };
  }
  return dataOptions;
};

export const get_sale = async function (
  ApiParams: any,
  Page: number,
  ItemsPerPage: number,
  DataParams: { key: string; value: string }[],
  status: string
) {
  let count = 0;
  let data: GalleryCard[] = [];
  if (status === 'buynow') {
    const rawData = await atomic_market_api.fetchEndpoint('/v2/sales', {
      ...ApiParams,
      page: Page,
      limit: ItemsPerPage,
      ...DataParams
    });
    count = await atomic_market_api.fetchEndpoint('/v2/sales/_count', {
      ...ApiParams,
      ...DataParams
    });
    data = (rawData as ISale[]).map((sales) => {
      return {
        ...sales.assets[0].data,
        to: '/asset/' + sales.assets[0].asset_id,
        yield: getYield(
          sales.assets[0].data.mintprice,
          sales.assets[0].data.maturedvalue
        ),
        name: sales.assets[0].data.name as string,
        imageUrl:
          sales.assets[0].data.img &&
          (sales.assets[0].data.img as string).includes('http')
            ? (sales.assets[0].data.img as string)
            : 'https://ipfs.io/ipfs/' + (sales.assets[0].data.img as string),
        collection: sales.assets[0].collection.collection_name,
        template: sales.assets[0].template.template_id,
        schema: sales.assets[0].schema.schema_name,
        id: sales.assets[0].asset_id
      } as GalleryCard;
    });
  }
  if (status === 'auction') {
    const rawData = await atomic_market_api.getAuctions(
      ApiParams,
      Page,
      ItemsPerPage,
      DataParams
    );
    count = await atomic_market_api.countAuctions({
      ...ApiParams,
      ...DataParams
    });
    rawData.forEach((element) => {
      data = data.concat(
        element.assets.map((asset) => {
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
        })
      );
    });
  }
  return { data, count };
};

export const getTemplateQueryApiOptions = function (q: unknown): {
  search: string;
  sort: string;
  order: string;
  match?: string;
} {
  const route = useRoute();
  const query = route.query;
  let dataOptions = {} as {
    search: string;
    sort: string;
    order: string;
    match?: string;
  };
  if (query['filter[tier]'] && query['filter[tier]'] !== 'All') {
    dataOptions = {
      search: (query['search'] as string) || '',
      sort: (query['sort'] as string) || 'created',
      order: (query['order'] as string) || 'desc',
      match: (query['filter[tier]'] as string) || null
    };
  } else {
    dataOptions = {
      search: (query['search'] as string) || '',
      sort: (query['sort'] as string) || 'created',
      order: (query['order'] as string) || 'desc'
    };
  }
  return dataOptions;
};

export const getSalesQueryApiOptions = function (
  q: unknown,
  status: string
): {
  search?: string;
  sort?: string;
  order?: string;
  match?: string;
  seller?: string;
  seller_blacklist?: string;
  market?: string[];
  collection_whitelist?: string;
  min_price?: string;
  max_price?: string;
  symbol?: string;
} {
  const route = useRoute();
  const query = route.query;
  if (status === 'buynow') {
    let dataOptions = {} as {
      search: string;
      sort: string;
      order: string;
      match?: string;
      seller?: string;
      seller_blacklist?: string;
      market?: string[];
      collection_whitelist?: string;
      min_price?: string;
      max_price?: string;
      symbol?: string;
    };
    dataOptions = {
      search: (query['search'] as string) || '',
      sort: (query['sort'] as string) || 'created',
      order: (query['order'] as string) || 'desc'
    };
    if (query['filter[tier]'] && query['filter[tier]'] !== 'All') {
      dataOptions = {
        ...dataOptions,
        match: (query['filter[tier]'] as string) || null
      };
    }
    if (query['market'] && (query['market'] as string[]).includes('retail')) {
      dataOptions = {
        ...dataOptions,
        seller_blacklist: process.env.AA_ACCOUNT
      };
    } else {
      dataOptions = { ...dataOptions, seller: process.env.AA_ACCOUNT };
    }
    if (query['min_price'] && query['max_price']) {
      dataOptions = {
        ...dataOptions,
        min_price: (query['min_price'] as string) || '0',
        max_price: (query['max_price'] as string) || '10000',
        symbol: 'WAX'
      };
    }
    if (query['collections']) {
      dataOptions = {
        ...dataOptions,
        collection_whitelist: query['collections'] as string
      };
    }
    return dataOptions;
  } else {
    let dataOptions = {} as {
      search?: string;
      sort: string;
      order: string;
      match?: string;
      seller?: string;
      seller_blacklist?: string;
      market?: string[];
      collection_whitelist?: string;
      min_price?: string;
      max_price?: string;
      symbol?: string;
    };
    dataOptions = {
      sort: (query['sort'] as string) || 'created',
      order: (query['order'] as string) || 'desc'
    };
    if (query['filter[tier]'] && query['filter[tier]'] !== 'All') {
      dataOptions = {
        ...dataOptions,
        match: (query['filter[tier]'] as string) || null
      };
    }
    if (
      query['market'] &&
      (query['market'] as string[]).includes('secondary')
    ) {
      dataOptions = {
        ...dataOptions,
        seller_blacklist: process.env.AA_ACCOUNT
      };
    }
    if (query['min_price'] && query['max_price']) {
      dataOptions = {
        ...dataOptions,
        min_price: (query['min_price'] as string) || '0',
        max_price: (query['max_price'] as string) || '10000',
        symbol: 'WAX'
      };
    }
    if (query['collections']) {
      dataOptions = {
        ...dataOptions,
        collection_whitelist: query['collections'] as string
      };
    }
    return dataOptions;
  }
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

export const getQueryMarket = function (q: unknown): string {
  const route = useRoute();
  const query = route.query;
  return (query['market'] as string) || 'primary';
};

export const getQueryPrice = function (q: unknown): {
  min: number;
  max: number;
} {
  const route = useRoute();
  const query = route.query;
  return {
    min: Number(query['min_price']) || 0,
    max: Number(query['max_price']) || 10000
  };
};

export const getCollectionsList = async function (): Promise<{
  array: string[];
  stringList: string;
}> {
  const collectionsfilter = {
    authorized_account: process.env.AA_ACCOUNT,
    limit: 100,
    order: 'desc',
    sort: 'created'
  } as unknown;
  const data = await atomic_api.getCollections(collectionsfilter);
  const dataList = data.map((col) => col.collection_name);
  return { array: dataList, stringList: dataList.toString() };
};

export const getQueryStatus = function (q: unknown): string {
  const route = useRoute();
  const query = route.query;
  return (query['status'] as string) || 'buynow';
};
