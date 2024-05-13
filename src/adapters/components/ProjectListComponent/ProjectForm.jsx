import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProjectForm = ({ onSubmit, onCancel }) => {
  const { username } = useParams();
  const [projectname, setNombreProyecto] = useState("");
  const [description, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinalizacion, setFechaFinalizacion] = useState("");
  const [file, setFile] = useState(null);
  const [archivoName, setArchivoName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [ProjectCreatedMessage, setProjectCreatedMessage] = useState("");

  const handleProjectoChange = (event) => {
    setNombreProyecto(event.target.value);
  };

  const handleDescripcionChange = (event) => {
    setDescripcion(event.target.value);
  };

  const handleFechaInicioChange = (event) => {
    const nuevaFechaInicio = event.target.value;
    setFechaInicio(nuevaFechaInicio);

    if (fechaFinalizacion && fechaFinalizacion < nuevaFechaInicio) {
      setFechaFinalizacion(nuevaFechaInicio);
    }
  };

  const handleFechaFinalizacionChange = (event) => {
    const nuevaFechaFinalizacion = event.target.value;

    if (nuevaFechaFinalizacion >= fechaInicio) {
      setFechaFinalizacion(nuevaFechaFinalizacion);
    } else {
      alert(
        "La fecha de finalización no puede ser anterior a la fecha de inicio."
      );
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFile(selectedFile);
    setArchivoName(selectedFile.name);
  };

  const obtenerFechaActual = () => {
    const fechaActual = new Date();
    const year = fechaActual.getFullYear();
    const month = String(fechaActual.getMonth() + 1).padStart(2, "0");
    const day = String(fechaActual.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fechaActual = obtenerFechaActual();
    setFechaInicio(fechaActual);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("nombreProyecto", projectname);
    formData.append("descripcion", description);
    formData.append("fechaInicio", fechaInicio);
    formData.append("fechaFinalizacion", fechaFinalizacion);
    formData.append("autor", username);
    formData.append("nombreArchivo", archivoName);
    formData.append("archivo", file);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/repo/${username}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        console.log("Proyecto creado exitosamente");
        setNombreProyecto("");
        setDescripcion("");
        setFechaInicio("");
        setFechaFinalizacion("");
        setFile(null);
        onSubmit();
        setProjectCreatedMessage("¡Proyecto creado!");
        window.location.reload();
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
            type="nombreProyecto"
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
            type="descripcion"
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
            id="inicio"
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
            id="fin"
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
      {ProjectCreatedMessage && (
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
          <span>{ProjectCreatedMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div role="alert" className="alert alert-error">
          <span>{errorMessage}</span>
        </div>
      )}
      <button className="save-button-new" type="submit">
        Guardar
      </button>
      <button className="cancel-button-new" type="button" onClick={onCancel}>
        Cancelar
      </button>
    </form>
  );
};

export default ProjectForm;
