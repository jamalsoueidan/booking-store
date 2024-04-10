describe('register', () => {
  it('passes', () => {
    const timestamp = Date.now();
    const username = `testerne${timestamp}`;
    const email = `testerne${timestamp}@example.com`;
    const password = 'testerne';

    cy.writeFile('cypress/fixtures/loginData.json', {
      email,
      password,
      username,
      firstName: 'fornavn',
      lastName: 'efternavn',
    });

    cy.visit('/');
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-cy="login-button"]').click();
    cy.url({timeout: 15000}).should('include', '/account/login');
    cy.get('[data-cy="register-link"]').click();
    cy.url().should('include', '/account/register');
    cy.get('[data-cy="email-input"]').clear();
    cy.get('[data-cy="email-input"]').type(email);
    cy.get('[data-cy="password-input"]').clear();
    cy.get('[data-cy="password-input"]').type(password);
    cy.get('[data-cy="password-confirm-input"]').clear();
    cy.get('[data-cy="password-confirm-input"]').type('testerne');
    cy.get('[data-cy="register-button"]').click();
    cy.url().should('include', '/account/dashboard');
    cy.get('[data-cy="welcome-title"]').should(
      'have.text',
      'Velkommen til din konto',
    );
    /* ==== End Cypress Studio ==== */
  });
});
