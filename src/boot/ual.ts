/* eslint-disable @typescript-eslint/no-unsafe-call */
import { boot } from 'quasar/wrappers';
import { UAL } from 'universal-authenticator-library';
import { YknotAuthenticator } from 'ual-ya';
import { Anchor } from 'ual-anchor';
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $ual: UAL;
  }
}

let ual = new UAL(null, null, null);

export default boot(({ app }) => {
  const mainChain = {
    chainId: process.env.NETWORK_CHAIN_ID,
    rpcEndpoints: [
      {
        protocol: process.env.NETWORK_PROTOCOL,
        host: process.env.NETWORK_HOST,
        port: parseInt(process.env.NETWORK_PORT)
      }
    ]
  };

  const authenticators = [
    new Anchor([mainChain], { appName: process.env.APP_NAME }),
    new YknotAuthenticator([mainChain], { appName: process.env.APP_NAME })
  ];

  ual = new UAL([mainChain], 'ual', authenticators);

  app.config.globalProperties.$ual = ual;
});

export { ual };
