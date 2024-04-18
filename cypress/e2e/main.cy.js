describe('Main Form', () => {

  beforeEach(() => {
    // cy.viewport(1920, 1080);
    cy.visit('http://localhost:3001/main/Probando');
  });

  it('should display project form when "Agregar Proyecto" button is clicked', () => {
    // cy.viewport(1920, 1080);
    cy.contains('Agregar Proyecto').click();
    cy.get('form').should('be.visible');
  });

  it('should successfully create a project with valid data', () => {
    // cy.viewport(1920, 1080);
    cy.contains('Agregar Proyecto').click();
    cy.get('input[type="nombreProyecto"]').type('Nuevo Proyecto');
    cy.get('input[type="descripcion"]').type('Descripción del proyecto');
    cy.get('input[id="inicio"]').type('2024-04-16');
    cy.get('input[id="fin"]').type('2024-08-18');
    cy.contains('Guardar').click();
  });

  it('should exit project form when "Cancelar" button is clicked', () => {
    // cy.viewport(1920, 1080);
    cy.contains('Agregar Proyecto').click();
    cy.get('.formulario').should('be.visible');
    cy.contains('Cancelar', { timeout: 10000}).click();
  });

  it('should download a file when download button is clicked', () => {
    // cy.viewport(1920, 1080);
    cy.get('body').click(250, 400);
    cy.get('body').click(250, 400);
    cy.wait(2000);
    cy.contains('Descargar archivo').click();
  });

  it('should delete a project when delete button is clicked', () => {
    // cy.viewport(1920, 1080);
    cy.get('body').click(250, 400);
    cy.wait(2000);
    cy.get('body').click(250, 400);
    cy.wait(2000);
    cy.contains('Borrar').click();
  });

  it('should allow editing a project when edit button is clicked', () => {
    // cy.viewport(1920, 1080);
    cy.get('body').click(250, 400);
    cy.wait(2000);
    cy.get('body').click(250, 400);
    cy.wait(2000);
    cy.contains('Editar').click();
    cy.get('input[name="nombreProyecto"]').type(' Editado');
    cy.get('input[name="descripcion"]').type(' Editada');
    cy.get('input[name="fechaFinalizacion"]').type('2024-08-18');
    cy.contains('Guardar').click();
  });

  it('should redirect to login page when "Cerrar sesión" button is clicked', () => {
    // cy.viewport(1920, 1080);
    cy.contains('Cerrar sesión').click();
    cy.url().should('include', '/login');
  });
  
});