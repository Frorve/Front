describe('Register Form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001/register');
  });

  it('should successfully register with valid credentials', () => {
    cy.get('input[type="text"]').type('nuevo_usuario4');
    cy.get('input[type="email"]').type('nuevo_usuario@example.com4');
    cy.get('input[type="password"]').type('nueva_contraseña4');
    cy.contains('Crear Usuario').click();
    cy.get('.success-message').should('be.visible');
  });

  it('should display error message with existing username', () => {
    cy.fixture('users.json').then(users => {
      cy.get('input[type="text"]').type('Probando');
      cy.get('input[type="email"]').type('correo@example.com');
      cy.get('input[type="password"]').type('prueba');
      cy.contains('Crear Usuario').click();
      cy.get('.error-message').should('be.visible');
    });
  });

  it('should display error message with existing email', () => {
    cy.fixture('users.json').then(users => {
      cy.get('input[type="text"]').type('ProbaSundo');
      cy.get('input[type="email"]').type('prueba@correo.es');
      cy.get('input[type="password"]').type('contraseña');
      cy.contains('Crear Usuario').click();
      cy.get('.error-message').should('be.visible');
    });
  });

  it('should redirect to login page when "Iniciar Sesión" link is clicked', () => {
    cy.contains('Iniciar Sesión').click();
    cy.url().should('include', '/login');
  });

});
