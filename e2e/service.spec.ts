import {expect, test} from '@playwright/test';

import {type Page} from '@playwright/test';
import {PlaywrightAuthPage} from './models/auth';
import {PlaywrightLocationPage} from './models/location';
import {PlaywrightSchedulePage} from './models/schedule';
import {PlaywrightServicePage} from './models/service';

const locationName = 'test service location';
const scheduleName = 'test service schedule';
test.describe('Services create, edit, delete', async () => {
  let page: Page;
  let location: PlaywrightLocationPage;
  let schedule: PlaywrightSchedulePage;
  let auth: PlaywrightAuthPage;
  let service: PlaywrightServicePage;

  test.beforeAll(async ({browser}) => {
    page = await browser.newPage();
    auth = new PlaywrightAuthPage(page);
    location = new PlaywrightLocationPage(page);
    schedule = new PlaywrightSchedulePage(page);
    service = new PlaywrightServicePage(page);
  });

  test('Login and enter code', () => auth.login());

  test('Try to create a service, reject because locations is empty', async () => {
    await service.attemptNavigateToCreatePage();
    await page.waitForURL('./account/services');
    const text = await page.getByTestId('empty-title').textContent();
    expect(text).toBe(
      'Du mangler tilføje en lokation inden du kan tilføje ydelser',
    );
  });

  test('Go to locations, and create new', async () => {
    await page.getByTestId('empty-create-button').click();
    await page.waitForURL('./account/locations/create');
    await location.submitForm(locationName);
  });

  test('Try to create a service, reject because schedules is empty', async () => {
    await service.attemptNavigateToCreatePage();
    await page.waitForURL('./account/services');
    const text = await page.getByTestId('empty-title').textContent();
    expect(text).toBe(
      'Du mangler tilføje en vagtplan inden du kan tilføje ydelser',
    );
  });

  test('Go to schedules, and create new', async () => {
    await page.getByTestId('empty-create-button').click();
    await page.waitForURL('./account/schedules#create');
    await schedule.submitForm(scheduleName);
  });

  test('Go to services, and add new service to user', async () => {
    await service.attemptNavigateToCreatePage();
    await page.waitForURL('./account/services/create');
    await page.getByTestId('category-select').click();
    await page.getByRole('option', {name: 'Hårklip'}).click();

    await page.waitForResponse('/account/api/products**');
    await page.getByTestId('product-select').click();
    await page.getByRole('option', {name: 'Pandehår'}).click();

    await page.getByTestId('price-input').clear();
    await page.getByTestId('price-input').fill('99');

    const value = await page.getByTestId('schedules-select').inputValue();
    expect(value).toBe(scheduleName);
    await Promise.all([
      page.waitForURL('/account/services/**'),
      page.getByTestId('submit-button').click(),
    ]);
  });
});
