import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../components/styles/MainPage.css";
import Navbar from "../components/NavbarComponent/Navbar";
import Footer from "../components/FooterComponent/Footer";
import ProjectForm from "../components/ProjectListComponent/ProjectForm";
import ProjectList from "../components/ProjectListComponent/ProjectList";
import ClienteForm from "../components/ProjectListComponent/ClienteForm";
import ClienteList from "../components/ProjectListComponent/ClienteList";
import Chat from "../components/ChatBubble/Chat";

const MainPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [repos, setRepos] = useState([]);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showClienteForm, setShowClienteForm] = useState(false);
  const [showClienteList, setShowClienteList] = useState(false);
  const [showProjectList, setShowProjectList] = useState(true);

  const jwtDecode = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  const refreshAuthToken = async (refreshToken) => {
    try {
      const payload = {
        refresh_token: refreshToken,
        mode: "json",
      };

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_DIRECTUS}/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("refreshToken", data.data.refresh_token);
        return data.data.access_token;
      } else {
        throw new Error(`Error al actualizar el token: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error al actualizar el token:", error.message);
      throw error;
    }
  };

  const fetchRepos = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!authToken || !refreshToken) {
        navigate("/login");  // Redirigir al login si no hay tokens
        return;
      }

      // Verificar si el token de autenticación ha expirado
      const authTokenExpireTime = jwtDecode(authToken).exp * 1000;
      const currentTime = new Date().getTime();

      if (currentTime >= authTokenExpireTime) {
        // Token expirado, solicitar un nuevo token de actualización
        const refreshedToken = await refreshAuthToken(refreshToken);
        localStorage.setItem("authToken", refreshedToken);
      }

      // Continuar con la solicitud utilizando el token actualizado
      const currentUserResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_MICROSERVICIOS}/repo/autor/${username}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!currentUserResponse.ok) {
        navigate("/login");  // Redirigir al login si no hay tokens
        return;
      }

      const collaboratorResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_MICROSERVICIOS}/repo/colaborador/${username}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!collaboratorResponse.ok) {
        navigate("/login");  // Redirigir al login si no hay tokens
        return;
      }

      const currentUserData = await currentUserResponse.json();
      const collaboratorDataResponse = await collaboratorResponse.json();

      let repos = [];
      if (currentUserData.data) {
        const currentUserRepos = currentUserData.data;
        console.log(currentUserRepos);
        // Agrega los repositorios del usuario
        repos = [...repos, ...currentUserRepos];
      }

      if (collaboratorDataResponse.data) {
        const collaboratorRepos = collaboratorDataResponse.data;
        console.log(collaboratorRepos);
        // Agrega los repositorios de colaboradores
        repos = [...repos, ...collaboratorRepos];
      }

      // Actualiza el estado repos
      setRepos(repos);
    } catch (error) {
      console.error("Error fetching repos:", error);
      navigate("/login");  // Redirigir al login en caso de error
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const handleSearchChangeVar = (event) => {
    const searchTerm = event.target.value;
    setSearchQuery(searchTerm);
  };

  const handleFormToggle = () => {
    setShowForm(!showForm);
    setShowProjectList(false);
    setShowClienteList(false);
  };

  const handleSubmitForm = () => {
    setShowForm(false);
    setShowProjectList(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setShowProjectList(true);
    fetchRepos();
  };

  const handleCancel = () => {
    setShowForm(false);
    setExpandedProjectId(false);
    setShowClienteForm(false);
    setShowClienteList(false);
    setShowProjectList(true);
    fetchRepos();
  };

  const handleExpand = (projectId) => {
    setExpandedProjectId(projectId);
  };

  const handleClienteFormToggle = () => {
    setShowClienteForm(!showClienteForm);
    setShowProjectList(false);
    setShowClienteList(false);
  };

  const handleClienteListToggle = () => {
    setShowClienteList(true);
    setShowProjectList(false);
    setShowForm(false);
    setShowClienteForm(false);
  };

  const handleSubmitClienteForm = () => {
    setShowClienteForm(false);
    setShowProjectList(true);
    setRepos(repos);
  };

  const handleCancelClienteForm = () => {
    setShowClienteForm(false);
    setShowProjectList(true);
  };

  const filteredProjects = searchQuery
    ? repos.filter((repo) =>
        repo.nombreProyecto.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : repos;

  return (
    <div>
      <Navbar
        username={username}
        handleSearchChangeVar={handleSearchChangeVar}
        handleClienteFormToggle={handleClienteFormToggle}
        handleFormToggle={handleFormToggle}
        handleCancel={handleCancel}
        handleClienteListToggle={handleClienteListToggle}
      />
      <div className="wrapper-main">
        {!showForm && !showClienteForm && !showClienteList && (
          <strong>
            <h1>Proyectos</h1>
          </strong>
        )}
        
        {username && showForm ? (
          <ProjectForm
            onSubmit={handleSubmitForm}
            onCancel={handleCancelForm}
            username={username}
          />
        ) : (
          <>
            {showClienteForm && (
              <ClienteForm
                onSubmit={handleSubmitClienteForm}
                onCancel={handleCancelClienteForm}
              />
            )}
            {showClienteList && (
              <ClienteList
                onCancel={handleCancel}
              />
            )}
            {showProjectList && repos.length === 0 && (
              <p className="welcome">
                <strong>
                  Aún no has subido ningún proyecto. ¡Empieza ahora!
                </strong>
              </p>
            )}
            {showProjectList && (
              <ProjectList
                projects={filteredProjects}
                expandedProjectId={expandedProjectId}
                onExpand={handleExpand}
              />
            )}
          </>
        )}
        
        {!showForm && !showClienteForm && !showClienteList && (
          <>
            <button className="add-project-button" onClick={handleFormToggle}>
              Agregar Proyecto
            </button>
          </>
        )}
      </div>
      <div className="chat">
        <Chat />
      </div>
      <Footer />
    </div>
  );
};

export default MainPage;
