import { boot } from 'quasar/wrappers';
import Rollbar from 'rollbar';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $rollbar: Rollbar;
  }
}

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app }) => {
  // something to do
  app.config.globalProperties.$rollbar = new Rollbar({
    accessToken: '51d299798ff44681b73b401018e6bd92',
    captureUncaught: true,
    captureUnhandledRejections: true
  });
});
