import {expect, type Page, test} from '@playwright/test';
import {PlaywrightAuthPage} from './models/auth';
import {PlaywrightLocationPage} from './models/location';

const NAME = 'location ' + new Date().getTime();
const EDIT_NAME = NAME + ' edited';

test.describe('Locations create, edit, delete', async () => {
  let page: Page;
  let location: PlaywrightLocationPage;
  let auth: PlaywrightAuthPage;
  test.beforeAll(async ({browser}) => {
    page = await browser.newPage();
    auth = new PlaywrightAuthPage(page);
    location = new PlaywrightLocationPage(page);
  });

  test('Login and enter code', () => auth.login());

  test('Navigate to locations section', () =>
    location.navigateToLocationsPage());

  test('Verify empty locations', () =>
    location.verifyCreateButtonVisibleOnEmptyPage());

  test('Navigate to create location', () => location.navigateToCreatePage());

  test('Fill location form', () => location.submitForm(NAME));

  test('Navigate back to locations section', () =>
    location.navigateToLocationsPage());

  test('Verify location creation', () =>
    location.verifyLocationNameIsVisible(NAME));

  test('Navigate to edit location', () =>
    location.navigateToLocationByName(NAME));

  test('Update location form', () => location.updateForm(EDIT_NAME));

  test('Navigate again back to locations section', () =>
    location.navigateToLocationsPage());

  test('Verify edited location creation', () =>
    location.verifyLocationNameIsVisible(NAME));

  test('Delete it', () => location.destroy(EDIT_NAME));

  test('Verify deleted', async () => {
    const locator = await page.locator(
      `[data-testid="name-title"]:has-text("${EDIT_NAME}")`,
    );
    expect(locator).not.toBeVisible();
  });

  test('Verify again empty locations', () =>
    location.verifyCreateButtonVisibleOnEmptyPage());
});
