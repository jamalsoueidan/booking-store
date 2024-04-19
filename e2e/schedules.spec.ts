import {test} from '@playwright/test';

import {type Page} from '@playwright/test';
import MailosaurClient from 'mailosaur';

const serverId = 'pyen5ufb';
const testEmail = 'testerne1713224438542@pyen5ufb.mailosaur.net';
const NAME = 'Your Schedule Name';
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
    await page.getByLabel('Email', {exact: true}).click();
    await page.getByLabel('Email', {exact: true}).fill(testEmail);
    await page.getByRole('button', {name: 'Continue'}).click();
  });

  test('Login Code', async () => {
    const email = await mailosaur.messages.get(serverId, {
      sentTo: testEmail,
    });

    await page.getByPlaceholder('-digit code').click();
    if (email.text && email.text.codes) {
      await page
        .getByPlaceholder('-digit code')
        .fill(email.text?.codes[0].value || '');
    }

    await page.click('button[type="submit"]');
  });

  test('Go to schedules, and create new', async () => {
    await page.waitForURL(`./account/dashboard`);
    await page.getByTestId('create-schedule-button').click();
    await page.getByTestId('name-input').click();
    await page.getByTestId('name-input').fill(NAME);
    await page.getByTestId('submit-button').click();
    await page.waitForURL('./account/schedules/**');
  });

  test('Verify schedule creation', async () => {
    await page.getByText(`${NAME} vagtplan:`).isVisible();
  });

  test('Edit schedule', async () => {
    await page.getByTestId('tuesday-from-select').click();
    await page.getByRole('option', {name: '08:00'}).click();
    await page.getByTestId('tuesday-to-select').click();
    await page.getByRole('option', {name: '18:00'}).locator('span').click();

    await page.getByTestId('wednesday-from-select').click();
    await page.getByRole('option', {name: '08:00'}).click();
    await page.getByTestId('wednesday-from-select').click();
    await page.getByRole('option', {name: '18:00'}).locator('span').click();
    await page.getByTestId('submit-button').click();
    await page.waitForURL('./account/schedules/**');
  });

  test('Confirm edited schedule and delete it', async () => {
    const selectedValue = await page
      .getByTestId('tuesday-from-select')
      .evaluate<any, HTMLSelectElement>((select) => select.value);

    console.log(selectedValue);
  });
});
