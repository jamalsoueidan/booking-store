describe('locations - create, edit, and delete', () => {
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

    cy.intercept(
      'POST',
      '/account/locations/create?_data=routes%2F%28%24locale%29.account.locations.create',
    ).as('postLocation');

    cy.intercept(
      'GET',
      '**/edit?_data=routes%2F%28%24locale%29.account.locations.%24locationId.edit',
    ).as('getLocation');

    cy.intercept(
      'PUT',
      '**/edit?_data=routes%2F%28%24locale%29.account.locations.%24locationId.edit',
    ).as('putLocation');

    cy.intercept(
      'DELETE',
      '**/destroy?_data=routes%2F%28%24locale%29.account.locations.%24locationId.destroy',
    ).as('deleteLocation');
  });

  it('passes', () => {
    const NAME = 'Hjem';
    cy.fixture('loginData.json').then((data) => {
      //login
      cy.visit('/account/login');
      cy.wait(3000);
      cy.url().should('include', '/account/login');
      cy.dataCy('email-input').clear();
      cy.dataCy('email-input').type(data.email);
      cy.dataCy('password-input').should('be.enabled').clear();
      cy.dataCy('password-input').type(data.password);
      cy.dataCy('login-button').click();
      cy.wait('@loginRequest');
      cy.dataCy('welcome-title').should('have.text', 'Velkommen til din konto');

      // go to create
      cy.dataCy('create-location-button').click();
      cy.url().should('include', '/create');

      // create location
      cy.dataCy('name-input').type(NAME);
      cy.dataCy('address-input').type('Sigridsvej 45, Brabrand', {delay: 100});
      cy.wait('@autocomplete');
      cy.get('div[data-combobox-option="true"]')
        .filter(':visible')
        .first()
        .click();

      cy.dataCy('origin-type-input').click();
      cy.get('div[data-combobox-option="true"][value="home"]').click();

      cy.dataCy('submit-button').click();
      cy.wait('@postLocation');

      // locations
      cy.url().should('include', '/account/locations');
      cy.get('[data-cy^="location-item"]')
        .contains('[data-cy="name-title"]', NAME)
        .closest('[data-cy^="location-item"]')
        .click();
      cy.wait('@getLocation');
      cy.url().should('include', '/edit');

      // edit location
      cy.dataCy('name-input').clear();
      cy.dataCy('name-input').type(NAME + ' edited');
      cy.dataCy('submit-button').click();
      cy.wait('@putLocation');
      cy.dataCy('back-link').click();

      cy.get('[data-cy^="location-item"]')
        .contains('[data-cy="name-title"]', NAME + ' edited')
        .closest('[data-cy^="location-item"]')
        .click();

      cy.get('[data-cy^="delete-button"]').click();
      cy.wait('@deleteLocation');
      cy.url().should('include', '/account/locations');
      cy.dataCy('empty-title').should('exist');
    });
  });
});
