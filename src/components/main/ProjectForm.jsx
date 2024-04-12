import React, { useState } from "react";

const ProjectForm = ({ onSubmit, onCancel }) => {
  const [projectname, setNombreProyecto] = useState("");
  const [description, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinalizacion, setFechaFinalizacion] = useState("");
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleProjectoChange = (event) => {
    setNombreProyecto(event.target.value);
  };

  const handleDescripcionChange = (event) => {
    setDescripcion(event.target.value);
  };

  const handleFechaInicioChange = (event) => {
    setFechaInicio(event.target.value);
  };

  const handleFechaFinalizacionChange = (event) => {
    setFechaFinalizacion(event.target.value);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("nombreProyecto", projectname);
    formData.append("descripcion", description);
    formData.append("fechaInicio", fechaInicio);
    formData.append("fechaFinalizacion", fechaFinalizacion);
    formData.append("archivo", file);

    try {
      const response = await fetch("http://localhost:3000/repo", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Proyecto creado exitosamente");
        setNombreProyecto("");
        setDescripcion("");
        setFechaInicio("");
        setFechaFinalizacion("");
        setFile(null);
        onSubmit();
      } else {
        throw new Error("Error al crear proyecto");
      }
    } catch (error) {
      console.error("Error al crear proyecto:", error);
      setErrorMessage("Error al crear el proyecto");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <h1>Nuevo proyecto</h1>
      <div className="input-box">
        <div className="info-box">
          <span>Nombre:</span>
          <input
            type="text"
            value={projectname}
            onChange={handleProjectoChange}
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
            value={description}
            onChange={handleDescripcionChange}
            placeholder="Descripción del proyecto"
            maxLength={50}
            required
          />
        </div>
      </div>
      <div className="input-box">
        <div className="info-box">
          <span>Fecha inicio:</span>
          <input
            type="date"
            value={fechaInicio}
            onChange={handleFechaInicioChange}
            placeholder="Fecha de inicio"
            required
          />
        </div>
      </div>
      <div className="input-box">
        <div className="info-box">
          <span>Fecha finalización:</span>
          <input
            type="date"
            value={fechaFinalizacion}
            onChange={handleFechaFinalizacionChange}
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
            onChange={handleFileChange}
            placeholder="Archivos a subir"
            maxLength={50}
          />
        </div>
      </div>
      {errorMessage && (
        <div role="alert" className="alert alert-error">
          <span>{errorMessage}</span>
        </div>
      )}
      <button className="save-button" type="submit">
        Guardar
      </button>
      <button className="cancel-button" type="button" onClick={onCancel}>
        Cancelar
      </button>
    </form>
  );
};

export default ProjectForm;
