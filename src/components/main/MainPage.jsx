import React, { useState, useEffect } from "react";
import "./styles/MainPage.css";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";
import ClienteForm from "./ClienteForm";

const MainPage = () => {
  const { username } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [repos, setRepos] = useState([]);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [showClienteForm, setShowClienteForm] = useState(false);
  

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const currentUserResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/repo/${username}`);
        if (currentUserResponse.ok) {
          const currentUserData = await currentUserResponse.json();
          setCurrentUser(currentUserData);
        }
  
        const collaboratorResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/repo/collaborator-repos/${username}`);
        if (collaboratorResponse.ok) {
          const collaboratorData = await collaboratorResponse.json();
          setRepos(prevRepos => {
            const currentRepoIds = prevRepos.map(repo => repo.id);
            const newCollabRepos = collaboratorData.filter(collabRepo => !currentRepoIds.includes(collabRepo.id));
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
            setRepos(prevRepos => {
              const currentRepoIds = new Set(prevRepos.map(repo => repo.id));
              const newData = data.filter(repo => !currentRepoIds.has(repo.id));
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
  };

  const handleSubmitForm = () => {
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const handleExpand = (projectId) => {
    setExpandedProjectId(projectId);
  };

  const handleClienteFormToggle = () => {
    setShowClienteForm(!showClienteForm);
  };

  const handleSubmitClienteForm = () => {
    setShowClienteForm(false);
  };

  const handleCancelClienteForm = () => {
    setShowClienteForm(false);
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
        />
        <div className="wrapper-main">
          {!showForm && !showClienteForm && <strong><h1>Proyectos</h1></strong>}
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
              {repos.length === 0 && (
                <p className="welcome"><strong>Aún no has subido ningún proyecto. ¡Empieza ahora!</strong></p>
              )}
              <ProjectList
                projects={filteredProjects}
                expandedProjectId={expandedProjectId}
                onExpand={handleExpand}
              />
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
