import React from 'react'
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { AiFillCloseCircle } from "react-icons/ai";

function ProjectDetails2(
    project,
    username,
    onClose,
    onEdit,
    onDelete,
    onDownload,
) {
  return (
    <div>
      <div className="hero min-h-screen bg-base-200">
  <div className="hero-content text-center">
    <div className="max-w-md">
      <h1 className="text-5xl font-bold">{project.nombreProyecto}</h1>
      <p className="py-6">{project.descripcion}</p>
      <p className="py-6">{username}</p>
      <p className="py-6">{project.colaboradores}</p>
      <p className="py-6">{project.fechaInicio}</p>
      <p className="py-6">{project.fechaFinalizacion}</p>
      {project.archivo && (
        <div className="detail-box">
          <p>
            <strong>Archivo: </strong>
            {project.nombreArchivo}
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
      <button className="btn btn-primary">Get Started</button>
    </div>
  </div>
</div>
    </div>
  )
}

export default ProjectDetails2
