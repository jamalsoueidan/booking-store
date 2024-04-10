declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<Element>;
    test(): Chainable<Element>;
    dataCy(value: string): Chainable<JQuery<HTMLElement>>;
  }
}
