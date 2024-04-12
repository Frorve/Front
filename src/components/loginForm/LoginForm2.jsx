import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginForm2 = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: username, contraseña: password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Inicio de sesión exitoso");
        console.log(data);
        localStorage.setItem("token", data.token); // Almacenar el token JWT en el almacenamiento local
        navigate(`/main2/`);
      } else {
        setErrorMessage(data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setErrorMessage("Error al conectarse al servidor");
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
                  <a href="#" className="label-text-alt link link-hover">
                    ¿Olvidaste la contraseña?
                  </a>
                  <Link to="/register2">
                    <a href="#" className="label-text-alt link link-hover">
                      ¿No tienes una cuenta?
                    </a>
                  </Link>
                </label>
              </div>
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Iniciar Sesión
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
