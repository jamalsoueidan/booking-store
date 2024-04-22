import {expect, type Page} from '@playwright/test';

export class PlaywrightSchedulePage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToCreatePage() {
    await this.page.getByTestId('empty-create-button').click();
    await this.page.waitForURL('./account/schedules#create');
  }

  async navigateToSchedulesPage() {
    await this.page.getByTestId('schedules-link').click();
    await this.page.waitForURL(`./account/schedules`);
  }

  async verifyCreateButtonVisibleOnEmptyPage() {
    const locator = await this.page.getByTestId('empty-create-button');
    await expect(locator.isVisible()).toBeTruthy();
  }

  async submitForm(name: string) {
    await this.page.getByTestId('name-input').click();
    await this.page.getByTestId('name-input').fill(name);
    await Promise.all([
      this.page.waitForURL('/account/schedules/**'),
      this.page.getByTestId('submit-button').click(),
    ]);
  }

  async verifyScheduleNameIsVisible(name: string) {
    const text = await this.page.getByTestId('schedule-title').textContent();
    expect(text).toContain(name);
    await this.page.waitForLoadState('load');
  }

  async editSchedule() {
    await this.page.getByTestId('tuesday-checkbox').click();
    await this.page.getByTestId('tuesday-from-select').click();
    await this.page.getByRole('option', {name: '08:00'}).click();
    await this.page.getByTestId('tuesday-to-select').click();
    await this.page
      .getByRole('option', {name: '18:00'})
      .locator('span')
      .click();

    await this.page.getByTestId('wednesday-checkbox').click();
    await this.page.getByTestId('wednesday-from-select').click();
    await this.page.getByRole('option', {name: '08:00'}).click();
    await this.page.getByTestId('wednesday-to-select').click();
    await this.page
      .getByRole('option', {name: '18:00'})
      .locator('span')
      .click();
    await Promise.all([
      this.page.waitForResponse(
        '/account/schedules/**?_data=routes%2Faccount.schedules.%24scheduleHandle',
      ),
      this.page.getByTestId('submit-button').click(),
    ]);
  }

  async verifyEditSchedule() {
    const tuesdayFrom = await this.page
      .getByTestId('tuesday-from-select')
      .evaluate<any, HTMLSelectElement>((select) => select.value);
    const tuesdayTo = await this.page
      .getByTestId('tuesday-to-select')
      .evaluate<any, HTMLSelectElement>((select) => select.value);

    expect(tuesdayFrom).toBe('08:00');
    expect(tuesdayTo).toBe('18:00');

    const wednesdayFrom = await this.page
      .getByTestId('wednesday-from-select')
      .evaluate<any, HTMLSelectElement>((select) => select.value);
    const wednesdayTo = await this.page
      .getByTestId('wednesday-to-select')
      .evaluate<any, HTMLSelectElement>((select) => select.value);

    expect(wednesdayFrom).toBe('08:00');
    expect(wednesdayTo).toBe('18:00');
  }

  async changeScheduleTitle(name: string) {
    await this.page.getByTestId('change-name-button').click();
    await this.page.getByTestId('name-input').click();
    await this.page.getByTestId('name-input').clear();
    await this.page.getByTestId('name-input').fill(name);
    await Promise.all([
      this.page.waitForResponse(
        '/account/schedules/**?_data=routes%2Faccount.schedules.%24scheduleHandle',
      ),
      this.page.getByTestId('update-button').click(),
    ]);
  }
}
