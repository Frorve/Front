import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import axios from "axios";

const Columna3 = ({
  project,
  onDownload,
  onEdit,
  onDelete,
  renderProjectStatus,
  selectedClients,
}) => {
  const [projectTime, setProjectTime] = useState(`00:00:00`);

  const formatTime = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

    return (
      String(hours).padStart(2, "0") +
      ":" +
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0")
    );
  };

  useEffect(() => {
    const fetchProjectTime = async () => {
      try {
        if (!project.id) {
          return;
        }

        if (!project.time) {
          setProjectTime("00:00:00");
        }

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/repo/search/${project.id}`
        );
        const formattedTime = formatTime(response.data.time);
        setProjectTime(formattedTime);
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
        {selectedClients.length > 0 ? (
          <div className="caja2">
            {selectedClients.map((cliente, index) => (
              <p key={index}>
                <div className="w-10 rounded-full">
                  <img
                    alt="User Avatar"
                    src="data:image/png;base64,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"
                  />
                </div>
                <span>{cliente.nombre}</span>
              </p>
            ))}
          </div>
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
          <p>{project.nombreArchivo}</p>
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
