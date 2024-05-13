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
  const [currentUser, setCurrentUser] = useState(null);
  const [showClienteForm, setShowClienteForm] = useState(false);
  const [showProjectList, setShowProjectList] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const currentUserResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/repo/${username}`
        );
        if (currentUserResponse.ok) {
          const currentUserData = await currentUserResponse.json();
          setCurrentUser(currentUserData);
        }

        const collaboratorResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/repo/collaborator-repos/${username}`
        );
        if (collaboratorResponse.ok) {
          const collaboratorData = await collaboratorResponse.json();
          setRepos((prevRepos) => {
            const currentRepoIds = prevRepos.map((repo) => repo.id);
            const newCollabRepos = collaboratorData.filter(
              (collabRepo) => !currentRepoIds.includes(collabRepo.id)
            );
            return [...prevRepos, ...newCollabRepos];
          });
        }
      } catch (error) {
        console.error("Error fetching repos:", error);
      }
    };

    fetchRepos();
  }, [username]);

  useEffect(() => {
    if (currentUser) {
      const fetchRepos = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/repo/${username}`
          );
          if (response.ok) {
            const data = await response.json();
            setRepos((prevRepos) => {
              const currentRepoIds = new Set(prevRepos.map((repo) => repo.id));
              const newData = data.filter(
                (repo) => !currentRepoIds.has(repo.id)
              );
              return [...prevRepos, ...newData];
            });
          }
        } catch (error) {
          console.error("Error fetching repos:", error);
        }
      };

      fetchRepos();
    }
  }, [currentUser, username]);

  const handleSearchChangeVar = async (event) => {
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
