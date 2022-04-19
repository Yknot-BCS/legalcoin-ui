# Project Structure & Notes
├── public/  
├── src/  
│    ├── assets/ svgs & images  
│    ├── boot/  entrypoint when compiled (quasar)  
│    ├── components/ vue sfcs  
│    ├── css/ - sass styles  
│    ├── layouts/  
│    ├── pages/  
│    ├── router/ - route & history management (route module example)  
│    ├── store/ - app state management  
│    ├── types/ - typescript types 
│    ├── App.vue - app mount component  
├── test/ - jest unit tests
├── .eslintrc.js - linter settings that implements prettier plugin  
├── .prettierrc.js - linter rules for pretttier plugin  
├── jest.config.js - jest unit testing settings & reporting thresholds  
├── quasar.conf.js - quasar settings  
├── .tsconfig.json - typescript settings  

- This configuration supports development using both Vue 2 (options) and Vue 3 (composition) which will make upgrading/fully migrating easy in the future  
