import React, { useState } from "react";

const EditProjectForm = ({ project, onSave, onCancel }) => {
  const [userCreatedMessage, setUserCreatedMessage] = useState("");
  const [editedProject, setEditedProject] = useState({
    nombreProyecto: project.nombreProyecto,
    descripcion: project.descripcion,
    fechaFinalizacion: project.fechaFinalizacion,
    archivo: project.archivo, 
    cliente: project.cliente,
  });

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (files) {
      setEditedProject({
        ...editedProject,
        [name]: files[0], 
      });
    } else {
      setEditedProject({
        ...editedProject,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(); 
      formData.append("nombreProyecto", editedProject.nombreProyecto);
      formData.append("descripcion", editedProject.descripcion);
      formData.append("fechaFinalizacion", editedProject.fechaFinalizacion);
      formData.append("archivo", editedProject.archivo); 
      formData.append("cliente", editedProject.cliente);

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/repo/${project.id}`,
        {
          method: "PUT",
          body: formData, 
        }
      );

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
    <div className="editar">
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
              <span>Cliente:</span>
              <input
                type="text"
                name="cliente"
                value={editedProject.cliente}
                onChange={handleChange}
                placeholder="Cliente del proyecto"
                maxLength={50}
              />
            </div>
          </div>
          <div className="input-box">
            <div className="info-box">
              <span>Fecha finalización:</span>
              <input
                type="date"
                name="fechaFinalizacion"
                value={editedProject.fechaFinalizacion}
                onChange={handleChange}
                placeholder="Fecha de finalización"
                required
              />
            </div>
          </div>
          <div className="input-box">
        <div className="info-box">
          <span>Archivos:</span>
          <input
            type="file"
            name="archivo"
            onChange={handleChange}
            placeholder="Archivos a subir"
          />
        </div>
      </div>
          {userCreatedMessage && (
            <div role="alert" className="alert alert-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{userCreatedMessage}</span>
            </div>
          )}
          <button className="save-button" type="submit">
            Guardar
          </button>
          <button className="cancel-button" type="button" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProjectForm;
