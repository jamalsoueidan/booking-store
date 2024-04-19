import {expect, test} from '@playwright/test';

import {type Page} from '@playwright/test';
import MailosaurClient from 'mailosaur';

const serverId = 'pyen5ufb';
const testEmail = 'testerne1713224438542@pyen5ufb.mailosaur.net';
const NAME = 'Your Schedule Name';
const CHANGE_NAME = 'Test Schedule';
const mailosaur = new MailosaurClient(process.env.MAILOSAUR_API_KEY || '');

test.describe('Schedules create, edit, delete', async () => {
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

  test('Go to schedules, and create new', async () => {
    await page.waitForURL(`./account/dashboard`);
    await page.getByTestId('create-schedule-button').click();
    await page.waitForURL(`./account/schedules#create`);
    await page.getByTestId('name-input').click();
    await page.getByTestId('name-input').fill(NAME);
    await Promise.all([
      page.waitForURL('/account/schedules/**'),
      page.getByTestId('submit-button').click(),
    ]);
  });

  test('Verify schedule creation', async () => {
    await page.getByTestId('schedule-title').isVisible();
    await page.waitForLoadState('load');
  });

  test('Edit schedule', async () => {
    await page.getByTestId('tuesday-checkbox').click();
    await page.getByTestId('tuesday-from-select').click();
    await page.getByRole('option', {name: '08:00'}).click();
    await page.getByTestId('tuesday-to-select').click();
    await page.getByRole('option', {name: '18:00'}).locator('span').click();

    await page.getByTestId('wednesday-checkbox').click();
    await page.getByTestId('wednesday-from-select').click();
    await page.getByRole('option', {name: '08:00'}).click();
    await page.getByTestId('wednesday-to-select').click();
    await page.getByRole('option', {name: '18:00'}).locator('span').click();
    await Promise.all([
      page.waitForResponse(
        '/account/schedules/**?_data=routes%2Faccount.schedules.%24scheduleHandle',
      ),
      page.getByTestId('submit-button').click(),
    ]);
  });

  test('Verify edited schedule with the right values', async () => {
    const tuesdayFrom = await page
      .getByTestId('tuesday-from-select')
      .evaluate<any, HTMLSelectElement>((select) => select.value);
    const tuesdayTo = await page
      .getByTestId('tuesday-to-select')
      .evaluate<any, HTMLSelectElement>((select) => select.value);

    expect(tuesdayFrom).toBe('08:00');
    expect(tuesdayTo).toBe('18:00');

    const wednesdayFrom = await page
      .getByTestId('wednesday-from-select')
      .evaluate<any, HTMLSelectElement>((select) => select.value);
    const wednesdayTo = await page
      .getByTestId('wednesday-to-select')
      .evaluate<any, HTMLSelectElement>((select) => select.value);

    expect(wednesdayFrom).toBe('08:00');
    expect(wednesdayTo).toBe('18:00');

    await page.screenshot({path: '../screenshot.png'});
  });

  test('Rename schedule title', async () => {
    await page.getByTestId('change-name-button').click();
    await page.getByTestId('name-input').click();
    await page.getByTestId('name-input').clear();
    await page.getByTestId('name-input').fill(CHANGE_NAME);
    await Promise.all([
      page.waitForResponse(
        '/account/schedules/**?_data=routes%2Faccount.schedules.%24scheduleHandle',
      ),
      page.getByTestId('update-button').click(),
    ]);
  });

  test('Verify schedule title is changed', async () => {
    await page.waitForSelector('text="Vagtplan er opdateret!"');
    const respond = await page.getByTestId('schedule-title').textContent();
    expect(respond).toBe(`${CHANGE_NAME} vagtplan:`);
  });

  test('Delete schedule', async () => {
    await page.getByTestId('delete-button').click();
    await page.waitForURL('/account/schedules');
    await page.getByTestId('empty-create-button').isVisible();
  });
});
