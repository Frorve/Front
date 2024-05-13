import React, { useState } from "react";
import "../components/styles/Register.css";
import { FaUser, FaLock } from "react-icons/fa";
import { GrMail } from "react-icons/gr";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import Footer from "../components/FooterComponent/Footer";
import * as api from "../api/api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mail, setMail] = useState("");
  const [errorMessage] = useState("");
  const [userCreatedMessage] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleMailChange = (event) => {
    setMail(event.target.value);
  };

  const handleSubmit = async (
    username,
    mail,
    password,
    setUsername,
    setMail,
    setPassword,
    setUserCreatedMessage,
    setErrorMessage
  ) => {
    try {
      const response = await api.registerUser(username, mail, password);

      if (response.status === 200) {
        console.log("Usuario creado exitosamente");
        setUsername("");
        setMail("");
        setPassword("");
        setUserCreatedMessage("Usuario creado correctamente");
        setTimeout(() => setUserCreatedMessage(""), 5000);
      } else {
        setErrorMessage(
          "El nombre de usuario o correo electrónico ya están en uso"
        );
        setTimeout(() => setErrorMessage(""), 5000);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage(
          "El nombre de usuario o correo electrónico ya están en uso"
        );
        console.error("Error al crear usuario:", error.message);
        setTimeout(() => setErrorMessage(""), 5000);
      }
    }
  };

  return (
    <div>
      <div className="wrapper">
        <img className="logo" src={logo} alt="" />
        <form onSubmit={handleSubmit}>
          <h1>Crear Cuenta</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={handleUsernameChange}
              maxLength={30}
              required
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={mail}
              onChange={handleMailChange}
              maxLength={30}
              required
            />
            <GrMail className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={handlePasswordChange}
              maxLength={20}
              required
            />
            <FaLock className="icon" />
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
          {userCreatedMessage && (
            <div role="alert" className="alert alert-success">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{userCreatedMessage}</span>
            </div>
          )}
          <br />
          <button type="submit">Crear Usuario</button>

          <div className="register-link">
            <p>
              ¿Tienes ya una cuenta creada?{" "}
              <Link to="/login">Iniciar Sesión</Link>
            </p>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
