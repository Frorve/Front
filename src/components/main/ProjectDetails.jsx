import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { AiFillCloseCircle } from "react-icons/ai";

const ProjectDetails = ({ project, username, onClose, onEdit, onDelete, onDownload }) => {
  return (
    <div className="project-details">
      <button className="close-button" onClick={onClose}>
        <AiFillCloseCircle />
      </button>
      <p>
        <strong>Nombre: </strong>
        {project.nombreProyecto}
      </p>
      <p>
        <strong>Descripción: </strong>
        {project.descripcion}
      </p>
      <p>
        <strong>Autor: </strong>
        {username}
      </p>
      <p>
        <strong>Colaboradores: </strong>
        {project.colaboradores}
      </p>
      <p>
        <strong>Fecha de inicio: </strong>
        {project.fechaInicio}
      </p>
      <p>
        <strong>Fecha de finalización: </strong>
        {project.fechaFinalizacion}
      </p>

      {project.archivo && (
        <div>
          <p>
            <strong>Archivo: </strong>
          </p>
          <button className="btn btn-wide" onClick={onDownload}>
            Descargar archivo <FiDownload />
          </button>
        </div>
      )}

      <div className="project-actions">
        <button className="btn btn-wide" onClick={onEdit}>
          Editar <FaEdit />
        </button>
        <button id="Sup" className="btn btn-wide" onClick={onDelete}>
          Borrar <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default ProjectDetails;