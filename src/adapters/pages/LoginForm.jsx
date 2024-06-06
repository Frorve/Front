import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../components/styles/LoginForm.css";
import { FaLock } from "react-icons/fa";
import { GrMail } from "react-icons/gr";
import logo from "../../assets/logo.png";
import Footer from "../components/FooterComponent/Footer";
import { getUserInfo } from "../api/apiDirectus";

const LoginForm = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [mail, setMail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //Hook para mque guarde contraseña y mail en la memoria local si el usuario lo decide a traves de un marcador

  useEffect(() => {
    const storedPassword = localStorage.getItem("rememberedPassword");
    const storedMail = localStorage.getItem("rememberedMail");
    const storedRememberMe = localStorage.getItem("rememberMe");

    if (storedPassword && storedMail && storedRememberMe === "true") {
      setPassword(storedPassword);
      setMail(storedMail);
      setRememberMe(true);
    }
  }, []);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleMailChange = (event) => {
    setMail(event.target.value);
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const loginData = {
      email: mail,
      password: password,
    };

    //Llamada para hacer el login con las crendeciales, si se inicia sesion guardara el token en el almacenamiento local

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_MICROSERVICIOS}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );
  
      if (!response.ok) {
        setErrorMessage("Error al iniciar sesión:");
        setTimeout(() => setErrorMessage(""), 5000);
      }
  
      const data = await response.json();
      const token = data.data.access_token;
      const refreshToken = data.data.refresh_token;
  
      console.log(data);
  
      localStorage.setItem("authToken", token);
      localStorage.setItem("refreshToken", refreshToken);
      console.log(token);
  
      // Nueva solicitud para almacenar el token en el backend de NestJS
      const storeTokenResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_MICROSERVICIOS}/directus/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ token }),
        }
      );
  
      if (!storeTokenResponse.ok) {
        const errorText = await storeTokenResponse.text();
        throw new Error(`Error: ${storeTokenResponse.status} - ${errorText}`);
      }
  
      const userData = await getUserInfo(token);
      const firstName = userData.data.first_name;
  
      localStorage.setItem("username", firstName);
  
      if (rememberMe) {
        localStorage.setItem("rememberedUsername", mail);
        localStorage.setItem("rememberedPassword", password);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedUsername");
        localStorage.removeItem("rememberedPassword");
        localStorage.removeItem("rememberMe");
      }
  
      navigate(`/main/${firstName}`);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
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
