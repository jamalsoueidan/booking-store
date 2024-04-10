describe('login', () => {
  beforeEach(() => {
    cy.intercept(
      'POST',
      '/account/login?_data=routes%2F%28%24locale%29.account_.login',
    ).as('loginRequest');

    cy.intercept('GET', '/account?_data=routes%2F%28%24locale%29.account').as(
      'login',
    );
  });

  it('passes', () => {
    cy.fixture('loginData.json').then((data) => {
      cy.visit('/');
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
    });
  });
});
