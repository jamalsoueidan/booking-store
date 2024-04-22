import {PlaywrightAdminPage} from './admin';

export class PlaywrightServicePage extends PlaywrightAdminPage {
  async attemptNavigateToCreatePage() {
    await this.page.goto('./account/dashboard');
    await this.page.waitForURL(`./account/dashboard`);
    await this.page.getByTestId('create-service-button').click();
  }

  async submitForm(name: string) {}
}
