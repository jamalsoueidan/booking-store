import {defineConfig} from 'cypress';

export default defineConfig({
  e2e: {
    projectId: 'm8irxe',
    baseUrl: 'http://localhost:3000',
    experimentalStudio: true,
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      // your plugin code here
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require('./cypress/plugins/index.ts')(on, config);
    },
  },
});
