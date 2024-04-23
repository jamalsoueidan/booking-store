import {PlaywrightAdminPage} from './admin';

export class PlaywrightServicePage extends PlaywrightAdminPage {
  async navigateToServicesSection() {
    await this.page.getByTestId('services-link').click();
    await this.page.waitForURL('./account/services');
  }

  async navigateToServicesCreatePage() {
    await this.page.getByTestId('empty-create-button').click();
    await this.page.waitForURL('./account/services/create');
  }

  async submitForm(category: string, product: string) {
    await this.page.getByTestId('category-select').click();
    await this.page.getByRole('option', {name: category}).click();

    await this.page.waitForResponse('/account/api/products**');
    await this.page.getByTestId('product-select').click();
    await this.page.getByRole('option', {name: product}).click();

    await this.page.getByTestId('price-input').clear();
    await this.page.getByTestId('price-input').fill('99');

    //const value = await this.page.getByTestId('schedules-select').inputValue();
    //expect(value).toBe(scheduleName);
    await this.page.getByTestId('submit-button').click();
    await this.page.waitForURL(/\/account\/services\/\d+$/);
  }
}
