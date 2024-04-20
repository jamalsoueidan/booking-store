import {type Page} from '@playwright/test';
import MailosaurClient from 'mailosaur';

const DEFAULT_EMAIL = 'testerne1713224438542@pyen5ufb.mailosaur.net';

export class PlaywrightAuthPage {
  private readonly page: Page;
  private readonly serverId = 'pyen5ufb';
  private readonly mailosaur: MailosaurClient = new MailosaurClient(
    process.env.MAILOSAUR_API_KEY || '',
  );

  readonly email: string = '';

  constructor(page: Page, email?: string) {
    this.page = page;
    this.email = email || DEFAULT_EMAIL;
  }

  async login() {
    await this.gotoLogin();
    await this.enterCode();
  }

  private async gotoLogin() {
    await this.mailosaur.messages.deleteAll(this.serverId);
    await this.page.goto('./');
    await this.page.getByTestId('login-button').click();
    await this.page.getByLabel('Mailadresse', {exact: true}).click();
    await this.page.getByLabel('Mailadresse', {exact: true}).fill(this.email);
    await this.page.getByRole('button', {name: 'Fortsæt'}).click();
  }

  private async enterCode() {
    const email = await this.mailosaur.messages.get(this.serverId, {
      sentTo: this.email,
    });

    await this.page.getByPlaceholder('6-cifret kode').click();
    if (email.text && email.text.codes) {
      await this.page
        .getByPlaceholder('6-cifret kode')
        .fill(email.text?.codes[0].value || '');
    }

    await this.page.click('button[type="submit"]');
    await this.page.waitForURL(`./account/dashboard`);
  }
}
