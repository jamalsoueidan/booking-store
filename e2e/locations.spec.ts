import {type Page, test} from '@playwright/test';
import MailosaurClient from 'mailosaur';

const serverId = 'pyen5ufb';
const testEmail = 'testerne1713224438542@pyen5ufb.mailosaur.net';
const NAME = 'Your Location Name';
const mailosaur = new MailosaurClient(process.env.MAILOSAUR_API_KEY || '');

test.describe('Locations create, edit, delete', async () => {
  let page: Page;
  test.beforeAll(async ({browser}) => {
    await mailosaur.messages.deleteAll(serverId);
    page = await browser.newPage();
  });

  test('Login Email', async () => {
    await page.goto('./');
    await page.getByTestId('login-button').click();
    await page.getByLabel('Mailadresse', {exact: true}).click();
    await page.getByLabel('Mailadresse', {exact: true}).fill(testEmail);
    await page.getByRole('button', {name: 'Fortsæt'}).click();
  });

  test('Login Code', async () => {
    const email = await mailosaur.messages.get(serverId, {
      sentTo: testEmail,
    });

    await page.getByPlaceholder('6-cifret kode').click();
    if (email.text && email.text.codes) {
      await page
        .getByPlaceholder('6-cifret kode')
        .fill(email.text?.codes[0].value || '');
    }

    await page.click('button[type="submit"]');
  });

  test('Go to locations, and create new', async () => {
    await page.waitForURL(`./account/dashboard`);
    await page.getByTestId('create-location-button').click();
    await page.waitForURL('**/create');

    // Fill out form to create a location
    await page.getByTestId('name-input').fill(NAME);
    await page
      .getByTestId('address-input')
      .pressSequentially('Sigridsvej 45, Brabrand', {delay: 150});
    //await page.waitForRequest('/api/autocomplete*q=*');
    await page.locator('div[data-combobox-option="true"]').first().click();

    await page.getByTestId('origin-type-input').click();
    await page
      .locator('div[data-combobox-option="true"][value="home"]')
      .click();

    await page.getByTestId('submit-button').click();
    await page.waitForURL('./account/locations');
  });

  test('Verify location creation', async () => {
    const location = page
      .locator('[data-testid^="location-item"]')
      .locator('[data-testid="name-title"]')
      .locator(`text=${NAME}`)
      .first();
    await location.click();
    await page.waitForURL('**/edit');
  });

  test('Edit location', async () => {
    await page.getByTestId('name-input').fill('');
    await page.getByTestId('name-input').fill(`${NAME} edited`);
    await page.getByTestId('submit-button').click();
    await page.waitForTimeout(1000);
    await page.getByTestId('back-link').click();
    await page.waitForURL('/account/locations');
  });

  test('Confirm the edited location and delete it', async () => {
    await page
      .locator('[data-testid^="location-item"]')
      .locator(`[data-testid="name-title"]:has-text("${NAME} edited")`)
      .click();
    await page.waitForURL('**/edit');
    await page.locator('[data-testid^="delete-button"]').click();
    await page.waitForURL('/account/locations');
    await page.getByTestId('empty-title').isVisible();
  });
});
