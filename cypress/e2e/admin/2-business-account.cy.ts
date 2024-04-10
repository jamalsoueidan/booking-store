function generateRandomPhoneNumber() {
  const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  return '8080' + randomNumber.toString();
}

describe('business account', () => {
  beforeEach(() => {
    cy.intercept(
      'POST',
      '/account/login?_data=routes%2F%28%24locale%29.account_.login',
    ).as('loginRequest');

    cy.intercept(
      'GET',
      '/account/login?_data=routes%2F%28%24locale%29.account_.login',
    ).as('login');
  });

  it('passes', () => {
    cy.fixture('loginData.json').then((data) => {
      //login
      cy.visit('/');
      cy.wait(3000);
      cy.get('[data-cy="login-button"]').click();
      cy.wait('@login');
      cy.url().should('include', '/account/login');
      cy.get('[data-cy="email-input"]').clear();
      cy.get('[data-cy="email-input"]').type(data.email);
      cy.get('[data-cy="password-input"]').should('be.enabled').clear();
      cy.get('[data-cy="password-input"]').type(data.password);
      cy.get('[data-cy="login-button"]').click();
      cy.wait('@loginRequest');

      cy.get('[data-cy="welcome-title"]').should(
        'have.text',
        'Velkommen til din konto',
      );
      cy.get('[data-cy="change-business-button"]').click();

      // profile page
      cy.url().should(
        'include',
        '/account/profile?firstName=true&lastName=true',
      );

      cy.get('[data-cy="required-notification"]').should('exist');
      cy.get('[data-cy="first-name-input"]').clear();
      cy.get('[data-cy="first-name-input"]').type(data.firstName);
      cy.get('[data-cy="last-name-input"]').clear();
      cy.get('[data-cy="last-name-input"]').type(data.lastName);
      cy.get('[data-cy="phone-input"]').type(generateRandomPhoneNumber());
      cy.get('[data-cy="submit-button"]').click();

      // business page
      cy.url().should('include', '/account/business');

      cy.get('[data-cy="username-input"]').clear();
      cy.get('[data-cy="username-input"]').type(data.username);

      cy.get('[data-cy="username-success"]').should('exist');

      cy.get(
        '[data-cy="gender-input"] input[type="radio"][value="man"]',
      ).check();
      cy.get('[data-cy="professions-input"]').click();
      cy.get('div[data-combobox-option="true"][value="makeup_artist"]').click();
      cy.get('div[data-combobox-option="true"][value="hair_stylist"]').click();
      cy.get('body').click(0, 0);
      cy.get('[data-cy="speaks-input"]').click();
      cy.get('div[data-combobox-option="true"][value="danish"]').click();
      cy.get('body').click(0, 0);
      cy.get('[data-cy="short-description-input"]').type('hej med dig');
      cy.get('[data-cy="submit-button"]').click();

      // finish
      cy.url().should('include', '/account/dashboard?business');
      cy.get('[data-cy="business-notification"]').should('exist');
    });
  });
});
