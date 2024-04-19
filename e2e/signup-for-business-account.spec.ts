import {type Page, test} from '@playwright/test';
import MailosaurClient from 'mailosaur';

const serverId = 'pyen5ufb';
const timestamp = Date.now();
const mailosaur = new MailosaurClient(process.env.MAILOSAUR_API_KEY || '');

test.describe('Signup for business account', async () => {
  let page: Page;
  test.beforeAll(async ({browser}) => {
    page = await browser.newPage();
  });

  test('Login Email', async () => {
    await page.goto('./');
    await page.getByTestId('login-button').click();
    await page.getByLabel('Mailadresse', {exact: true}).click();
    await page
      .getByLabel('Mailadresse', {exact: true})
      .fill(`testerne${timestamp}@pyen5ufb.mailosaur.net`);

    await page.getByRole('button', {name: 'Fortsæt'}).click();
  });

  test('Login Code', async () => {
    const email = await mailosaur.messages.get(serverId, {
      sentTo: `testerne${timestamp}@pyen5ufb.mailosaur.net`,
    });

    await page.getByPlaceholder('6-cifret kode').click();
    if (email.text && email.text.codes) {
      await page
        .getByPlaceholder('6-cifret kode')
        .fill(email.text?.codes[0].value || '');
    }

    await page.click('button[type="submit"]');
  });

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
