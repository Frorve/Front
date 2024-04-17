import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { AiFillCloseCircle } from "react-icons/ai";

const ProjectDetails = ({
  project,
  username,
  onClose,
  onEdit,
  onDelete,
  onDownload,
}) => {
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
          {username}
        </p>
      </div>
      <div className="detail-box">
        <p>
          <strong>Colaboradores: </strong>
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
            <a onClick={onDownload}>
            <strong>Archivo: </strong> Disponible
            {project.nombreArchivo}
            </a>
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
