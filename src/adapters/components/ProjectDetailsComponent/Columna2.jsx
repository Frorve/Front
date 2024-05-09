import React from "react";

const Columna2 = ({ selectedCollaborators }) => {
  return (
    <div className="columna2">
      <div className="detail-colaborador">
        <strong>Colaboradores: </strong>
        {selectedCollaborators.length > 0 ? (
          <div className="caja">
            {selectedCollaborators.map((staff, index) => (
              <p key={index}>
                <div className="w-10 rounded-full">
                  <img
                    alt="User Avatar"
                    src="https://cdn-icons-png.freepik.com/512/64/64572.png"
                  />
                </div>
                <span>{staff.nombre}</span>
                {/* <button id="remove-colab" className="btn btn-sm btn-circle btn-error">✕</button> */}
              </p>
            ))}
          </div>
        ) : (
          <p>No hay colaboradores asociados al proyecto.</p>
        )}
      </div>
      <div className="detail-colab">
        <button
          className="btn btn-neutral"
          onClick={() => document.getElementById("modal").showModal()}
        >
          Añadir/Eliminar colaboradores
        </button>
      </div>
    </div>
  );
};

export default Columna2;
