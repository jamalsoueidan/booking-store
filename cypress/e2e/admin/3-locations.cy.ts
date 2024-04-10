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

    cy.intercept('GET', '/api/autocomplete*q=*').as('autocomplete');
  });

  it('passes', () => {
    cy.fixture('loginData.json').then((data) => {
      //login
      cy.visit('/account/login');
      cy.url().should('include', '/account/login');
      cy.dataCy('email-input').clear();
      cy.dataCy('email-input').type(data.email);
      cy.dataCy('password-input').should('be.enabled').clear();
      cy.dataCy('password-input').type(data.password);
      cy.dataCy('login-button').click();
      cy.wait('@loginRequest');

      cy.dataCy('welcome-title').should('have.text', 'Velkommen til din konto');

      cy.dataCy('create-location-button').click();
      cy.url().should('include', '/account/locations/create');
      cy.dataCy('name-input').type('Hjem');
      cy.dataCy('address-input').type('Sigridsvej 45, Brabrand', {delay: 100});
      cy.wait('@autocomplete');
      cy.get('div[data-combobox-option="true"]')
        .filter(':visible')
        .first()
        .click();

      cy.dataCy('origin-type-input').click();
      cy.get('div[data-combobox-option="true"][value="home"]').click();

      cy.dataCy('submit-button').click();
    });
  });
});
