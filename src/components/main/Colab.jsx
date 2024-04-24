import React, { useState } from "react";

const Colab = ({ onSubmit, onCancel }) => {
  const [usernameColab, setUsernameColab] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [colabCreated, setColabCreated] = useState("");

  const handleUsernameChange = (event) => {
    setUsernameColab(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Lógica para añadir colaboradores aquí
      // Simulación de espera para demostrar el proceso
      setTimeout(() => {
        setColabCreated("Colaboradores añadidos con éxito!");
        setUsernameColab(""); // Limpiar el campo después de enviar
        onSubmit(); // Cerrar el modal
      }, 2000);
    } catch (error) {
      console.error("Error al añadir colaboradores:", error);
      setErrorMessage("Error al añadir colaboradores");
    }
  };

  return (
    <div className="modal-content">
      <h2>Añadir colaboradores</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {colabCreated && <div className="success-message">{colabCreated}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={usernameColab}
          onChange={handleUsernameChange}
          placeholder="Nombre de colaborador"
          required
        />
        <button type="submit">Guardar</button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default Colab;
