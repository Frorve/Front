import React, { useState, useEffect } from 'react';
import './MainPage.css';
import { FaUser, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Link, useParams } from 'react-router-dom';
import logo from '../assets/logo.png'

const ProjectCard = ({ project, expandedProjectId, onExpand, onDelete }) => {
    const isExpanded = project.id === expandedProjectId;

    const handleEdit = () => {
        console.log('Editar proyecto:', project.id);
    };

    const handleDelete = async () => {
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

    const handleClick = () => {
        onExpand(isExpanded ? null : project.id);
    };

    return (
        <div className={`project-card ${isExpanded ? 'expanded' : ''}`} onClick={handleClick}>
            <div className="project-info">
                <p><strong>Nombre: </strong>{project.nombreProyecto}</p>
                <p><strong>Descripción: </strong>{project.descripcion}</p>
            </div>
            {isExpanded && (
                <div className="project-details">
                    <p><strong>Nombre: </strong>{project.nombreProyecto}</p>
                    <p><strong>Descripción: </strong>{project.descripcion}</p>
                    <p><strong>Colaboradores: </strong>{project.colaboradores}</p>
                    <p><strong>Fecha de inicio: </strong>{project.fechaInicio}</p>
                    <p><strong>Fecha de finalización: </strong>{project.fechaFinalizacion}</p>
                    <p><strong>Archivo: </strong></p>
                    <div className="project-actions">
                        <button className="edit-button" onClick={handleEdit}>Editar <FaEdit /></button>
                        <button className="delete-button" onClick={handleDelete}>Borrar <FaTrash /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

const MainPage = () => {
    const { username } = useParams();
    const [showForm, setShowForm] = useState(false);
    const [repos, setRepos] = useState([]);
    const [projectname, setNombreProyecto] = useState('');
    const [description, setDescripcion] = useState('');
    const [author, setAutor] = useState('');
    const [colab, setColaborador] = useState('');
    const [userCreatedMessage, setUserCreatedMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [expandedProjectId, setExpandedProjectId] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const response = await fetch(`http://localhost:3000/repo?author=${username}`);
                if (response.ok) {
                    const data = await response.json();
                    setRepos(data);
                }
            } catch (error) {
                console.error('Error fetching repos:', error);
                setErrorMessage('Error al obtener los repositorios');
            }
        };

        fetchRepos();
    }, [username]);

    const handleProjectoChange = (event) => {
        setNombreProyecto(event.target.value);
    };

    const handleDescripcionChange = (event) => {
        setDescripcion(event.target.value);
    };

    const handleAutorChange = (event) => {
        setAutor(event.target.value);
    };

    const handleColaboradorChange = (event) => {
        setColaborador(event.target.value);
    };

    const handleFormToggle = () => {
        setShowForm(!showForm);
    };

    const handleExpand = (projectId) => {
        setExpandedProjectId(projectId);
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

    // Obtener la fecha actual
    const fechaInicio = new Date().toISOString().split('T')[0];

    // Obtener la fecha dentro de 10 días
    const fechaFinalizacion = new Date();
    fechaFinalizacion.setDate(fechaFinalizacion.getDate() + 10);
    const fechaFinalizacionFormateada = fechaFinalizacion.toISOString().split('T')[0];

    const formData = new FormData();
    formData.append('nombreProyecto', projectname);
    formData.append('descripcion', description);
    formData.append('fechaInicio', fechaInicio);
    formData.append('fechaFinalizacion', fechaFinalizacionFormateada);        
    formData.append('autor', author);
    formData.append('colaboradores', colab);
    formData.append('archivo', file); 

        try {
            const response = await fetch('http://localhost:3000/repo', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                console.log('Proyecto creado exitosamente');
                setNombreProyecto('');
                setAutor('');
                setColaborador('');
                setDescripcion('');
                setFile(null);
                setUserCreatedMessage('Proyecto creado correctamente');
            }
        } catch (error) {
            console.error('Error al crear proyecto:', error);
            setErrorMessage('Error al crear el proyecto');
    
        }
    };

    return (
        <div>
            <header className="header">
                <div className="logo">
                    <img className="img" src={logo} alt="Logo de la empresa" />
                    {/* <button className='new-project-button' onClick={handleFormToggle}>+ Nuevo Proyecto</button> */}
                </div>
                <div className="user-info">
                    <FaUser className="user-icon" />
                    <span>{username}</span>
                    <Link to="/login">
                        <button className='logout' type='submit'>Cerrar sesión</button>
                    </Link>
                </div>
            </header>
            <div className='wrapper-main'>
                {showForm ? (
                    <form onSubmit={handleSubmit}>
                        <h1>Nuevo proyecto</h1>
                        <div className='input-box'>
                            <div className='info-box'>
                                <span>Nombre:</span>
                                <input
                                    type="text"
                                    value={projectname}
                                    onChange={handleProjectoChange}
                                    placeholder='Nombre del proyecto'
                                    maxLength={30}
                                    required />
                            </div>
                        </div>
                        <div className='input-box'>
                            <div className='info-box'>
                                <span>Descripción:</span>
                                <input type="text"
                                    value={description}
                                    onChange={handleDescripcionChange}
                                    placeholder='Descripción del proyecto'
                                    maxLength={50}
                                    required />
                            </div>
                        </div>
                        <div className='input-box'>
                            <div className='info-box'>
                                <span>Autor:</span>
                                <input type="text"
                                    value={author}
                                    onChange={handleAutorChange}
                                    placeholder='Autor del proyecto'
                                    maxLength={10}
                                    required />
                            </div>
                        </div>
                        <div className='input-box'>
                            <div className='info-box'>
                                <span>Colaboradores:</span>
                                <input type="text"
                                    value={colab}
                                    onChange={handleColaboradorChange}
                                    placeholder='Colaboradores del proyecto'
                                    maxLength={30} />
                            </div>
                        </div>
                        <div className='input-box'>
                            <div className='info-box'>
                                <span>Archivos:</span>
                                <input type="file"
                                    onChange={handleFileChange}
                                    placeholder='Archivos a subir'
                                    maxLength={30} />
                            </div>
                        </div>
                        {userCreatedMessage && <div className="success-message">{userCreatedMessage}</div>}
                        <button type='submit'>Guardar</button>
                    </form>
                ) : (
                    <div className='projects-container'>
                        {repos.map(repo => (
                            <ProjectCard
                                key={repo.id}
                                project={repo}
                                expandedProjectId={expandedProjectId}
                                onExpand={handleExpand}
                            />
                        ))}
                    </div>
                )}
                <button className="add-project-button" onClick={handleFormToggle}>
                    {showForm ? 'Volver atrás' : <FaPlus />}
                </button>
            </div>
            <footer className="footer-page">
                <div className='foot'>
                    <p>© 2024 | Fran Ortega Velasco</p>
                </div>
            </footer>
        </div>
    );
}

export default MainPage;
