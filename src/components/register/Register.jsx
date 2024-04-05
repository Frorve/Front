import React, { useEffect, useState } from 'react';
import './Register.css';
import { FaUser, FaLock } from "react-icons/fa";
import { AiFillEye } from "react-icons/ai";
import { GrMail } from "react-icons/gr";
import { Link } from 'react-router-dom';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mail, setMail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [userCreatedMessage, setUserCreatedMessage] = useState('');
    const [showEyeIcon, setShowEyeIcon] = useState(false); // Estado para controlar la visibilidad del icono de ojo

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        setShowEyeIcon(event.target.value !== ''); // Muestra el icono de ojo cuando el usuario comienza a escribir
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleMailChange = (event) => {
        setMail(event.target.value);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            const response = await fetch('http://localhost:3000/staff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: username,
                    cargo: "Staff",
                    correoElectronico: mail,
                    contraseña: password
                })
            });
    
            if (response.ok) {
                console.log('Usuario creado exitosamente');
                setUsername('');
                setMail('');
                setPassword('');
                setUserCreatedMessage('Usuario creado correctamente');
            } else {
                const errorData = await response.json(); 
                setErrorMessage('El nombre de usuario o correo electrónico ya están en uso');
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                // Error de nombre de usuario o correo electrónico en uso
                setErrorMessage('El nombre de usuario o correo electrónico ya están en uso');
                console.error('Error al crear usuario:', error.message);
              } 
        }
    };

    return (
        <div>
            <div className='wrapper'>
                <form onSubmit={handleSubmit}>
                    <h1>Crear Cuenta</h1>
                    <div className='input-box'>
                        <input
                            type="text"
                            placeholder='Nombre de usuario'
                            value={username}
                            onChange={handleUsernameChange}
                            maxLength={30}
                            required
                        />
                        <FaUser className='icon' />
                    </div>
                    <div className='input-box'>
                        <input
                            type="email"
                            placeholder='Correo electrónico'
                            value={mail}
                            onChange={handleMailChange}
                            maxLength={30}
                            required
                        />
                        <GrMail className='icon' />
                    </div>
                    <div className='input-box'>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder='Contraseña'
                            value={password}
                            onChange={handlePasswordChange}
                            maxLength={20}
                            required
                        />
                        <FaLock className='icon' />
                    </div>

                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    {userCreatedMessage && <div className="success-message">{userCreatedMessage}</div>}

                    <button type='submit'>Crear Usuario</button>

                    <div className="register-link">
                        <p>¿Tienes ya una cuenta creada? <Link to="/login">Iniciar Sesión</Link></p>
                    </div>
                    
                </form>
            </div>
            <footer className="footer-page">
                <div className='foot'>
                    <p>© 2024 | Fran Ortega Velasco</p>
                </div>
            </footer>
        </div>
    );
}

export default Register;
