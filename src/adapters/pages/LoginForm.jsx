import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../components/styles/LoginForm.css";
import { FaLock } from "react-icons/fa";
import { GrMail } from "react-icons/gr";
import logo from "../../assets/logo.png";
import Footer from "../components/FooterComponent/Footer";

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mail, setMail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("rememberedUsername");
    const storedPassword = localStorage.getItem("rememberedPassword");
    const storedMail = localStorage.getItem("remenberedMail")
    const storedRememberMe = localStorage.getItem("rememberMe");

    if (storedUsername && storedPassword && storedMail && storedRememberMe === "true") {
      setUsername(storedUsername);
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

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_DIRECTUS}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const token = data.data.access_token;
        const refreshToken = data.data.refresh_token;
        localStorage.setItem("authToken", token);
        localStorage.setItem("refreshToken", refreshToken);
        console.log(token);

        const userResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_DIRECTUS}/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const firstName = userData.data.first_name;

          localStorage.setItem("username", firstName);

          if (rememberMe) {
            localStorage.setItem("rememberedUsername", username);
            localStorage.setItem("rememberedPassword", password);
            localStorage.setItem("remenberedMail")
            localStorage.setItem("rememberMe", "true");
          } else {
            localStorage.removeItem("rememberedUsername");
            localStorage.removeItem("rememberedPassword");
            localStorage.removeItem("remenberedMail")
            localStorage.removeItem("rememberMe");
          }

          navigate(`/main/${firstName}`);
        } else {
          throw new Error("Error al obtener información del usuario");
        }
      } else {
        throw new Error("Credenciales incorrectas");
      }
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
