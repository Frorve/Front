import React from "react";

const Columna2 = ({ selectedCollaborators, project, username }) => {
  const isAuthor = project.autor === username;

  /*/Componente de los detalles del proyecto, el cual se refiere a la Columna central del componente, 
  donde se muestran todos los colaboradores del proyecto./*/
  
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
              </p>
            ))}
          </div>
        ) : (
          <p>No hay colaboradores asociados al proyecto.</p>
        )}
      </div>
      {isAuthor && (
        <div className="detail-colab">
          <button
            className="btn"
            onClick={() => document.getElementById("modal").showModal()}
          >
            Añadir/Eliminar colaboradores
          </button>
        </div>
      )}
    </div>
  );
};

export default Columna2;
