import { Notify } from 'quasar';

Notify.setDefaults({
  position: 'top-right',
  timeout: 2500,
  textColor: 'white',
  progress: true,
  actions: [{ icon: 'close', color: 'white' }]
});
