import React, { useState, useEffect } from "react";
import "../components/styles/MainPage.css";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavbarComponent/Navbar";
import Footer from "../components/FooterComponent/Footer";
import ProjectForm from "../components/ProjectListComponent/ProjectForm";
import ProjectList from "../components/ProjectListComponent/ProjectList";
import ClienteForm from "../components/ProjectListComponent/ClienteForm";

const MainPage = () => {
  const { username } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [repos, setRepos] = useState([]);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showClienteForm, setShowClienteForm] = useState(false);
  const [showProjectList, setShowProjectList] = useState(true);

useEffect(() => {
  const fetchRepos = async () => {
    try {
      const currentUserPromise = fetch(
        `${process.env.REACT_APP_BACKEND_DIRECTUS}/items/repo?fields=*.*&filter={"autor":{"_eq":"${username}"}}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      const collaboratorPromise = fetch(
        `${process.env.REACT_APP_BACKEND_DIRECTUS}/items/repo?fields=*.*&filter={"colaboradores":{"_eq":"${username}"}}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      // Espera a que ambas promesas se resuelvan
      const [currentUserResponse, collaboratorResponse] = await Promise.all([
        currentUserPromise,
        collaboratorPromise,
      ]);

      let repos = [];

      if (currentUserResponse.ok) {
        const currentUserData = await currentUserResponse.json();
        const currentUserRepos = currentUserData.data;
        console.log(currentUserRepos);
        // Agrega los repositorios del usuario
        repos = [...repos, ...currentUserRepos];
      }

      if (collaboratorResponse.ok) {
        const collaboratorDataResponse = await collaboratorResponse.json();
        const collaboratorRepos = collaboratorDataResponse.data;
        console.log(collaboratorRepos);
        // Filtra los repositorios de colaboradores para eliminar duplicados
        const uniqueCollaboratorRepos = collaboratorRepos.filter((collabRepo) =>
          repos.every((repo) => repo.id !== collabRepo.id)
        );
        // Agrega los repositorios de colaboradores sin duplicados
        repos = [...repos, ...uniqueCollaboratorRepos];
      }

      // Actualiza el estado repos
      setRepos(repos);
    } catch (error) {
      console.error('Error fetching repos:', error);
    }
  };

  fetchRepos();
}, [username]);

  const handleSearchChangeVar = (event) => {
    const searchTerm = event.target.value;
    setSearchQuery(searchTerm);
  };

  const handleFormToggle = () => {
    setShowForm(!showForm);
    setShowProjectList(false);
  };

  const handleSubmitForm = () => {
    setShowForm(false);
    setShowProjectList(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setShowProjectList(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setExpandedProjectId(false);
    setShowClienteForm(false);
  };

  const handleExpand = (projectId) => {
    setExpandedProjectId(projectId);
  };

  const handleClienteFormToggle = () => {
    setShowClienteForm(!showClienteForm);
    setShowProjectList(false);
  };

  const handleSubmitClienteForm = () => {
    setShowClienteForm(false);
    setShowProjectList(true);
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
      />
      <div className="wrapper-main">
        {!showForm && !showClienteForm && (
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
        {!showForm && !showClienteForm && (
          <>
            <button className="add-project-button" onClick={handleFormToggle}>
              Agregar Proyecto
            </button>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MainPage;
