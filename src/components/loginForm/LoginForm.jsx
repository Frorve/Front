import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import { AiFillEye } from "react-icons/ai";
import logo from "../assets/logo.png";

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showEyeIcon, setShowEyeIcon] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("rememberedUsername");
    const storedPassword = localStorage.getItem("rememberedPassword");
    if (storedUsername && storedPassword) {
      setUsername(storedUsername);
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setShowEyeIcon(event.target.value !== "");
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
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nombre: username, contraseña: password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Inicio de sesión exitoso");
        console.log(data);
        if (rememberMe) {
          localStorage.setItem("rememberedUsername", username);
          localStorage.setItem("rememberedPassword", password);
        } else {
          localStorage.removeItem("rememberedUsername");
          localStorage.removeItem("rememberedPassword");
        }
        localStorage.setItem("token", data.token); // Almacenar el token JWT en el almacenamiento local
        navigate(`/main/${username}`);
      } else {
        setErrorMessage(data.message || "Credenciales incorrectas");
        setTimeout(() => setErrorMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setErrorMessage("Error al conectarse al servidor");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  return (
    <div>
      <div className="wrapper">
        <img src={logo} alt="" />
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={handleUsernameChange}
              maxLength={30}
              required
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={handlePasswordChange}
              maxLength={20}
              required
            />
            <FaLock className="icon" />
            {showEyeIcon && (
              <AiFillEye className="icon" onClick={toggleShowPassword} />
            )}
          </div>

          <div className="remenber-forgot">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
              Recuérdame
            </label>
            <Link to="/register">¿Olvidaste la contraseña?</Link>
          </div>

          {errorMessage && (
            <div role="alert" className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}
          <br />

          <button type="submit">Iniciar Sesión</button>

          <div className="register-link">
            <p>
              ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
            </p>
          </div>
        </form>
      </div>
      <footer className="footer-page">
        <div className="foot">
          <p>© 2024 | Fran Ortega Velasco</p>
        </div>
      </footer>
    </div>
  );
};

export default LoginForm;
