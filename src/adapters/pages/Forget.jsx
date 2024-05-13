import React, { useState } from "react";
import "../components/styles/Forget.css";
import { FaUser } from "react-icons/fa";
import { GrMail } from "react-icons/gr";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import Footer from "../components/FooterComponent/Footer";

const Forget = () => {
  const [username, setUsername] = useState("");
  const [mail, setMail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userCreatedMessage, setUserCreatedMessage] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleMailChange = (event) => {
    setMail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: username,
            cargo: "Staff",
            correoElectronico: mail,
          }),
        }
      );

      if (response.ok) {
        console.log("Usuario creado exitosamente");
        setUsername("");
        setMail("");
        setUserCreatedMessage("Usuario creado correctamente");
        setTimeout(() => setUserCreatedMessage(""), 5000);
      } else {
        setErrorMessage("Error");
        setTimeout(() => setErrorMessage(""), 5000);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage("Error");
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
          <h1>Recuperar contraseña</h1>
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
          <button type="submit">Recuperar cuenta</button>

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

export default Forget;
