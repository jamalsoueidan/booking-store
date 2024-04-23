import {test as setup} from '@playwright/test';
import fs from 'fs';
import {PlaywrightAuthPage} from './models/auth';

setup.describe('Authorization login, enter code', async () => {
  let page: any;
  let auth: PlaywrightAuthPage;

  setup.beforeAll(async ({browser}) => {
    page = await browser.newPage();
    auth = new PlaywrightAuthPage(page);
  });

  setup('Login and enter code', async () => {
    if (!fs.existsSync('auth.json')) {
      auth.login();
      page.context().storageState({path: 'auth.json'});
    }
  });
});
