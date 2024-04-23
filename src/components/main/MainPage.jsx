import React, { useState, useEffect } from "react";
import "./MainPage.css";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";

const MainPage = () => {
  const { username } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [repos, setRepos] = useState([]);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/staff/username/${username}`);
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
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
            setRepos(data);
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
      />
      <div className="wrapper-main">
        {!showForm && <strong><h1>Proyectos</h1></strong>}
        {username && showForm ? (
          <ProjectForm
            onSubmit={handleSubmitForm}
            onCancel={handleCancelForm}
            username={username}
          />
        ) : (
          <>
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
        {!showForm && (
          <button className="add-project-button" onClick={handleFormToggle}>
            Agregar Proyecto
          </button>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MainPage;
