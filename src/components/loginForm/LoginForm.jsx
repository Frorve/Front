import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import { AiFillEye } from "react-icons/ai";

const LoginForm = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showEyeIcon, setShowEyeIcon] = useState(false); // Estado para controlar la visibilidad del icono de ojo

    useEffect(() => {
        const storedUsername = localStorage.getItem('rememberedUsername');
        const storedPassword = localStorage.getItem('rememberedPassword');
        if (storedUsername && storedPassword) {
            setUsername(storedUsername);
            setPassword(storedPassword);
            setRememberMe(true);
        }
    }, []);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        setShowEyeIcon(event.target.value !== ''); // Muestra el icono de ojo cuando el usuario comienza a escribir
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleRememberMeChange = () => {
        setRememberMe(!rememberMe);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const response = await fetch('http://localhost:3000/staff/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ nombre: username, 
                contraseña: password })
            });
      
            if (response.ok) {
                console.log('Inicio de sesión exitoso');
                if (rememberMe) {
                    localStorage.setItem('rememberedUsername', username);
                    localStorage.setItem('rememberedPassword', password);
                } else {
                    localStorage.removeItem('rememberedUsername');
                    localStorage.removeItem('rememberedPassword');
                }
                navigate(`/main/${username}`);
            } else {
              setErrorMessage('Credenciales incorrectas');
            }
          } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setErrorMessage('Error al conectarse al servidor');
          }
    };

    return (
        <div>
            <div className='wrapper'>
                <form onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <div className='input-box'>
                        <input
                            type="text"
                            placeholder='Usuario'
                            value={username}
                            onChange={handleUsernameChange}
                            maxLength={20}
                            required
                        />
                        <FaUser className='icon' />
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
                        {showEyeIcon && (
                            <AiFillEye className='eye-icon' onClick={toggleShowPassword} />
                        )}
                    </div>

                    <div className="remenber-forgot">
                        <label>
                            <input type="checkbox" checked={rememberMe} onChange={handleRememberMeChange} />
                            Recuérdame
                        </label>
                        <Link to="/register">¿Olvidaste la contraseña?</Link>
                    </div>

                    {errorMessage && <div className="error-message">{errorMessage}</div>}

                    <button type='submit'>Iniciar Sesión</button>

                    <div className="register-link">
                        <p>¿No tienes una cuenta? <Link to="/register">Regístrate</Link></p>
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

export default LoginForm;


