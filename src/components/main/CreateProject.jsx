import React, { useState } from 'react';

const CreateProject = () => {
  const [showForm, setShowForm] = useState(true); // Estado para controlar la visibilidad del formulario

  // Función para manejar el clic en el botón "Cerrar"
  const handleCloseClick = () => {
    setShowForm(false); // Establecer el estado showForm en false para cerrar el panel
  };

  return (
    <div>
      {showForm && (
        <form className="mt-6 p-4 bg-white shadow-md rounded-md">
          <div className="mb-4">
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
              Nombre del proyecto
            </label>
            <input type="text" id="projectName" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea id="description" rows="3" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700">
              Fecha de inicio
            </label>
            <input type='date' id="fechaInicio" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
          </div>
          <div className="mb-4">
            <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700">
              Fecha de finalización
            </label>
            <input type='date' id="fechaFin" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
          </div>
          <div className="mt-4 flex justify-between">
          <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Guardar
            </button>
            <button type="button" onClick={handleCloseClick} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Cerrar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateProject;
