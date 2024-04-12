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

import 'cypress-mailosaur';

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

Cypress.Commands.add('dataCy', (value: string) => {
  return cy.get(`[data-cy="${value}"]`);
});
