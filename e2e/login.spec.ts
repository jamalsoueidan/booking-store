import {test} from '@playwright/test';
import MailosaurClient from 'mailosaur';

const serverId = 'pyen5ufb';

const mailosaur = new MailosaurClient(process.env.MAILOSAUR_API_KEY || '');

test('test', async ({page}) => {
  const timestamp = Date.now();

  await page.goto('');

  await page.getByLabel('Account Login').click();
  await page.getByLabel('Email', {exact: true}).click();
  await page
    .getByLabel('Email', {exact: true})
    .fill(`testerne${timestamp}@pyen5ufb.mailosaur.net`);

  await page.getByRole('button', {name: 'Continue'}).click();

  const email = await mailosaur.messages.get(serverId, {
    sentTo: `testerne${timestamp}@pyen5ufb.mailosaur.net`,
  });

  await page.getByPlaceholder('-digit code').click();
  if (email.text && email.text.codes) {
    await page
      .getByPlaceholder('-digit code')
      .fill(email.text?.codes[0].value || '');
  }

  await page.goto(`./account/dashboard`);
});
