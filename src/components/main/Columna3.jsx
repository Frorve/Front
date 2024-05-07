import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";

const Columna3 = ({ project, onDownload, onEdit, onDelete, renderProjectStatus }) => {

    //Contador para las pruebas de horas totales
    const horas = Math.floor(Math.random() * 2).toString().padStart(2, '0');
    const minutos = Math.floor(Math.random() * 50).toString().padStart(2, '0'); 
    const segundos = Math.floor(Math.random() * 50).toString().padStart(2, '0'); 

    const tiempoEmpleado = `${horas}:${minutos}:${segundos}`;

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
          Tiempo empleado en el proyecto: <strong>{tiempoEmpleado}</strong>
        </span>{" "}
        {}
      </div>

      {renderProjectStatus()}
    </div>
  );
};

export default Columna3;
