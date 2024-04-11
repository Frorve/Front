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
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFinalizacion, setFechaFinalizacion] = useState('');

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const response = await fetch('http://localhost:3000/repo');
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
    }, []);

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

    const handleFechaInicioChange = (event) => {
        setFechaInicio(event.target.value);
    };

    const handleFechaFinalizacionChange = (event) => {
        setFechaFinalizacion(event.target.value);
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
        if (colaboradoresSeleccionados.includes(collaborator)) {
            setColaboradoresSeleccionados(colaboradoresSeleccionados.filter(colab => colab !== collaborator));
        } else {
            setColaboradoresSeleccionados([...colaboradoresSeleccionados, collaborator]);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('nombreProyecto', projectname);
        formData.append('descripcion', description);
        formData.append('fechaInicio', fechaInicio);
        formData.append('fechaFinalizacion', fechaFinalizacion);
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

    const handleCancel = () => {
        setShowForm(false);
        setNombreProyecto('');
        setAutor('');
        setColaborador('');
        setDescripcion('');
        setFile(null);
    };

    return (
        <div>
<div id="nav" className="navbar bg-base-100">
  <div className="flex-1">
    <Link to={(`/main/${username}`)} >
    <a className="btn btn-ghost text-xl" onClick={handleCancel}>Stafko</a>
    </Link>
  </div>
  <div className="flex-none gap-2">
    {/* <div className="form-control">
      <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
    </div> */}
    
    <button className="btn">{username}
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
            
          <img alt="Tailwind CSS Navbar component" src="https://cdn-icons-png.freepik.com/512/64/64572.png" />
        </div>
      </div>
      {/* <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
        <li>
          <a className="justify-between" onClick={handleFormToggle}>
            Agregar proyecto
            <span className="badge">New</span>
          </a>
        </li> */}
        {/* <li><a>Settings</a></li> */}
        {/* <Link to='/login' >
        <li><a>Cerrar sesión</a></li>
        </Link>
      </ul> */}
    </div>
    </button>
    <div className="navbar-end">
    <Link to="/login">
    <button className="btn btn-error">Cerrar sesión</button>
    </Link>
  </div>
  </div>
</div>

            <div className='wrapper-main'>
            {!showForm && <h1>Proyectos</h1>}
                {showForm ? (
                    <form className="formulario" onSubmit={handleSubmit}>
                        <h1>Nuevo proyecto</h1>
                        <div className='input-box'>
                            <div className='info-box'>
                                <span>Nombre:</span>
                                <input
                                    type="nombreProyecto"
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
                                <input type="descripcion"
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
                                <span>Fecha inicio:</span>
                                <input type="date"
                                    value={fechaInicio}
                                    onChange={handleFechaInicioChange}
                                    placeholder='Descripción del proyecto'
                                    required />
                            </div>
                        </div>
                        <div className='input-box'>
                            <div className='info-box'>
                                <span>Fecha finalización:</span>
                                <input type="date"
                                    value={fechaFinalizacion}
                                    onChange={handleFechaFinalizacionChange}
                                    placeholder='Descripción del proyecto'
                                    required />
                            </div>
                        </div>
                        {/* <div className='input-box'>
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
                        </div> */}

                        <div className='input-box'>
                            <div className='info-box'>
                                <span>Archivos:</span>
                                <input type="file"
                                    onChange={handleFileChange}
                                    placeholder='Archivos a subir'
                                    maxLength={50} />
                            </div>
                        </div>
                        {userCreatedMessage && <div className="success-message">{userCreatedMessage}</div>}
                        <button className="save-button" type='submit'>Guardar</button>
                        <button className="cancel-button" type='button' onClick={handleCancel}>Cancelar</button>
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
                {!showForm && <button className="add-project-button" onClick={handleFormToggle}>Agregar Proyecto</button>}
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

