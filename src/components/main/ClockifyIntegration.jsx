import React from 'react';

const ClockifyIntegration = ({
  handleTaskChange,
  handleStartTimer,
  handleStopTimer,
  timerDuration,
  formatTime,
  errorMessage,
  successMessage,
}) => {
  return (
    <div className="clockify-integration">
      <h3 className="font-bold text-lg">¿En qué estás trabajando?</h3>
      <input
        type="text"
        placeholder="Escribe aquí"
        onChange={handleTaskChange}
        className="input input-bordered w-full max-w-xs"
        maxLength={50}
        required
      />
      <br />
      <button
        id="timer"
        className="btn btn-success"
        onClick={handleStartTimer}
      >
        Iniciar Timer
      </button>
      <br />
      <br />
      {errorMessage && (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div role="alert" className="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}
      <div id="time" role="alert" className="alert">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-info shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <strong>Tiempo transcurrido: </strong>
        <span>{formatTime(timerDuration)}</span>
      </div>
    </div>
  );
};

export default ClockifyIntegration;
