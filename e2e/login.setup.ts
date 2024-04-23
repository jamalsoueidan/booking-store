import {test as setup} from '@playwright/test';

import {PlaywrightAuthPage} from './models/auth';

setup.describe('Authorization login, enter code', async () => {
  let page: any;
  let auth: PlaywrightAuthPage;

  setup.beforeAll(async ({browser}) => {
    page = await browser.newPage();
    auth = new PlaywrightAuthPage(page);
  });

  setup('Login and enter code', () => auth.login());

  setup('Save state', () => page.context().storageState({path: 'auth.json'}));
});
