import React from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import Message from "./Message";

const Columna1 = ({
  project,
  handleTaskChange,
  handleStartTimer,
  handleStopTimer,
  timerDuration,
  formatTime,
  errorMessage,
  successMessage,
}) => {
  return (
    <div className="columa1">
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

      <button
        id="clock"
        className="btn btn-info"
        onClick={() => document.getElementById("my_modal_3").showModal()}
      >
        Clockify
      </button>
      <dialog id="my_modal_3" className="modal">
        <div id="select-work" className="modal-box">
          <form method="dialog">
            <button
              className="close-button"
              onClick={() => document.getElementById("modal-client").close()}
            >
              <AiFillCloseCircle />
            </button>
          </form>
          <h3 className="font-bold text-lg">¿En que estás trabajando?</h3>
          <input
            type="text"
            placeholder="Escribe aquí"
            onChange={handleTaskChange}
            className="input input-bordered w-full max-w-xs"
            maxLength={50}
            required
          />
          <br />
          <br />
          {errorMessage && <Message type="error" message={errorMessage} />}
          {successMessage && (
            <Message type="success" message={successMessage} />
          )}
          <button
            id="timer"
            className="btn btn-success"
            onClick={handleStartTimer}
          >
            Iniciar Timer
          </button>
        </div>
      </dialog>

      <button id="stop" className="btn btn-error" onClick={handleStopTimer}>
        Detener Timer
      </button>

      <div id="time" role="alert" className="alert">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-clock"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 7 12 12 15 15" />
        </svg>

        <strong>Tiempo transcurrido: </strong>
        <span>{formatTime(timerDuration)}</span>
      </div>
    </div>
  );
};

export default Columna1;
