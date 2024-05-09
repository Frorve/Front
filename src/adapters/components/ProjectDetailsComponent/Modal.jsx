import React from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import Message from "./Message";

const Modal = ({
  id,
  title,
  searchQuery,
  handleSearchInputChange,
  showSearchResults,
  filteredData,
  handleSelectItem,
  selectedItems,
  handleRemoveItem,
  errorMessage,
  successMessage,
  handleSave,
}) => {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box w-full max-w-5xl">
        <button
          className="close-button"
          onClick={() => document.getElementById(id).close()}
        >
          <AiFillCloseCircle />
        </button>
        <h2>
          <strong>{title}</strong>
        </h2>
        <br />
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder={`Buscar ${title.toLowerCase()}...`}
            value={searchQuery}
            onChange={handleSearchInputChange}
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
        <br />
        {showSearchResults && (
          <ul className="search-results">
            {filteredData.map((item) => (
              <li key={item.id} onClick={() => handleSelectItem(item)}>
                {item.nombre}
              </li>
            ))}
          </ul>
        )}
        <br />
        <div className="selected-items">
          <h3>
            <strong>{`${title} Seleccionados:`}</strong>{" "}
          </h3>
          <br />
          <ul className="item-list">
            {selectedItems.map((item) => (
              <li key={item.id}>
                {item.nombre}
                <button
                  id="remove"
                  className="btn btn-xs btn-error"
                  onClick={() => handleRemoveItem(item)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
        <br />
        {errorMessage && <Message type="error" message={errorMessage} />}
        {successMessage && <Message type="success" message={successMessage} />}
        <br />
        <button className="btn" onClick={handleSave}>
          Guardar {title}
        </button>
      </div>
    </dialog>
  );
};

export default Modal;
