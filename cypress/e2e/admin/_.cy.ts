describe('register', () => {
  it('passes', () => {
    const timestamp = Date.now();
    const email = `testemail${timestamp}@example.com`;
    const password = 'testerne';

    cy.writeFile('cypress/fixtures/emailData.json', {email, password});

    cy.visit('/');
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-cy="login-button"] > .m_80f1301b > .m_811560b9').click();
    cy.get('[data-cy="register-link"]').click();
    cy.get('[data-cy="email-input"]').clear();
    cy.get('[data-cy="email-input"]').type(email);
    cy.get('[data-cy="password-input"]').clear();
    cy.get('[data-cy="password-input"]').type(password);
    cy.get('[data-cy="password-confirm-input"]').clear();
    cy.get('[data-cy="password-confirm-input"]').type('testerne');
    cy.get('.m_811560b9').click();
    cy.get('.m_6d731127 > .m_8bffd616').click();
    cy.get('.AccountTitle-module__title__llJ0j').should(
      'have.text',
      'Velkommen til din konto',
    );
    /* ==== End Cypress Studio ==== */
  });
});
