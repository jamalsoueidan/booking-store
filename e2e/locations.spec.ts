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

  test('Go to locations, and create new', async () => {
    await location.navigateToCreatePage();
    await location.submitForm(NAME);
  });

  test('Verify location creation', async () => {
    await location.navigateToLocationsPage();
    const locator = await page.locator(
      `[data-testid="name-title"]:has-text("${NAME}")`,
    );

    expect(locator).toHaveCount(1);
  });

  test('Navigate to edit location', async () => {
    const locations = await page.locator('[data-testid^="location-item"]');
    const location = locations.locator(`text=${NAME}`);
    await location.click();
    await page.waitForURL('**/edit');
    await page.getByTestId('name-input').clear();
    await page.getByTestId('name-input').fill(EDIT_NAME);
    await page.getByTestId('submit-button').click();
    await page.waitForSelector('text="Lokation er opdateret!"');
  });

  test('Verify the edited location', async () => {
    await location.navigateToLocationsPage();
    const locator = await page.locator(
      `[data-testid="name-title"]:has-text("${EDIT_NAME}")`,
    );
    expect(locator).toHaveCount(1);
  });

  test('Delete it', () => location.destroy(EDIT_NAME));

  test('Verify deleted', async () => {
    const locator = await page.locator(
      `[data-testid="name-title"]:has-text("${EDIT_NAME}")`,
    );
    expect(locator).not.toBeVisible();
  });
});
