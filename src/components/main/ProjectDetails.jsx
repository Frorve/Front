import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { AiFillCloseCircle } from "react-icons/ai";
import "./styles/Details.css";

const ProjectDetails = ({ project, onClose, onEdit, onDelete, onDownload }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCollaborators, setSelectedCollaborators] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const collaboratorNames = selectedCollaborators.map((collaborator) => collaborator.nombre);


  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/staff`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        } else {
          console.error("Error fetching staff:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchStaff();
  }, []);

  useEffect(() => {
    const storedCollaborators = localStorage.getItem("selectedCollaborators");
    if (storedCollaborators) {
      setSelectedCollaborators(JSON.parse(storedCollaborators));
    }
  }, []);

  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.trim() !== "") {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleSelectCollaborator = (staff) => {
    if (!selectedCollaborators.some((collaborator) => collaborator.id === staff.id)) {
      const updatedCollaborators = [...selectedCollaborators, staff];
      setSelectedCollaborators(updatedCollaborators);
      localStorage.setItem("selectedCollaborators", JSON.stringify(updatedCollaborators));
    }
  };

  const handleRemoveCollaborator = async (staff) => {
    const updatedCollaborators = selectedCollaborators.filter((item) => item.id !== staff.id);
    setSelectedCollaborators(updatedCollaborators);
    localStorage.setItem("selectedCollaborators", JSON.stringify(updatedCollaborators));
  
    console.log("Colaborador a eliminar:", staff);
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/repo/${staff.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log("Colaborador eliminado correctamente de la base de datos");
      } else {
        console.error("Error al eliminar colaborador de la base de datos:", response.statusText);
      }
    } catch (error) {
      console.error("Error al eliminar colaborador de la base de datos:", error);
    }
  };

  const handleSaveCollaborators = async () => {
    try {
      const collaboratorNamesString = collaboratorNames.join(', ');
  
      const formData = new FormData();
      formData.append("colaboradores", collaboratorNamesString);
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/repo/${project.id}`, {
        method: "PUT",
        body: formData,
      });
  
      if (response.ok) {
        console.log("Colaboradores guardados correctamente");
      } else {
        console.error("Error al guardar colaboradores:", response.statusText);
      }
    } catch (error) {
      console.error("Error al guardar colaboradores:", error);
    }
  };
  
  const filteredStaff = searchResults.filter((staff) =>
    !selectedCollaborators.some((selected) => selected.id === staff.id) &&
    staff.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="project-details">
      <button className="close-button" onClick={onClose}>
        <AiFillCloseCircle />
      </button>

      <div className="detail-box">
        <p>
          <strong>Nombre: </strong>
          {project.nombreProyecto}
        </p>
      </div>
      <div className="detail-box">
        <p>
          <strong>Descripción: </strong>
          {project.descripcion}
        </p>
      </div>
      <div className="detail-box">
        <p>
          <strong>Autor: </strong>
          {project.autor}
        </p>
      </div>
      <div className="detail-box">
        <p>
          <strong>Colaboradores: </strong>
          {selectedCollaborators.map((staff) => staff.nombre).join(", ")}
          {project.colaboradores}
        </p>
      </div>
      <div className="detail-box">
        <p>
          <strong>Fecha de inicio: </strong>
          {project.fechaInicio}
        </p>
      </div>
      <div className="detail-box">
        <p>
          <strong>Fecha de finalización: </strong>
          {project.fechaFinalizacion}
        </p>
      </div>

      {project.archivo && (
        <div className="detail-box">
          <p>
            <strong>Archivo: </strong> Disponible {project.nombreArchivo}
          </p>
          <button id="down" className="btn btn-wide" onClick={onDownload}>
            Descargar archivo <FiDownload />
          </button>
        </div>
      )}

      <div className="project-actions">
        <button id="edit" className="btn btn-wide" onClick={onEdit}>
          Editar <FaEdit />
        </button>
        <button id="Sup" className="btn btn-wide" onClick={onDelete}>
          Borrar <FaTrash />
        </button>
        <button
          className="btn"
          onClick={() => document.getElementById("modal").showModal()}
        >
          Añadir/Eliminar colaboradores
        </button>
      </div>

      <dialog id="modal" className="modal">
        <div className="modal-box w-full max-w-5xl">
          <button className="close-button" onClick={() => document.getElementById("modal").close()}>
            <AiFillCloseCircle />
          </button>
          <h2><strong>Añadir colaboradores</strong></h2>
          <br />
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow"
              placeholder="Buscar colaboradores..."
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          <br />
          {showSearchResults && (
            <ul className="search-results">
              {filteredStaff.map((staff) => (
                <li key={staff.id} onClick={() => handleSelectCollaborator(staff)}>
                  {staff.nombre}
                </li>
              ))}
            </ul>
          )}
          <br />
          <div className="selected-collaborators">
            <h3><strong>Colaboradores Seleccionados:</strong> </h3>
            <ul id="lista">
              {selectedCollaborators.map((staff) => (
                <li id="lista" key={staff.id}>
                  {staff.nombre}
                  <button id="remove" className="btn btn-xs btn-error" onClick={() => handleRemoveCollaborator(staff)}>Eliminar</button>
                </li>
              ))}
            </ul>
          </div>
          <br />
          <button className="btn" onClick={handleSaveCollaborators}>
            Guardar Colaboradores
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default ProjectDetails;
