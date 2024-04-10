import React, { useState } from 'react';

const EditProjectForm = ({ project, onSave, onCancel }) => {

    const [userCreatedMessage, setUserCreatedMessage] = useState('');

    const [editedProject, setEditedProject] = useState({
        nombreProyecto: project.nombreProyecto,
        descripcion: project.descripcion,
        colaboradores: project.colaboradores,
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditedProject({
            ...editedProject,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/repo/${project.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedProject),
            });

            if (response.ok) {
                onSave(editedProject);
                setUserCreatedMessage('Proyecto editado correctamente');
                window.location.reload();
            } else {
                console.error('Error al actualizar el proyecto:', response.statusText);
            }
        } catch (error) {
            console.error('Error al actualizar el proyecto:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <div className='edit'>
            <h1>Editar Proyecto</h1>
            <div className='input-box'>
                <div className='info-box'>
                    <span>Nombre:</span>
                    <input
                        type="text"
                        name="nombreProyecto"
                        value={editedProject.nombreProyecto}
                        onChange={handleChange}
                        placeholder='Nombre del proyecto'
                        maxLength={30}
                        required
                    />
                </div>
            </div>
            <div className='input-box'>
                <div className='info-box'>
                    <span>Descripción:</span>
                    <input
                        type="text"
                        name="descripcion"
                        value={editedProject.descripcion}
                        onChange={handleChange}
                        placeholder='Descripción del proyecto'
                        maxLength={50}
                        required
                    />
                </div>
            </div>
            <div className='input-box'>
                <div className='info-box'>
                    <span>Colaboradores:</span>
                    <input
                        type="text"
                        name="colaboradores"
                        value={editedProject.colaboradores}
                        onChange={handleChange}
                        placeholder='Colaboradores del proyecto'
                        maxLength={30}
                    />
                </div>
            </div>
            {userCreatedMessage && <div className="success-message">{userCreatedMessage}</div>}
            <button className="save-button" type='submit'>Guardar</button>
            <button className="cancel-button" type='button' onClick={onCancel}>Cancelar</button>
            </div>
        </form>
    );
};

export default EditProjectForm;