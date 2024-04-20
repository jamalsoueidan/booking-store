import {type Page} from '@playwright/test';

export class PlaywrightServicePage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async attemptNavigateToCreatePage() {
    await this.page.goto('./account/dashboard');
    await this.page.waitForURL(`./account/dashboard`);
    await this.page.getByTestId('create-service-button').click();
  }

  async submitForm(name: string) {}
}
