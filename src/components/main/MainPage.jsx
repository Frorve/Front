import React, { useState, useEffect } from 'react';
import './MainPage.css';
import { FaUser, FaPlus } from "react-icons/fa";
import { Link } from 'react-router-dom';

const MainPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [repos, setRepos] = useState([]);
    const [projectname, setNombreProyecto] = useState('');
    const [description, setDescripcion] = useState('');
    const [author, setAutor] = useState('');
    const [colab, setColaborador] = useState('');
    const [userCreatedMessage, setUserCreatedMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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

    useEffect(() => {
        const fetchUserRepos = async () => {
            try {
                const response = await fetch('/repo/user/1'); // Reemplaza "1" con el ID del usuario actual
                if (!response.ok) {
                    throw new Error('Error fetching user repos');
                }
                const data = await response.json();
                setRepos(data);
            } catch (error) {
                console.error('Error fetching user repos:', error);
            }
        };

        fetchUserRepos();
    }, []);

    const handleFormToggle = () => {
        setShowForm(!showForm);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

            // Obtener la fecha actual
    const fechaInicio = new Date().toISOString().split('T')[0];

    // Obtener la fecha dentro de 10 días
    const fechaFinalizacion = new Date();
    fechaFinalizacion.setDate(fechaFinalizacion.getDate() + 10);
    const fechaFinalizacionFormateada = fechaFinalizacion.toISOString().split('T')[0];
    
        try {
            const response = await fetch('http://localhost:3000/repo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombreProyecto: projectname,
                    descripcion: description,
                    fechaInicio: fechaInicio,
                    fechaFinalizacion: fechaFinalizacionFormateada,
                    autor: author,
                    colaboradores: author + ", " + colab
                })
            });
    
            if (response.ok) {
                console.log('Proyecto creado exitosamente');
                setNombreProyecto('');
                setAutor('');
                setColaborador('');
                setDescripcion('');
                setUserCreatedMessage('Proyecto creado correctamente');

            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                // Error de nombre de usuario o correo electrónico en uso
                console.error('Error al crear usuario:', error.message);
              } 
        }
    };

    return (
        <div>
            <header className="header">
                <div className="logo">
                    <img className="img" src="https://camo.githubusercontent.com/1ecece3e9f50024dc4da57a66ac30e07daafe0914ceb1292d7fc60eb9779cd7a/68747470733a2f2f6265656269742e65732f77702d636f6e74656e742f75706c6f6164732f323031372f30372f6d617263612d73696e2d626f726465732e706e67" alt="Logo de la empresa" />
                </div>
                <div className="user-info">
                    <FaUser className="user-icon" />
                    <span>Username</span>
                    <Link to="/login">
                        <button type='submit'>Cerrar sesión</button>
                    </Link>
                </div>
            </header>
            <div className='wrapper-main'>
                {showForm ? (
                    <form onSubmit={handleSubmit}>
                        <h1>Tus proyectos</h1>
                        <div className='input-box'>
                            <div className="info-box">
                                <span>Nombre:</span>
                                <input                             
                                    type="text"
                                    value={projectname}
                                    onChange={handleProjectoChange}
                                    placeholder='Nombre del proyecto'
                                    required />
                            </div>
                        </div>
                        <div className='input-box'>
                            <div className="info-box">
                                <span>Descripción:</span>
                                <input type="text"
                                    value={description}
                                    onChange={handleDescripcionChange}
                                    placeholder='Descripción del proyecto'
                                    required />
                            </div>
                        </div>
                        <div className='input-box'>
                            <div className="info-box">
                                <span>Autor:</span>
                                <input type="text" 
                                    value={author}
                                    onChange={handleAutorChange}
                                    placeholder='Autor del proyecto'
                                    required />
                            </div>
                        </div>
                        <div className='input-box'>
                            <div className="info-box">
                                <span>Colaboradores:</span>
                                <input type="text" 
                                    value={colab}
                                    onChange={handleColaboradorChange}
                                    placeholder='Colaboradores del proyecto'/>
                            </div>
                        </div>
                        {userCreatedMessage && <div className="success-message">{userCreatedMessage}</div>}
                        <button type='submit'>Guardar</button>
                    </form>
                ) : (
                    <div>
                        {repos.length > 0 ? (
                            <ul>
                                {repos.map(repo => (
                                    <li key={repo.id}>
                                        <p>Nombre: {repo.nombreProyecto}</p>
                                        <p>Descripción: {repo.descripcion}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-projects" >No hay proyectos subidos</p>
                        )}
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

