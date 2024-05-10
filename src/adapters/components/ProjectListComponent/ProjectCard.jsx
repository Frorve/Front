import React, { useState } from "react";
import EditProjectForm from "./EditProjectForm";
import { useParams } from "react-router-dom";
import ProjectDetails from "../ProjectDetailsComponent/ProjectDetails";

const ProjectCard = ({ project, expandedProjectId, onExpand, onDelete }) => {
  const isExpanded = project.id === expandedProjectId;
  const [isEditing, setIsEditing] = useState(false);
  const { username } = useParams();

  const handleEdit = () => {
    console.log("Editar proyecto:", project.id);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de borrar este proyecto?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/repo/${project.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        window.location.reload();
        onDelete(project.id);
        console.log("Proyecto borrado exitosamente:", project.id);
      }
    } catch (error) {
      console.error("Error al borrar el proyecto:", error);
    }
  };

  const downloadFile = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/repo/download/${project.id}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = project.nombreArchivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Error al descargar el archivo:", response.statusText);
      }
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
    }
  };

  const handleClose = (event) => {
    event.stopPropagation();
    onExpand(null);
  };

  const handleClick = () => {
    if (isExpanded) {
      return;
    } else {
      onExpand(project.id);
    }
  };

  return (
    <div
      className={`project-card ${isExpanded ? "expanded" : ""}`}
      onClick={handleClick}
    >
      {isEditing ? (
        <EditProjectForm
          project={project}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      ) : (
        <>
          <div className="project-info">
            <p>
              <strong>Nombre: </strong>
              {project.nombreProyecto}
            </p>
            <p>
              <strong>Descripción: </strong>
              {project.descripcion}
            </p>
          </div>
          {isExpanded && (
            <ProjectDetails
              project={project}
              username={username}
              onClose={handleClose}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDownload={downloadFile}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProjectCard;
