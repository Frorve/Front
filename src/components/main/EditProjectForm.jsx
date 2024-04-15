import React, { useState } from "react";

const EditProjectForm = ({ project, onSave, onCancel }) => {
  const [userCreatedMessage, setUserCreatedMessage] = useState("");

  const [editedProject, setEditedProject] = useState({
    nombreProyecto: project.nombreProyecto,
    descripcion: project.descripcion,
    colaboradores: project.colaboradores,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedProject({
      ...editedProject,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/repo/${project.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedProject),
      });

      if (response.ok) {
        onSave(editedProject);
        setUserCreatedMessage("Proyecto editado correctamente");
        window.location.reload();
      } else {
        console.error("Error al actualizar el proyecto:", response.statusText);
      }
    } catch (error) {
      console.error("Error al actualizar el proyecto:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="edit">
        <h1>Editar Proyecto</h1>
        <div className="input-box">
          <div className="info-box">
            <span>Nombre:</span>
            <input
              type="text"
              name="nombreProyecto"
              value={editedProject.nombreProyecto}
              onChange={handleChange}
              placeholder="Nombre del proyecto"
              maxLength={30}
              required
            />
          </div>
        </div>
        <div className="input-box">
          <div className="info-box">
            <span>Descripción:</span>
            <input
              type="text"
              name="descripcion"
              value={editedProject.descripcion}
              onChange={handleChange}
              placeholder="Descripción del proyecto"
              maxLength={50}
              required
            />
          </div>
        </div>
        <div className="input-box">
          <div className="info-box">
            <span>Colaboradores:</span>
            <input
              type="text"
              name="colaboradores"
              value={editedProject.colaboradores}
              onChange={handleChange}
              placeholder="Colaboradores del proyecto"
              maxLength={30}
            />
          </div>
        </div>
        {userCreatedMessage && (
          <div role="alert" className="alert alert-success">
  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  <span>{userCreatedMessage}</span>
</div>
        )}
        <button className="save-button" type="button" onClick={handleSubmit}>
          Guardar
        </button>
        <button className="cancel-button" type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditProjectForm;
