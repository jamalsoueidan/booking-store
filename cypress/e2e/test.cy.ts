describe('email test', () => {
  it('passes', () => {
    const serverId = 'pyen5ufb';
    const testEmail = 'current-pass@pyen5ufb.mailosaur.net';

    cy.visit('http://deciding-seasnail-seriously.ngrok-free.app');
    cy.wait(3000);
    cy.get('[data-cy="login-button"]').click();
    cy.mailosaurGetMessage(serverId, {
      sentTo: testEmail,
    }).then((email) => {
      cy.log(email.subject || '');
      if (email.html && email.html?.codes && email.html?.codes.length > 0) {
        cy.log(email.html!.codes[0].value || '');
      }
    });
  });
});
