import { ExplorerApi } from 'atomicassets';

export const atomic_api = new ExplorerApi(
  process.env.ATOMICASSETS_API_ENDPOINT,
  'atomicassets',
  { fetch }
);
