describe('business', () => {
  it('passes', () => {
    cy.fixture('emailData.json').then((data) => {
      cy.log(data);
      cy.visit('/');
      cy.test();
    });
  });
});
