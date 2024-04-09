import {defineConfig} from 'cypress';

export default defineConfig({
  e2e: {
    projectId: 'm8irxe',
    baseUrl: 'http://localhost:3000',
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
