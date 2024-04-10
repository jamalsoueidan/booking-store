function generateRandomPhoneNumber() {
  const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  return '8080' + randomNumber.toString();
}

describe('login', () => {
  it('passes', () => {
    cy.fixture('loginData.json').then((data) => {
      cy.login(data.email, data.password);

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
      cy.get('[data-cy="first-name-input"]').type('fornavn');
      cy.get('[data-cy="last-name-input"]').clear();
      cy.get('[data-cy="last-name-input"]').type('efternavn');
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
