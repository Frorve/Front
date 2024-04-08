import React, { useState, useEffect } from 'react';
import './MainPage.css';
import { FaUser, FaPlus } from "react-icons/fa";
import { Link, useParams } from 'react-router-dom';
import logo from '../assets/logo.png';
import ProjectCard from './ProjectCard';

const MainPage = () => {
    const { username } = useParams();
    const { token } = useParams();
    const [showForm, setShowForm] = useState(false);
    const [repos, setRepos] = useState([]);
    const [projectname, setNombreProyecto] = useState('');
    const [description, setDescripcion] = useState('');
    const [author, setAutor] = useState({username});
    const [colab, setColaborador] = useState('');
    const [colaboradoresSeleccionados, setColaboradoresSeleccionados] = useState([]);
    const [userCreatedMessage, setUserCreatedMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [expandedProjectId, setExpandedProjectId] = useState(null);
    const [file, setFile] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const response = await fetch('http://localhost:3000/repo', {
                    headers: {
                        'Authorization': `Bearer ${token}` // Pasar el token JWT en el encabezado de autorización
                    }
                });
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
    }, [token]);

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

    const handleSearchChange = async (event) => {
        setSearchQuery(event.target.value);
        try {
            const response = await fetch(`http://localhost:3000/staff/search?query=${event.target.value}`);
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error al obtener los resultados de búsqueda');
        }
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

    const handleAddCollaborator = (collaborator) => {
        // Verificar si el colaborador ya está en la lista
        if (colaboradoresSeleccionados.includes(collaborator)) {
            // Si el colaborador ya está en la lista, eliminarlo
            setColaboradoresSeleccionados(colaboradoresSeleccionados.filter(colab => colab !== collaborator));
        } else {
            // Si el colaborador no está en la lista, agregarlo
            setColaboradoresSeleccionados([...colaboradoresSeleccionados, collaborator]);
        }
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
        formData.append('colaboradores', colaboradoresSeleccionados.join(',')); // Convertir la lista de colaboradores a una cadena separada por comas
        formData.append('archivo', file);

        try {
            const response = await fetch('http://localhost:3000/repo', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                console.log('Proyecto creado exitosamente');
                // window.location.reload();
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
                    <a href="http://localhost:3001/main/Probando">
                        <img className="img" src={logo} alt="Logo de la empresa" />
                    </a>
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
                <h1>Proyectos</h1>
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
                                    value={username}
                                    onChange={handleAutorChange}
                                    placeholder='Autor del proyecto'
                                    maxLength={10}
                                    required />
                            </div>
                        </div>
                        <div className='input-box'>
                            <div className='info-box'>
                                <span>Colaboradores:</span>
                                <ul>
                                    {colaboradoresSeleccionados.map(colab => (
                                        <li key={colab} onClick={() => handleAddCollaborator(colab)}>
                                            {colab} <span className="remove-icon"></span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className='input-box'>
                            <div className='info-box'>
                                <span>Buscar colaboradores:</span>
                                <input
                                    type="text"
                                    placeholder="Buscar colaborador"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                <ul>
                                    {searchResults.map(user => (
                                        <li key={user.id} onClick={() => handleAddCollaborator(user.nombre)}>
                                            {user.nombre}
                                        </li>
                                    ))}
                                </ul>
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

