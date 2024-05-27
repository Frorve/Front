import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiFillCloseCircle } from "react-icons/ai";
import ClienteForm from "./ClienteForm";

const ClienteList = ({ onCancel }) => {
  const [clientes, setClientes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    cif: "",
    correoElectronico: "",
    telefono: "",
    web: "",
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    const modal = document.getElementById("cliente_modal");
    if (modal) {
      if (modalVisible) {
        modal.showModal();
      } else {
        modal.close();
      }
    }
  }, [modalVisible]);

  const fetchClientes = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_MICROSERVICIOS}/cliente`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setClientes(response.data.data);
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    }
  };

  const handleDeleteCliente = async (clienteId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_MICROSERVICIOS}/cliente/${clienteId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      fetchClientes();
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
      setErrorMessage("Error al eliminar el cliente");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    fetchClientes();
  };

  const handleViewMore = (cliente) => {
    setSelectedCliente(cliente);
    setIsEditing(false);
    setModalVisible(true);
  };

  const handleEditCliente = (cliente) => {
    setSelectedCliente(cliente);
    setIsEditing(true); 
    setFormData({
      nombre: cliente.nombre,
      cif: cliente.cif,
      correoElectronico: cliente.correoElectronico,
      telefono: cliente.telefono,
      web: cliente.web,
    });
    setModalVisible(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_MICROSERVICIOS}/cliente/${selectedCliente.id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setModalVisible(false);
      fetchClientes();
    } catch (error) {
      console.error("Error al actualizar el cliente:", error);
      setErrorMessage("Error al actualizar el cliente");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  return (
<div className="container mx-auto p-4">
  {!showForm && (
    <>
      <h1 className="text-2xl mb-4">Lista de Clientes</h1>
      <br />
      {errorMessage && (
        <div role="alert" className="alert alert-error mb-4">
          <span>{errorMessage}</span>
        </div>
      )}
      <ul className="space-y-4">
        {clientes.map((cliente) => (
          <li
            key={cliente.id}
            className="bg-[#f7cc70] shadow-md rounded-lg p-4 flex justify-between items-center"
          >
            <span className="text-lg font-medium">{cliente.nombre}</span>
            <div className="flex space-x-2">
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300"
                onClick={() => handleViewMore(cliente)}
              >
                Ver más
              </button>
              <button
                className="bg-[#6b4734] text-white px-4 py-2 rounded hover:bg-yellow-900 transition duration-300"
                onClick={() => handleEditCliente(cliente)}
              >
                Editar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                onClick={() => handleDeleteCliente(cliente.id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
      <br />
      <button className="add-project-button" onClick={() => setShowForm(true)}>
        Agregar Cliente
      </button>
      <button className="cancel-button-new" onClick={onCancel}>
        Volver atrás
      </button>
    </>
  )}

  {showForm && (
    <ClienteForm
      onSubmit={handleFormSubmit}
      onCancel={() => setShowForm(false)}
    />
  )}

  {selectedCliente && (
    <dialog id="cliente_modal" className="modal">
      <div className="modal-box w-11/12 max-w-5xl relative">
        <button
          className="absolute top-3 right-3 m-3 text-red-600 hover:text-red-800"
          onClick={() => setModalVisible(false)}
        >
          <AiFillCloseCircle size={24} />
        </button>
        {isEditing ? (
          <div>
            <h2 className="font-bold text-lg">Editar Cliente</h2>
            <br />
            <div className="py-3">
              <label className="block font-medium">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="py-3">
              <label className="block font-medium">CIF</label>
              <input
                type="text"
                name="cif"
                value={formData.cif}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="py-3">
              <label className="block font-medium">Correo Electrónico</label>
              <input
                type="email"
                name="correoElectronico"
                value={formData.correoElectronico}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="py-3">
              <label className="block font-medium">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="py-3">
              <label className="block font-medium">Sitio Web</label>
              <input
                type="text"
                name="web"
                value={formData.web}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="py-3">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                onClick={handleSave}
              >
                Guardar
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="font-bold text-lg">{selectedCliente.nombre}</h2>
            <br />
            <p className="py-3">
              <strong>CIF:</strong> {selectedCliente.cif}
            </p>
            <p className="py-3">
              <strong>Correo Electrónico:</strong>{" "}
              {selectedCliente.correoElectronico}
            </p>
            <p className="py-3">
            <strong>Teléfono:</strong> {selectedCliente.telefono}
            </p>
            <p className="py-3">
              <strong>Sitio Web:</strong>{" "}
              <a
                href={selectedCliente.web}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-600 hover:underline"
              >
                {selectedCliente.web}
              </a>
            </p>
          </div>
        )}
      </div>
    </dialog>
  )}
</div>


  );
};

export default ClienteList;

