import { Notify } from 'quasar';

Notify.setDefaults({
  position: 'bottom-right',
  timeout: 4000,
  textColor: 'white',
  progress: true,
  actions: [{ icon: 'close', color: 'white' }]
});
