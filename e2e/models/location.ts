import {type Page} from '@playwright/test';

export class PlaywrightLocationPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToCreatePage() {
    await this.navigateToLocationsPage();
    await this.page.getByTestId('empty-create-button').click();
    await this.page.waitForURL('./account/locations/create');
  }

  async navigateToLocationsPage() {
    await this.page.getByTestId('locations-link').click();
    await this.page.waitForURL(`./account/locations`);
  }

  async submitForm(name: string) {
    // Fill out form to create a location
    await this.page.getByTestId('name-input').fill(name);
    await this.page
      .getByTestId('address-input')
      .pressSequentially('Sigridsvej 45, Brabrand', {delay: 150});

    await this.page.locator('div[data-combobox-option="true"]').first().click();

    await this.page.getByTestId('origin-type-input').click();
    await this.page
      .locator('div[data-combobox-option="true"][value="home"]')
      .click();

    await this.page.getByTestId('submit-button').click();
    await this.page.waitForURL('./account/locations');
  }

  async destroy(name: string) {
    await this.navigateToLocationsPage();
    const location = this.page.locator(
      `[data-testid="name-title"]:has-text("${name}")`,
    );
    await location.click();
    await this.page.waitForURL('**/edit');
    await this.page.locator('[data-testid^="delete-button"]').click();
    await this.page.waitForURL('/account/locations');
  }
}
