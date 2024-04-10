// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  if (
    err.message.includes('Minified React error') ||
    err.message.includes('Hydration failed because') ||
    err.message.includes('There was an error while hydrating')
  ) {
    return false;
  }
});

Cypress.Commands.add('test', () => {
  Cypress.log({message: 'hej me dig'});
});

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.intercept(
    'POST',
    '/account/login?_data=routes%2F%28%24locale%29.account_.login',
  ).as('loginRequest');
  cy.visit('/');
  cy.get('[data-cy="login-button"]').click();
  cy.url().should('include', '/account/login');
  cy.get('[data-cy="email-input"]').clear();
  cy.get('[data-cy="email-input"]').type(email);
  cy.get('[data-cy="password-input"]').should('be.enabled').clear();
  cy.get('[data-cy="password-input"]').type(password);
  cy.get('[data-cy="login-button"]').click();
  cy.wait('@loginRequest');
});
