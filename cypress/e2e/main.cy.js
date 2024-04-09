describe('Main Form', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:3001/main/Probando');
  });

  it('should display project form when "Agregar Proyecto" button is clicked', () => {
    cy.viewport(1920, 1080);
    cy.contains('Agregar Proyecto').click();
    cy.get('form').should('be.visible');
  });

  it('should successfully create a project with valid data', () => {
    cy.viewport(1920, 1080);
    cy.contains('Agregar Proyecto').click();
    cy.get('input[type="nombreProyecto"]').type('Nuevo Proyecto');
    cy.get('input[type="descripcion"]').type('Descripción del proyecto');
    cy.contains('Guardar').click();
    cy.get('.success-message').should('be.visible');
  });

  // it('should display error message when creating a project with invalid data', () => {
  //   cy.viewport(1920, 1080);
  //   cy.contains('Agregar Proyecto').click();
  //   cy.get('button[type="submit"]').click();
  //   cy.contains('Error al crear el proyecto').should('be.visible');
  // });

  it('should exit project form when "Volver atrás" button is clicked', () => {
    cy.viewport(1920, 1080);
    cy.contains('Agregar Proyecto').click();
    cy.get('form').should('be.visible');
    cy.contains('Agregar Proyecto').click();
    cy.get('form').should('not.be.visible');
  });

  it('should expand a project container when clicked', () => {
    cy.viewport(1920, 1080);
    cy.get('ProjectCard').click();
    cy.get('.project-container').first().should('have.class', 'expanded');
  });

  it('should delete a project when delete button is clicked', () => {
    cy.viewport(1920, 1080);
    cy.get('.delete-button').first().click();
    cy.get('.project-container').should('have.length', 2);
  });

  it('should download a file when download button is clicked', () => {
    cy.viewport(1920, 1080);
    cy.get('.download-button').first().click();
    cy.get('.download-button').first().should('have.attr', 'href').and('include', 'http://localhost:3000/repo/download');
    cy.get('.download-button').first().should('have.attr', 'download');
  });

  it('should allow editing a project when edit button is clicked', () => {
    cy.viewport(1920, 1080);
    cy.get('.edit-button').first().click();
    cy.get('form').should('be.visible');

    // // Realiza cambios en el formulario de edición (simulando la edición del proyecto)

    // // Envía el formulario de edición
    // cy.get('button[type="submit"]').click();

    // // Verifica que se muestre un mensaje de éxito después de enviar el formulario de edición
    // cy.contains('Proyecto editado correctamente').should('be.visible');
  });

  it('should redirect to login page when "Cerrar sesión" button is clicked', () => {
    cy.viewport(1920, 1080);
    cy.contains('Cerrar sesión').click();
    cy.url().should('include', '/login');
  });
  

});