describe('Login Form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001/login');
  });

  it('should successfully login with correct credentials', () => {
    cy.get('input[type="text"]').type('Probando');
    cy.get('input[type="password"]').type('prueba');
    cy.contains('Iniciar Sesión').click();
    cy.url().should('include', '/main');
  });

  it('should display error message with incorrect credentials', () => {
    cy.get('input[type="text"]').type('usuario_incorrecto');
    cy.get('input[type="password"]').type('contraseña_incorrecta');
    cy.contains('Iniciar Sesión').click();
    cy.get('.alert').should('be.visible');
  });

  it('should redirect to registration page when "Regístrate" link is clicked', () => {
    cy.contains('Regístrate').click();
    cy.url().should('include', '/register');
  });

  it('should redirect to forgot password page when "¿Olvidaste la contraseña?" link is clicked', () => {
    cy.contains('¿Olvidaste la contraseña?').click();
    cy.url().should('include', '/register');
  });

  it('should save credentials in local storage when "Recuérdame" is checked', () => {
    cy.get('input[type="text"]').type('Probando');
    cy.get('input[type="password"]').type('prueba');
    cy.get('input[type="checkbox"]').check();
    cy.contains('Iniciar Sesión').click();
    cy.url().should('include', '/main');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('rememberedUsername')).to.eq('Probando');
      expect(win.localStorage.getItem('rememberedPassword')).to.eq('prueba');
    });
  });
});
