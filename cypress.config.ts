import {defineConfig} from 'cypress';
import setupNodeEvents from './cypress/plugins/index';

export default defineConfig({
  e2e: {
    projectId: 'm8irxe',
    baseUrl: 'http://localhost:3000',
    experimentalStudio: true,
    chromeWebSecurity: false,
    setupNodeEvents,
  },
});
