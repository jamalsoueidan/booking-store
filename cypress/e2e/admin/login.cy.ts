describe('login', () => {
  beforeEach(() => {
    // Intercept the POST request to login
    cy.intercept(
      'POST',
      '/account/login?_data=routes%2F%28%24locale%29.account_.login',
    ).as('loginRequest');
  });

  it('passes', () => {
    cy.fixture('emailData.json').then((data) => {
      cy.login(data.email, data.password);
      cy.wait('@loginRequest').then((interception) => {
        if (interception.response) {
          expect(interception.response?.statusCode).to.eq(204);
        } else {
          throw new Error('Request did not receive a response.');
        }
      });

      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-cy="welcome-title"]').should(
        'have.text',
        'Velkommen til din konto',
      );
      /* ==== End Cypress Studio ==== */
    });
  });
});
