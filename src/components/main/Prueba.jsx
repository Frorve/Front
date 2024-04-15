import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';
import { AiFillCloseCircle } from 'react-icons/ai';

function Prueba({ project, username, onClose, onEdit, onDelete, onDownload }) {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row">
        <img
          src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
          className="max-w-sm rounded-lg shadow-2xl"
          alt="Project Image"
        />
        <div className="flex flex-col justify-center ml-8">
          <h1 className="text-5xl font-bold">{project.nombreProyecto}</h1>
          <p className="py-6">{project.descripcion}</p>
          <p>
            <strong>Autor: </strong> {username}
          </p>
          <p>
            <strong>Colaboradores: </strong> {project.colaboradores}
          </p>
          <p>
            <strong>Fecha de inicio: </strong> {project.fechaInicio}
          </p>
          <p>
            <strong>Fecha de finalización: </strong> {project.fechaFinalizacion}
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
          <div className="flex">
            <button className="btn btn-wide" onClick={onEdit}>
              Editar <FaEdit />
            </button>
            <button className="btn btn-wide ml-4" onClick={onDelete}>
              Borrar <FaTrash />
            </button>
          </div>
          <button className="close-button mt-4" onClick={onClose}>
            <AiFillCloseCircle />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Prueba;
