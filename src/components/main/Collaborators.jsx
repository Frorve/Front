import React from 'react';

const Collaborators = ({ selectedCollaborators, handleRemoveCollaborator }) => {
  return (
    <div className="collaborators">
      <h3><strong>Colaboradores:</strong></h3>
      <div className="collaborator-list">
        {selectedCollaborators.map((staff, index) => (
          <div key={index}>
            <div className="w-10 rounded-full">
              <img
                alt="User Avatar"
                src="https://cdn-icons-png.freepik.com/512/64/64572.png"
              />
            </div>
            <p>{staff.nombre}</p>
            <button
              id="remove"
              className="btn btn-xs btn-error"
              onClick={() => handleRemoveCollaborator(staff)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collaborators;
