import React from 'react';

const ClientManager = ({
  searchQueryClients,
  handleSearchInputChangeClients,
  showSearchResultsClients,
  filteredClients,
  selectedClients,
  handleSelectClient,
  handleRemoveClient,
  handleSaveClients,
  errorMessage,
  successMessage,
}) => {
  return (
    <div className="client-manager">
      <h2><strong>Buscar Clientes</strong></h2>
      <label className="input input-bordered flex items-center gap-2">
        <input
          type="text"
          className="grow"
          placeholder="Buscar clientes..."
          value={searchQueryClients}
          onChange={handleSearchInputChangeClients}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>
      {showSearchResultsClients && (
        <ul className="search-results">
          {filteredClients.map((client) => (
            <li key={client.id} onClick={() => handleSelectClient(client)}>
              {client.nombre}
            </li>
          ))}
        </ul>
      )}
      <div className="selected-clients">
        <h3><strong>Clientes Seleccionados:</strong></h3>
        <ul className="client-list">
          {selectedClients.map((client) => (
            <li key={client.id}>
              {client.nombre}
              <button
                id="remove"
                className="btn btn-xs btn-error"
                onClick={() => handleRemoveClient(client)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
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
      <button className="btn" onClick={handleSaveClients}>
        Guardar Clientes
      </button>
    </div>
  );
};

export default ClientManager;
