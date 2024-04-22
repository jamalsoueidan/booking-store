import {type Page} from '@playwright/test';

export class PlaywrightAdminPage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToDashboardPage() {
    await this.page.getByTestId('dashboard-link').click();
    await this.page.waitForURL('./account/dashboard');
  }
}
