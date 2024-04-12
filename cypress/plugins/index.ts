import * as dotenv from 'dotenv';
dotenv.config();

const pluginFunction = (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
) => {
  if (!process.env.CYPRESS_MAILOSAUR_API_KEY) {
    console.error(
      'CYPRESS_MAILOSAUR_API_KEY is not defined in the environment variables',
    );
  }

  config.env.MAILOSAUR_API_KEY = process.env.CYPRESS_MAILOSAUR_API_KEY || '';

  return config;
};

export default pluginFunction;
