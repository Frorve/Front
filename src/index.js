import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

document.addEventListener("visibilitychange", async () => {
  if (!document.hidden) {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No hay refresh token disponible");
      }

      const payload = {
        refresh_token: refreshToken,
        mode: "json"
      };

      const response = await fetch(`${process.env.REACT_APP_BACKEND_DIRECTUS}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("refreshToken", data.data.refresh_token);
        console.log("Token actualizado correctamente");
      } else {
        console.error("Error al actualizar el token:", response.statusText);
      }
    } catch (error) {
      console.error("Error al actualizar el token:", error.message);
    }
  }
});

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
