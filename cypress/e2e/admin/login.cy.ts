describe('login', () => {
  it('passes', () => {
    cy.fixture('emailData.json').then((data) => {
      cy.login(data.email, data.password);
      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-cy="welcome-title"]').should(
        'have.text',
        'Velkommen til din konto',
      );
      /* ==== End Cypress Studio ==== */
    });
  });
});
