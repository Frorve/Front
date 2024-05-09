import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../components/styles/LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import { AiFillEye } from "react-icons/ai";
import logo from "../../assets/logo.png";
import Footer from "../components/FooterComponent/Footer";
import * as api from "../api/api";

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
    const storedRememberMe = localStorage.getItem("rememberMe");

    if (storedUsername && storedPassword && storedRememberMe === "true") {
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
      const response = await api.loginUser(username, password);

      if (response.status === 200) {
        console.log("Inicio de sesión exitoso");
        if (rememberMe) {
          localStorage.setItem("rememberedUsername", username);
          localStorage.setItem("rememberedPassword", password);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberedUsername");
          localStorage.removeItem("rememberedPassword");
          localStorage.removeItem("rememberMe");
        }
        localStorage.setItem("token", response.data.token);
        navigate(`/main/${username}`);
      } else {
        setErrorMessage("Credenciales incorrectas");
        setTimeout(() => setErrorMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  return (
    <div>
      <div className="wrapper">
        <img className="logo" src={logo} alt="" />
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
            <Link to="/recuperar">¿Olvidaste la contraseña?</Link>
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
      <Footer />
    </div>
  );
};

export default LoginForm;
