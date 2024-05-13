import React, { useState } from "react";

const ClienteForm = ({ onSubmit, onCancel }) => {
  const [clientename, setClienteNombre] = useState("");
  const [clientecif, setClienteCif] = useState("");
  const [clientecorreo, setClienteCorreo] = useState("");
  const [clientetelefono, setClienteTelefono] = useState("");
  const [clienteweb, setClienteWeb] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [ProjectClienteMessage, setClienteCreatedMessage] = useState("");

  const handleClienteNameChange = (event) => {
    setClienteNombre(event.target.value);
  };

  const handleClienteCifChange = (event) => {
    setClienteCif(event.target.value);
  };

  const handleClienteCorreoChange = (event) => {
    setClienteCorreo(event.target.value);
  };

  const handleClienteTelefonoChange = (event) => {
    setClienteTelefono(event.target.value);
  };

  const handleClienteWebChange = (event) => {
    setClienteWeb(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const clienteData = {
      nombre: clientename,
      cif: clientecif,
      correoElectronico: clientecorreo,
      telefono: clientetelefono,
      web: clienteweb,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/cliente`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clienteData),
        }
      );

      if (response.ok) {
        console.log("Cliente creado exitosamente");
        setClienteCif("");
        setClienteNombre("");
        setClienteCorreo("");
        setClienteTelefono("");
        setClienteWeb("");
        onSubmit();
        setClienteCreatedMessage("¡Cliente creado!");
      } else {
        throw new Error("Error al crear cliente");
      }
    } catch (error) {
      console.error("Error al crear cliente:", error);
      setErrorMessage("Error al crear el cliente");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <h1>Nuevo cliente</h1>
      <div className="input-box">
        <div className="info-box">
          <span>Nombre:</span>
          <input
            type="nombreCliente"
            value={clientename}
            onChange={handleClienteNameChange}
            placeholder="Nombre del cliente"
            maxLength={30}
            required
          />
        </div>
      </div>
      <div className="input-box">
        <div className="info-box">
          <span>CIF:</span>
          <input
            type="cif"
            value={clientecif}
            onChange={handleClienteCifChange}
            placeholder="CIF del cliente"
            maxLength={9}
            required
          />
        </div>
      </div>
      <div className="input-box">
        <div className="info-box">
          <span>Correo electrónico:</span>
          <input
            type="correo"
            value={clientecorreo}
            onChange={handleClienteCorreoChange}
            placeholder="Correo del cliente"
            maxLength={30}
          />
        </div>
      </div>
      <div className="input-box">
        <div className="info-box">
          <span>Teléfono:</span>
          <input
            type="telefono"
            value={clientetelefono}
            onChange={handleClienteTelefonoChange}
            placeholder="Telefono del cliente"
            maxLength={9}
            required
          />
        </div>
      </div>
      <div className="input-box">
        <div className="info-box">
          <span>Sitio Web:</span>
          <input
            type="web"
            value={clienteweb}
            onChange={handleClienteWebChange}
            placeholder="Sitio Web del cliente"
            maxLength={50}
            required
          />
        </div>
      </div>
      {ProjectClienteMessage && (
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
          <span>{ProjectClienteMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div role="alert" className="alert alert-error">
          <span>{errorMessage}</span>
        </div>
      )}
      <button className="save-button-new" type="submit">
        Guardar
      </button>
      <button className="cancel-button-new" type="button" onClick={onCancel}>
        Cancelar
      </button>
    </form>
  );
};

export default ClienteForm;
