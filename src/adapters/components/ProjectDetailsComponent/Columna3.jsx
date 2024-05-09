import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import axios from "axios";

const Columna3 = ({ project, onDownload, onEdit, onDelete, renderProjectStatus }) => {
  const [projectTime, setProjectTime] = useState(0);

  useEffect(() => {
    const fetchProjectTime = async () => {
      try {

        if (!project.id) {
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/repo/search/${project.id}`);
        setProjectTime(response.data.time);
        console.log("Tiempo del proyecto:", response.data.time);
        console.log(project.id);
      } catch (error) {
        console.error("Error al obtener el tiempo del proyecto:", error);
      }
    };

    fetchProjectTime();
  }, [project.id]);

  return (
    <div className="columna3">
      <div className="detail-autor">
        <strong>Cliente: </strong>
        {project.cliente ? (
          <p>{project.cliente}</p>
        ) : (
          <p>No hay cliente asociado</p>
        )}
        <button
          className="btn"
          id="modal-cliente"
          onClick={() => document.getElementById("modal-client").showModal()}
        >
          Asignar Cliente
        </button>
      </div>

      <div className="detail-autor">
        <strong>Propietario: </strong>
        <p>{project.autor}</p>
      </div>

      {project.archivo && (
        <div className="detail-archivo">
          <strong>Archivo: </strong>
          <p>Disponible{project.nombreArchivo}</p>
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
      </div>

      <div id="tiempo-empleado" role="alert" className="alert alert-info">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>
          Tiempo empleado en el proyecto: <strong>{projectTime}</strong>
        </span>{" "}
        {}
      </div>

      {renderProjectStatus()}
    </div>
  );
};

export default Columna3;
