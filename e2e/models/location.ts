import {expect, type Page} from '@playwright/test';

export class PlaywrightLocationPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToCreatePage() {
    await this.page.getByTestId('empty-create-button').click();
    await this.page.waitForURL('./account/locations/create');
  }

  async navigateToLocationsPage() {
    await this.page.getByTestId('locations-link').click();
    await this.page.waitForURL(`./account/locations`);
  }

  async navigateToLocationByName(name: string) {
    const locations = await this.page.locator('[data-testid^="location-item"]');
    const location = locations.locator(`text=${name}`);
    await location.click();
    await this.page.waitForURL('**/edit');
  }

  async verifyCreateButtonVisibleOnEmptyPage() {
    const locator = await this.page.getByTestId('empty-create-button');
    await expect(locator.isVisible()).toBeTruthy();
  }

  async verifyLocationNameIsVisible(name: string) {
    const locator = await this.page.locator(
      `[data-testid="name-title"]:has-text("${name}")`,
    );
    expect(locator).toHaveCount(1);
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

  async updateForm(editName: string) {
    await this.page.getByTestId('name-input').clear();
    await this.page.getByTestId('name-input').fill(editName);
    await this.page.getByTestId('submit-button').click();
    await this.page.waitForSelector('text="Lokation er opdateret!"');
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
