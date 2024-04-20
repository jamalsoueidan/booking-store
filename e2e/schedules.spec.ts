import {expect, test} from '@playwright/test';

import {type Page} from '@playwright/test';
import {PlaywrightAuthPage} from './models/auth';
import {PlaywrightSchedulePage} from './models/schedule';

const NAME = 'Your Schedule Name';
const CHANGE_NAME = 'Test Schedule';

test.describe('Schedules create, edit, delete', async () => {
  let page: Page;
  let auth: PlaywrightAuthPage;
  let schedule: PlaywrightSchedulePage;
  test.beforeAll(async ({browser}) => {
    page = await browser.newPage();
    auth = new PlaywrightAuthPage(page);
    schedule = new PlaywrightSchedulePage(page);
  });

  test('Login and enter code', () => auth.login());

  test('Go to schedules, and create new', async () => {
    await schedule.navigateToCreatePage();
    await schedule.submitForm(NAME);
  });

  test('Verify schedule creation', async () => {
    const isVisible = await page.getByTestId('schedule-title').isVisible();
    expect(isVisible).toBeTruthy();
    await page.waitForLoadState('load');
  });

  test('Edit schedule', async () => {
    await page.getByTestId('tuesday-checkbox').click();
    await page.getByTestId('tuesday-from-select').click();
    await page.getByRole('option', {name: '08:00'}).click();
    await page.getByTestId('tuesday-to-select').click();
    await page.getByRole('option', {name: '18:00'}).locator('span').click();

    await page.getByTestId('wednesday-checkbox').click();
    await page.getByTestId('wednesday-from-select').click();
    await page.getByRole('option', {name: '08:00'}).click();
    await page.getByTestId('wednesday-to-select').click();
    await page.getByRole('option', {name: '18:00'}).locator('span').click();
    await Promise.all([
      page.waitForResponse(
        '/account/schedules/**?_data=routes%2Faccount.schedules.%24scheduleHandle',
      ),
      page.getByTestId('submit-button').click(),
    ]);
  });

  test('Verify edited schedule with the right values', async () => {
    const tuesdayFrom = await page
      .getByTestId('tuesday-from-select')
      .evaluate<any, HTMLSelectElement>((select) => select.value);
    const tuesdayTo = await page
      .getByTestId('tuesday-to-select')
      .evaluate<any, HTMLSelectElement>((select) => select.value);

    expect(tuesdayFrom).toBe('08:00');
    expect(tuesdayTo).toBe('18:00');

    const wednesdayFrom = await page
      .getByTestId('wednesday-from-select')
      .evaluate<any, HTMLSelectElement>((select) => select.value);
    const wednesdayTo = await page
      .getByTestId('wednesday-to-select')
      .evaluate<any, HTMLSelectElement>((select) => select.value);

    expect(wednesdayFrom).toBe('08:00');
    expect(wednesdayTo).toBe('18:00');
  });

  test('Rename schedule title', async () => {
    await page.getByTestId('change-name-button').click();
    await page.getByTestId('name-input').click();
    await page.getByTestId('name-input').clear();
    await page.getByTestId('name-input').fill(CHANGE_NAME);
    await Promise.all([
      page.waitForResponse(
        '/account/schedules/**?_data=routes%2Faccount.schedules.%24scheduleHandle',
      ),
      page.getByTestId('update-button').click(),
    ]);
  });

  test('Verify schedule title is changed', async () => {
    await page.waitForSelector('text="Vagtplan er opdateret!"');
    const respond = await page.getByTestId('schedule-title').textContent();
    expect(respond).toBe(`${CHANGE_NAME} vagtplan:`);
  });

  test('Delete schedule', async () => {
    await page.getByTestId('delete-button').click();
    await page.waitForURL('/account/schedules');
    await page.getByTestId('empty-create-button').isVisible();
  });
});
