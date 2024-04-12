import * as dotenv from 'dotenv';
dotenv.config();

module.exports = (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
) => {
  config.env.MAILOSAUR_API_KEY = process.env.CYPRESS_MAILOSAUR_API_KEY;

  return config;
};
