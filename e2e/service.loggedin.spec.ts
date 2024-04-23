import {type BrowserContext, expect, type Page, test} from '@playwright/test';

import {PlaywrightLocationPage} from './models/location';
import {PlaywrightSchedulePage} from './models/schedule';
import {PlaywrightServicePage} from './models/service';

const locationName = 'test service location';
const scheduleName = 'test service schedule';

test.describe.configure({mode: 'serial'});

test.describe('Services create, edit, delete', async () => {
  let page: Page;
  let location: PlaywrightLocationPage;
  let schedule: PlaywrightSchedulePage;
  let service: PlaywrightServicePage;
  let context: BrowserContext;

  test.beforeAll(async ({browser}) => {
    page = await browser.newPage();
    context = await browser.newContext();
    location = new PlaywrightLocationPage(page);
    schedule = new PlaywrightSchedulePage(page);
    service = new PlaywrightServicePage(page);
    await page.goto('./account/dashboard');
  });

  test('Try to create a service, reject because locations is empty', async () => {
    await page.goto('./account/dashboard');
    await service.navigateToServicesSection();
    const text = await page.getByTestId('empty-title').textContent();
    expect(text).toBe(
      'Du mangler oprette en lokation inden du kan tilføje ydelser',
    );
  });

  test('Navigate to locations, and create new', async () => {
    await location.navigateToLocationsPage();
    await location.navigateToCreatePage();
    await location.submitForm(locationName);
  });

  test('Try to create a service, reject because schedules is empty', async () => {
    await service.navigateToServicesSection();
    const text = await page.getByTestId('empty-title').textContent();
    expect(text).toBe(
      'Du mangler oprette en vagtplan inden du kan tilføje ydelser',
    );
  });

  test('Navigate to schedules, and create new', async () => {
    await schedule.navigateToSchedulesPage();
    await schedule.navigateToCreatePage();
    await schedule.submitForm(scheduleName);
  });

  test('Navigate to services', () => service.navigateToServicesSection());

  test('Navigate to service create page', () =>
    service.navigateToServicesCreatePage());

  test('Submit service form', () => service.submitForm('Hårklip', 'Pandehår'));

  test('Verify service data', async () => {
    const text = await page.getByTestId('account-title').textContent();
    expect(text).toContain('Pandehår');
  });

  test('Navigate to dashboard', () => service.navigateToDashboardPage());

  test('Verify schedules is checked as done on the dashboard', async () => {
    const isVisible = await page.getByTestId('services-icon-check').isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('Navigate to the artist page', async () => {
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      await page.getByTestId('preview-link').click(),
    ]);

    await newPage.waitForSelector('h1');
    const headerText = await newPage.textContent('h1');
    console.log('Header Text:', headerText);
  });
});
