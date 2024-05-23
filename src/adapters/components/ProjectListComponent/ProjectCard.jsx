import React, { useState } from "react";
import EditProjectForm from "./EditProjectForm";
import { useParams } from "react-router-dom";
import ProjectDetails from "../ProjectDetailsComponent/ProjectDetails";

const ProjectCard = ({ project, expandedProjectId, onExpand, onDelete }) => {
  const isExpanded = project.id === expandedProjectId;
  const [isEditing, setIsEditing] = useState(false);
  const { username } = useParams();

  const handleEdit = () => {
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
        `${process.env.REACT_APP_BACKEND_MICROSERVICIOS}/repo/${project.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
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

  const getProjectFileUUID = async (projectId) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_DIRECTUS}/items/repo/${projectId}?fields=archivo`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.data.archivo;
      } else {
        console.error(
          "Error al obtener el UUID del archivo:",
          response.statusText
        );
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el UUID del archivo:", error);
      return null;
    }
  };

  const downloadFile = async () => {
    try {
      const archivoUUID = await getProjectFileUUID(project.id);

      if (!archivoUUID) {
        console.error("No se pudo obtener el UUID del archivo.");
        return;
      }

      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_DIRECTUS}/files/${archivoUUID}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        const downloadUrl = `${process.env.REACT_APP_BACKEND_DIRECTUS}/assets/${data.data.filename_disk}`;

        const downloadResponse = await fetch(downloadUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (downloadResponse.ok) {
          const blob = await downloadResponse.blob();
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = data.data.filename_download || project.nombreArchivo;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } else {
          console.error(
            "Error al descargar el archivo binario:",
            downloadResponse.statusText
          );
        }
      } else {
        console.error(
          "Error al obtener los metadatos del archivo:",
          response.statusText
        );
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
