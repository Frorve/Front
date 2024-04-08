import React, { useState } from 'react';
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { AiFillCloseCircle } from "react-icons/ai";
import EditProjectForm from './EditProjectForm';

const ProjectCard = ({ project, expandedProjectId, onExpand, onDelete }) => {
    const isExpanded = project.id === expandedProjectId;
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        console.log('Editar proyecto:', project.id);
        setIsEditing(true);
    };

    const handleSaveEdit = (updatedProject) => {
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("¿Estás seguro de borrar este proyecto?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:3000/repo/${project.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                window.location.reload();
                onDelete(project.id);
                console.log('Proyecto borrado exitosamente:', project.id);
            } else {
                console.error('Error al borrar el proyecto:', response.statusText);
            }
        } catch (error) {
            console.error('Error al borrar el proyecto:', error);
        }
    };

    const downloadFile = async () => {
        try {
            const response = await fetch(`http://localhost:3000/repo/${project.id}`, {
                method: 'GET',
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = "Descarga";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error('Error al descargar el archivo:', response.statusText);
            }
        } catch (error) {
            console.error('Error al descargar el archivo:', error);
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
        <div className={`project-card ${isExpanded ? 'expanded' : ''}`} onClick={handleClick}>
            {isEditing ? (
                <EditProjectForm
                    project={project}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                />
            ) : (
                <>
                    <div className="project-info">
                        <p><strong>Nombre: </strong>{project.nombreProyecto}</p>
                        <p><strong>Descripción: </strong>{project.descripcion}</p>
                    </div>
                    {isExpanded && (
                        <div className="project-details">
                            <button className="close-button" onClick={handleClose}> <AiFillCloseCircle/> </button>
                            <p><strong>Nombre: </strong>{project.nombreProyecto}</p>
                            <p><strong>Descripción: </strong>{project.descripcion}</p>
                            <p><strong>Autor: </strong>{project.autor}</p>
                            <p><strong>Colaboradores: </strong>{project.colaboradores}</p>
                            <p><strong>Fecha de inicio: </strong>{project.fechaInicio}</p>
                            <p><strong>Fecha de finalización: </strong>{project.fechaFinalizacion}</p>

                            {project.archivo && (
                                <div>
                                    <p><strong>Archivo: </strong></p>
                                    <button onClick={downloadFile}>Descargar archivo <FiDownload/></button>
                                </div>
                            )}

                            <div className="project-actions">
                                <button className="edit-button" onClick={handleEdit}>Editar <FaEdit /></button>
                                <button className="delete-button" onClick={handleDelete}>Borrar <FaTrash /></button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProjectCard;
