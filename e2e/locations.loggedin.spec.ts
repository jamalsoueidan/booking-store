import {expect, type Page, test} from '@playwright/test';
import {PlaywrightLocationPage} from './models/location';

const NAME = 'location ' + new Date().getTime();
const EDIT_NAME = NAME + ' edited';

test.describe('Locations create, edit, delete', async () => {
  let page: Page;
  let location: PlaywrightLocationPage;

  test.beforeAll(async ({browser}) => {
    page = await browser.newPage();
    location = new PlaywrightLocationPage(page);
    await page.goto('./account/dashboard');
  });

  test('Navigate to locations section', () =>
    location.navigateToLocationsPage());

  test('Verify location section is empty', () =>
    location.verifyCreateButtonVisibleOnEmptyPage());

  test('Navigate to create location', () => location.navigateToCreatePage());

  test('Fill location form', () => location.submitForm(NAME));

  test('Navigate back to locations section', () =>
    location.navigateToLocationsPage());

  test('Verify location is created', () =>
    location.verifyLocationNameIsVisible(NAME));

  test('Navigate to dashboard', () => location.navigateToDashboardPage());

  test('Verify locations is checked as done on the dashboard', async () => {
    const isVisible = await page
      .getByTestId('locations-icon-check')
      .isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('Return to locations section', () => location.navigateToLocationsPage());

  test('Navigate to edit location', () =>
    location.navigateToLocationByName(NAME));

  test('Update location form', () => location.updateForm(EDIT_NAME));

  test('Navigate back again to locations section', () =>
    location.navigateToLocationsPage());

  test('Verify location is edited', () =>
    location.verifyLocationNameIsVisible(NAME));

  test('Delete it', () => location.destroy(EDIT_NAME));

  test('Verify location is deleted', async () => {
    const locator = await page.locator(
      `[data-testid="name-title"]:has-text("${EDIT_NAME}")`,
    );
    expect(locator).not.toBeVisible();
  });

  test('Verify locations is empty again', () =>
    location.verifyCreateButtonVisibleOnEmptyPage());

  test('Navigate back to dashboard', () => location.navigateToDashboardPage());

  test('Verify locations is not done on the dashboard', async () => {
    const isVisible = await page
      .getByTestId('locations-icon-uncheck')
      .isVisible();
    expect(isVisible).toBeTruthy();
  });
});
