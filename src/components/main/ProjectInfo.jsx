import React from 'react';

const ProjectInfo = ({ project, onEdit, onDelete, onDownload }) => {
  return (
    <div className="project-info">
      <div className="detail-nombre">
        <strong>Nombre: </strong>
        <p>{project.nombreProyecto}</p>
      </div>

      <div className="detail-descripcion">
        <strong>Descripción: </strong>
        <p>{project.descripcion}</p>
      </div>

      <div className="detail-inicio">
        <strong>Fecha de inicio: </strong>
        <div className="fecha-container">
          <p>{project.fechaInicio}</p>
        </div>
      </div>

      <div className="detail-inicio">
        <strong>Fecha de finalización: </strong>
        <div className="fecha-container">
          <p>{project.fechaFinalizacion}</p>
        </div>
      </div>

      <button id="edit" className="btn btn-wide" onClick={onEdit}>
        Editar <FaEdit />
      </button>

      <button id="Sup" className="btn btn-wide" onClick={onDelete}>
        Borrar <FaTrash />
      </button>

      {project.archivo && (
        <div className="detail-archivo">
          <strong>Archivo: </strong>
          <p>Disponible{project.nombreArchivo}</p>
          <button id="down" className="btn btn-wide" onClick={onDownload}>
            Descargar archivo <FiDownload />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectInfo;
