import React, { useState } from "react";

const EditProjectForm = ({ project, onSave, onCancel }) => {
  const [userCreatedMessage, setUserCreatedMessage] = useState("");
  const [editedProject, setEditedProject] = useState({
    nombreProyecto: project.nombreProyecto,
    descripcion: project.descripcion,
    fechaFinalizacion: project.fechaFinalizacion,
  });

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (files && files.length > 0) {
      setEditedProject({
        ...editedProject,
        archivo: files[0],
        archivoName: files[0].name,
      });
    } else {
      setEditedProject({
        ...editedProject,
        [name]: value,
      });
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:8055/files", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error al subir el archivo");
    }

    const data = await response.json();
    return data.data.id; // UUID del archivo subido
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let archivoUUID = project.archivo; // Usar el UUID existente si no hay un archivo nuevo
      if (editedProject.archivo) {
        archivoUUID = await uploadFile(editedProject.archivo);
      }

      const projectData = {
        nombreProyecto: editedProject.nombreProyecto,
        descripcion: editedProject.descripcion,
        fechaFinalizacion: editedProject.fechaFinalizacion,
        nombreArchivo: editedProject.archivoName,
        archivo: archivoUUID,
      };

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/items/repo/${project.id}`,
        {
          method: "PATCH", // Usar PATCH en lugar de PUT para actualizaciones parciales
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projectData),
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
          <h1>
            <strong>Editar Proyecto</strong>
          </h1>
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
              <div className="actually">
                {project.nombreArchivo && (
                  <p>Archivo actual: {project.nombreArchivo}</p>
                )}
              </div>
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
