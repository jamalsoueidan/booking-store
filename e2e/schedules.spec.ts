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

  test('Navigate to schedule section', () =>
    schedule.navigateToSchedulesPage());

  test('Verify empty schedules', () =>
    schedule.verifyCreateButtonVisibleOnEmptyPage());

  test('Navigate to create schedule', () => schedule.navigateToCreatePage());

  test('Fill schedule form', () => schedule.submitForm(NAME));

  test('Verify schedule creation', () =>
    schedule.verifyScheduleNameIsVisible(NAME));

  test('Edit schedule', () => schedule.editSchedule());

  test('Verify edited schedule with the right values', async () =>
    schedule.verifyEditSchedule());

  test('Rename schedule title', async () =>
    schedule.changeScheduleTitle(CHANGE_NAME));

  test('Verify schedule title is changed', async () => {
    await page.waitForSelector('text="Vagtplan er opdateret!"');
    const respond = await page.getByTestId('schedule-title').textContent();
    expect(respond).toContain(CHANGE_NAME);
  });

  test('Delete schedule', async () => {
    await page.getByTestId('delete-button').click();
    await page.waitForURL('/account/schedules');
  });

  test('Navigate back to schedule section', () =>
    schedule.navigateToSchedulesPage());

  test('Verify schedules section is empty', () =>
    schedule.verifyCreateButtonVisibleOnEmptyPage());
});
