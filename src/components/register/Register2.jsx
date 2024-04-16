import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginForm2 = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mail, setMail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userCreatedMessage, setUserCreatedMessage] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleMailChange = (event) => {
    setMail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/v1/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: username,
          cargo: "Staff",
          correoElectronico: mail,
          contraseña: password,
        }),
      });

      if (response.ok) {
        console.log("Usuario creado exitosamente");
        setUsername("");
        setMail("");
        setPassword("");
        setUserCreatedMessage("Usuario creado correctamente");
      } else {
        const errorData = await response.json();
        setErrorMessage(
          "El nombre de usuario o correo electrónico ya están en uso"
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // Error de nombre de usuario o correo electrónico en uso
        setErrorMessage(
          "El nombre de usuario o correo electrónico ya están en uso"
        );
        console.error("Error al crear usuario:", error.message);
      }
    }
  };

  return (
    <div>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="flex flex-col items-center">
            <h1 className="text-5xl font-bold">¡Bienvenido a Stafko!</h1>
            <p className="py-6">
              Tu aplicación de confianza donde puedes guardar todos tus
              Proyectos
            </p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form onSubmit={handleSubmit} className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Usuario</span>
                </label>
                <input
                  type="text"
                  placeholder="Usuario"
                  className="input input-bordered"
                  maxLength={30}
                  onChange={handleUsernameChange}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Correo electrónico</span>
                </label>
                <input
                  type="email"
                  placeholder="Correo"
                  className="input input-bordered"
                  maxLength={30}
                  onChange={handleMailChange}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Contraseña</span>
                </label>
                <input
                  type="password"
                  placeholder="Contraseña"
                  className="input input-bordered"
                  onChange={handlePasswordChange}
                  maxLength={20}
                  required
                />
                <label className="label">
                  <Link to="/login2">
                    <a href="#" className="label-text-alt link link-hover">
                      ¿Ya tienes una cuenta?
                    </a>
                  </Link>
                </label>
              </div>
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}
              {userCreatedMessage && (
                <div className="success-message">{userCreatedMessage}</div>
              )}
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Crear cuenta
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <aside>
          <p>Copyright © 2024 - All right reserved by Fran Ortega Velasco</p>
        </aside>
      </footer>
    </div>
  );
};

export default LoginForm2;
