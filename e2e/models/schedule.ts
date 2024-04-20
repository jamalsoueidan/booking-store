import {type Page} from '@playwright/test';

export class PlaywrightSchedulePage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToCreatePage() {
    await this.navigateToSchedulesPage();
    await this.page.getByTestId('empty-create-button').click();
    await this.page.waitForURL('./account/schedules#create');
  }

  async navigateToSchedulesPage() {
    await this.page.getByTestId('schedules-link').click();
    await this.page.waitForURL(`./account/schedules`);
  }

  async submitForm(name: string) {
    await this.page.getByTestId('name-input').click();
    await this.page.getByTestId('name-input').fill(name);
    await Promise.all([
      this.page.waitForURL('/account/schedules/**'),
      this.page.getByTestId('submit-button').click(),
    ]);
  }
}
