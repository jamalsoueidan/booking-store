import {type BrowserContext, expect, type Page, test} from '@playwright/test';

import {PlaywrightLocationPage} from './models/location';
import {PlaywrightSchedulePage} from './models/schedule';
import {PlaywrightServicePage} from './models/service';

const LOCATION_NAME = 'test service location';
const SCHEDULE_NAME = 'test service schedule';
const CATEGORY = 'Hårklip';
const PRODUCT = 'Pandehår';

test.describe.configure({mode: 'serial'});

test.describe('Services create, edit, delete', async () => {
  let page: Page;
  let location: PlaywrightLocationPage;
  let schedule: PlaywrightSchedulePage;
  let service: PlaywrightServicePage;
  let context: BrowserContext;

  test.beforeAll(async ({browser}) => {
    context = await browser.newContext();
    page = await context.newPage();
    location = new PlaywrightLocationPage(page);
    schedule = new PlaywrightSchedulePage(page);
    service = new PlaywrightServicePage(page);
    await page.goto('./account/dashboard');
  });

  test('Try to create a service, reject because locations is empty', async () => {
    await service.navigateToServicesSection();
    const text = await page.getByTestId('empty-title').textContent();
    expect(text).toBe(
      'Du mangler oprette en lokation inden du kan tilføje ydelser',
    );
  });

  test('Navigate to locations, and create new', async () => {
    await location.navigateToLocationsPage();
    await location.navigateToCreatePage();
    await location.submitForm(LOCATION_NAME);
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
    await schedule.submitForm(SCHEDULE_NAME);
  });

  test('Navigate to services', () => service.navigateToServicesSection());

  test('Navigate to service create page', () =>
    service.navigateToServicesCreatePage());

  test('Submit service form', () => service.submitForm(CATEGORY, PRODUCT));

  test('Verify service data', async () => {
    const text = await page.getByTestId('account-title').textContent();
    expect(text).toContain(PRODUCT);
  });

  test('Navigate to dashboard', () => service.navigateToDashboardPage());

  test('Verify schedules is checked as done on the dashboard', async () => {
    const isVisible = await page.getByTestId('services-icon-check').isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('Navigate to the artist page', async () => {
    const pagePromise = context.waitForEvent('page');
    await page.getByTestId('preview-link').click();
    const newPage = await pagePromise;
    await newPage.waitForLoadState();

    const notActiveProfile = await newPage
      .getByText('Din konto er inaktiv')
      .isVisible();

    expect(notActiveProfile).toBeTruthy();

    const scheduleButtonVisible = await newPage
      .locator(`[data-testid^="schedule-button"]:has-text("${SCHEDULE_NAME}")`)
      .isVisible();

    expect(scheduleButtonVisible).toBeTruthy();

    const serviceTitleVisible = await newPage
      .locator(`[data-testid^="service-title"]:has-text("${PRODUCT}")`)
      .isVisible();

    expect(serviceTitleVisible).toBeTruthy();
  });
});
