import {type Page, test} from '@playwright/test';
import {PlaywrightAuthPage} from './models/auth';

test.describe('Signup for business account', async () => {
  let page: Page;
  let auth: PlaywrightAuthPage;
  test.beforeAll(async ({browser}) => {
    page = await browser.newPage();
    auth = new PlaywrightAuthPage(
      page,
      `testerne${Date.now()}@pyen5ufb.mailosaur.net`,
    );
  });

  test('Login and enter code', () => auth.login());

  test('First time user, type firstname, lastname', async () => {
    await page.waitForURL(`./account`);
    await page.getByTestId('first-name-input').click();
    await page.getByTestId('first-name-input').fill('fornavn');
    await page.getByTestId('last-name-input').click();
    await page.getByTestId('last-name-input').fill('efternavn');
    await page.getByTestId('submit-button').click();
  });

  test('After login, convert to business account', async () => {
    await page.waitForURL(`./account/dashboard`);
    await page.getByTestId('change-business-button').click();
  });

  test('Fill out form for business account', async () => {
    await page.waitForURL(`./account/business`);

    await page.getByTestId('professions-input').click();
    await page
      .locator('div[data-combobox-option="true"][value="makeup_artist"]')
      .click();
    await page
      .locator('div[data-combobox-option="true"][value="hair_stylist"]')
      .click();

    await page.locator('body').click({position: {x: 0, y: 0}});

    await page.getByTestId('speaks-input').click();
    await page
      .locator('div[data-combobox-option="true"][value="danish"]')
      .click();

    await page.locator('body').click({position: {x: 0, y: 0}});

    await page.getByTestId('short-description-input').fill('hej med dig');

    await page.getByTestId('submit-button').click();
  });

  test('Validate business account', async () => {
    await page.waitForURL('./account/dashboard?business=true**');
  });
});
