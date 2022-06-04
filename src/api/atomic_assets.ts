import { ExplorerApi } from 'atomicassets';
import { AtomicMarketApi } from 'atomicmarket';

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
