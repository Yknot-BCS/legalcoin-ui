import { boot } from 'quasar/wrappers';

// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app }) => {
  if (process.env.NODE_ENV === 'production') {
    app.config.errorHandler = (err) => {
      // const error = new Error('Report caught error to New Relic');
      // console.log(err);
      /* eslint-disable */
      try {
        throw err;
      } catch (err) {
        // @ts-ignore
        newrelic.noticeError(err);
      }
      throw err;
    };
  }
});
