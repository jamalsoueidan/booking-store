import {expect, test} from '@playwright/test';

import {type Page} from '@playwright/test';
import {PlaywrightSchedulePage} from './models/schedule';

const NAME = 'Your Schedule Name';
const CHANGE_NAME = 'Test Schedule';

test.describe('Schedules create, edit, delete', async () => {
  let page: Page;
  let schedule: PlaywrightSchedulePage;

  test.beforeAll(async ({browser}) => {
    page = await browser.newPage();
    schedule = new PlaywrightSchedulePage(page);
    await page.goto('./account/dashboard');
  });

  test('Navigate to schedule section', () =>
    schedule.navigateToSchedulesPage());

  test('Verify empty schedules', () =>
    schedule.verifyCreateButtonVisibleOnEmptyPage());

  test('Navigate to create schedule', () => schedule.navigateToCreatePage());

  test('Fill schedule form', () => schedule.submitForm(NAME));

  test('Verify schedule is created', () =>
    schedule.verifyScheduleNameIsVisible(NAME));

  test('Navigate to dashboard', () => schedule.navigateToDashboardPage());

  test('Verify schedules is checked as done on the dashboard', async () => {
    const isVisible = await page
      .getByTestId('schedules-icon-check')
      .isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('Return to schedules section', async () => {
    await page.getByTestId('schedules-link').click();
    await page.waitForURL(`./account/schedules/**`); //because in schedules we go directly to schedules nested one
  });

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

  test('Navigate back to dashboard', () => schedule.navigateToDashboardPage());

  test('Verify schedules is not done on the dashboard', async () => {
    const isVisible = await page
      .getByTestId('schedules-icon-uncheck')
      .isVisible();
    expect(isVisible).toBeTruthy();
  });
});
