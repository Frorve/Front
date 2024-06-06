import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AiFillCloseCircle } from "react-icons/ai";
import Columna1 from "./Columna1";
import Columna2 from "./Columna2";
import Columna3 from "./Columna3";
import Modal from "./Modal";
import ModalClientes from "./ModalClientes";
import "../styles/Details.css";
import axios from "axios";
import clockify from "../../api/clockify";

const ProjectDetails = ({ project, onClose, onEdit, onDelete, onDownload }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCollaborators, setSelectedCollaborators] = useState([]);
  const [task, setTask] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const collaboratorNames = selectedCollaborators.map(
    (collaborator) => collaborator.nombre
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setsuccessMessage] = useState("");
  const [selectedClients, setSelectedClients] = useState([]);

  const [searchQueryClients, setSearchQueryClients] = useState("");
  const [searchResultsClients, setSearchResultsClients] = useState([]);
  const [showSearchResultsClients, setShowSearchResultsClients] =
    useState(false);

  const clientNames = selectedClients.map((client) => client.nombre);
  const [timerActive, setTimerActive] = useState(false);
  const [timerDuration, setTimerDuration] = useState(0);
  const [timerIntervalId, setTimerIntervalId] = useState(null);
  const { username } = useParams();

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };
  

  const handleTaskChange = (event) => {
    setTask(event.target.value);
  };

  const handleStartTimer = async () => {
    try {
      if (!timerActive) {
        const startTime = new Date().toISOString();
        let projectId;
        let clientId;

        // if (project.cliente) {
        //   const allClientsResponse = await axios.get(
        //     `https://api.clockify.me/api/v1/workspaces/${process.env.REACT_APP_WORKSPACE_CLOCKIFY}/clients`,
        //     {
        //       headers: {
        //         "Content-Type": "application/json",
        //         "X-Api-Key": process.env.REACT_APP_CLOCKIFY_API_KEY,
        //       },
        //     }
        //   );

        //   const existingClient = allClientsResponse.data.find(
        //     (client) => client.name === project.cliente
        //   );

        //   if (existingClient) {
        //     clientId = existingClient.id;
        //   } else {
        //     const projectClient = await axios.post(
        //       `https://api.clockify.me/api/v1/workspaces/${process.env.REACT_APP_WORKSPACE_CLOCKIFY}/clients`,
        //       { name: project.cliente },
        //       {
        //         headers: {
        //           "Content-Type": "application/json",
        //           "X-Api-Key": process.env.REACT_APP_CLOCKIFY_API_KEY,
        //         },
        //       }
        //     );
        //     clientId = projectClient.data.id;
        //   }
        // }

        const allProjectsResponse = await axios.get(
          `https://api.clockify.me/api/v1/workspaces/${process.env.REACT_APP_WORKSPACE_CLOCKIFY}/projects`,
          {
            headers: {
              "Content-Type": "application/json",
              "X-Api-Key": process.env.REACT_APP_CLOCKIFY_API_KEY,
            },
          }
        );

        const existingProject = allProjectsResponse.data.find(
          (p) => p.name === project.nombreProyecto
        );

        if (existingProject) {
          projectId = existingProject.id;
        } else {
          const projectResponse = await axios.post(
            `https://api.clockify.me/api/v1/workspaces/${process.env.REACT_APP_WORKSPACE_CLOCKIFY}/projects`,
            { name: project.nombreProyecto },
            {
              headers: {
                "Content-Type": "application/json",
                "X-Api-Key": process.env.REACT_APP_CLOCKIFY_API_KEY,
              },
            }
          );
          projectId = projectResponse.data.id;
        }

        if (projectId) {
          const response = await clockify.startTimeEntry(
            startTime,
            projectId,
            clientId,
            task + " | " + username
          );

          console.log("Entrada de tiempo iniciada:", response.data);
          console.log("projectId:", projectId);
          setTimerActive(true);
          const intervalId = setInterval(() => {
            const elapsedTime =
              new Date().getTime() - new Date(startTime).getTime();
            setTimerDuration(elapsedTime);
          }, 1000);
          setTimerIntervalId(intervalId);
          setsuccessMessage("Entrada de tiempo iniciada correctamente");
          setTimeout(() => setsuccessMessage(""), 3000);
        } else {
          console.error("Error al obtener o crear el cliente o el proyecto.");
        }
      } else {
        clearInterval(timerIntervalId);
        setTimerActive(false);
        setTimerIntervalId(null);
        setTimerDuration(0);
      }
    } catch (error) {
      console.error("Error al iniciar la entrada de tiempo:", error);
      setErrorMessage(
        "Error al iniciar la entrada de tiempo. Por favor, inténtalo de nuevo más tarde."
      );
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleStopTimer = async () => {
    try {
      if (timerActive) {
        clearInterval(timerIntervalId);
        setTimerActive(false);
        setTimerIntervalId(null);
        const response = await axios.patch(
          `https://api.clockify.me/api/v1/workspaces/${process.env.REACT_APP_WORKSPACE_CLOCKIFY}/user/${process.env.REACT_APP_USER_CLOCKIFY}/time-entries/`,
          {
            end: new Date().toISOString(),
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-Api-Key": process.env.REACT_APP_CLOCKIFY_API_KEY,
            },
          }
        );
        console.log("Entrada de tiempo detenida:", response.data);
        console.log(timerDuration);
        clearInterval(timerIntervalId);
        setTimerActive(false);
        setTimerIntervalId(null);

        // eslint-disable-next-line
        const timeData = { time: timerDuration };
        const totalTime = timerDuration + project.time;
        const totalTimeData = { time: totalTime };

        const timeMS = await fetch(
          `${process.env.REACT_APP_BACKEND_MICROSERVICIOS}/repo/time/${project.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify(totalTimeData),
          }
        );

        if (timeMS.ok) {
          console.log("Tiempo contado:", timerDuration);
          console.log(project.time);
          console.log(totalTimeData);
          setTimerDuration(0);
        }
      }
    } catch (error) {
      console.error("Error al detener la entrada de tiempo:", error);
    }
  };

  useEffect(() => {
    const fetchClientsAll = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_MICROSERVICIOS}/cliente/name`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data.data);
          setSearchResultsClients(data.data);
        } else {
          console.error("Error fetching clients:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClientsAll();
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_MICROSERVICIOS}/repo/cliente/project/${project.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const client = data.data.cliente;
          if (typeof client === "string") {
            const clientsArray = client.split(",").map((name, index) => ({
              id: index + 1,
              nombre: name.trim(),
            }));
            setSelectedClients(clientsArray);
          } else {
            console.error("Data is not a string:", client);
          }
        } else {
          console.error("Error fetching client:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching client:", error);
      }
    };

    if (project.id) {
      fetchClients();
    }
  }, [project.id]);

  const handleSelectClient = (client) => {

    if (project.autor !== username) {
      setErrorMessage("No puedes agregar a otros clientes.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const isClientSelected = selectedClients.some(
      (selectedClient) => selectedClient.id === client.id
    );

    if (!isClientSelected) {
      const updatedClients = [...selectedClients, client];
      setSelectedClients(updatedClients);
    } else {
      setErrorMessage("El cliente ya está añadido.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleSearchInputChangeClients = (event) => {
    const query = event.target.value;
    setSearchQueryClients(query);
    setShowSearchResultsClients(true);
  };

  const handleRemoveClient = async (client) => {

    if (project.autor !== username) {
      setErrorMessage("No puedes eliminar a otros clientes.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const updatedClients = selectedClients.filter(
      (item) => item.id !== client.id
    );
    setSelectedClients(updatedClients);
    localStorage.setItem("selectedClients", JSON.stringify(updatedClients));
  };

  const handleSaveClients = async () => {
    try {
      let clientNamesArray;

      if (project.autor !== username) {
        setErrorMessage("No puedes guardar a otros clientes.");
        setTimeout(() => setErrorMessage(""), 3000);
        return;
      }
  
      if (selectedClients.length > 0) {
        clientNamesArray = selectedClients.map(client => client.nombre).join(", ");
      } else {
        clientNamesArray = null;
      }
  
      const requestBody = {
        cliente: clientNamesArray,
      };
  
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_MICROSERVICIOS}/repo/cliente/project/${project.id}`,
        JSON.stringify(requestBody),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status >= 200 && response.status < 300) {
        console.log(clientNamesArray);
        console.log("Clientes guardados correctamente");
        setsuccessMessage("Cliente/s guardado correctamente");
        setTimeout(() => setsuccessMessage(""), 5000);
      } else {
        console.error("Error al guardar clientes:", response.statusText);
        setErrorMessage("Error al guardar clientes");
        setTimeout(() => setErrorMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error al guardar clientes:", error);
      setErrorMessage("Error al guardar clientes");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };
  

  const filteredClients = Array.isArray(searchResultsClients)
    ? searchResultsClients.filter((client) => {
        const isSelected = selectedClients.some(
          (selected) => selected.id === client.id
        );
        const matchesSearchQuery = client.nombre
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return !isSelected && matchesSearchQuery;
      })
    : [];

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_MICROSERVICIOS}/staff/name`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data.data);
          setSearchResults(data.data);
        } else {
          console.error("Error fetching staff:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchStaff();
  }, []);

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_MICROSERVICIOS}/repo/colaborador/project/${project.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          console.log(data.data);
          const collaboratorsData = data.data.colaboradores;
          if (typeof collaboratorsData === "string") {
            const collaboratorsArray = collaboratorsData
              .split(",")
              .map((name, index) => ({
                id: index + 1,
                nombre: name.trim(),
              }));
            setSelectedCollaborators(collaboratorsArray);
          } else {
            console.error("Data is not a string:", collaboratorsData);
          }
        } else {
          console.error("Error fetching collaborators:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching collaborators:", error);
      }
    };

    if (project.id) {
      fetchCollaborators();
    }
  }, [project.id]);

  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setShowSearchResults(true); 
  };

  const handleSelectCollaborator = (staff) => {
    if (project.autor !== username) {
      setErrorMessage("No puedes agregar a otros colaboradores.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
  
    const isCollaboratorSelected = selectedCollaborators.some(
      (collaborator) => collaborator.nombre === staff.nombre
    );
    console.log("isCollaboratorSelected:", isCollaboratorSelected);
  
    if (!isCollaboratorSelected) {
      const updatedCollaborators = [...selectedCollaborators, staff];
      setSelectedCollaborators(updatedCollaborators);
      localStorage.setItem(
        "selectedCollaborators",
        JSON.stringify(updatedCollaborators)
      );
    } else {
      setErrorMessage("El colaborador ya está añadido.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };
  

  const handleRemoveCollaborator = (collaborator) => {
      const updatedSelectedCollaborators = selectedCollaborators.filter(
        (c) => c.id !== collaborator.id
      );
      setSelectedCollaborators(updatedSelectedCollaborators);

      const collaboratorsString = updatedSelectedCollaborators
        .map((c) => c.nombre)
        .join(", ");
      const requestData = {
        collaborator: collaboratorsString,
      };

      fetch(
        `${process.env.REACT_APP_BACKEND_MICROSERVICIOS}/repo/collaborator/project/${project.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(requestData),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Collaborator actualizado:", data);
        })
        .catch((error) => {
          console.error("Error al actualizar el collaborator:", error);
        });

  };

  const handleSaveCollaborators = async () => {
    try {
      let collaboratorNamestring;

      if (selectedCollaborators.length > 0) {
        collaboratorNamestring = collaboratorNames.join(", ");
      } else {
        collaboratorNamestring = null;
      }

      const requestBody = {
        colaboradores: collaboratorNamestring,
      };

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_MICROSERVICIOS}/repo/colaborador/project/${project.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        console.log(collaboratorNamestring);
        console.log("Colaboradores guardados correctamente");
        setsuccessMessage("Colaborador/es guardado correctamente");
        setTimeout(() => setsuccessMessage(""), 5000);
      } else {
        console.error("Error al guardar colaboradores:", response.statusText);
        setErrorMessage("Error al guardar colaboradores");
        setTimeout(() => setErrorMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error al guardar colaboradores:", error);
      setErrorMessage("Error al guardar colaboradores");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const filteredStaff = searchResults.filter((staff) =>
    staff.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isEndDateNear = () => {
    const endDate = new Date(project.fechaFinalizacion);
    const currentDate = new Date();
    const differenceInDays = Math.ceil(
      (endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
    );
    return differenceInDays <= 7;
  };

  const isEndDatePassed = () => {
    const endDate = new Date(project.fechaFinalizacion);
    const currentDate = new Date();
    return endDate < currentDate;
  };

  const renderProjectStatus = () => {
    if (isEndDatePassed()) {
      return (
        <div id="warning-message" role="alert" className="alert alert-error">
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
          <span>Proyecto finalizado</span>
        </div>
      );
    } else if (isEndDateNear()) {
      return (
        <div id="warning-message" role="alert" className="alert alert-warning">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>
            <strong>¡Atención!</strong> La fecha de finalización del proyecto
            está cerca
          </span>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="project-details">
      <button className="close-button" onClick={onClose}>
        <AiFillCloseCircle />
      </button>
      <Columna1
        project={project}
        handleTaskChange={handleTaskChange}
        handleStartTimer={handleStartTimer}
        handleStopTimer={handleStopTimer}
        timerDuration={timerDuration}
        formatTime={formatTime}
        errorMessage={errorMessage}
        successMessage={successMessage}
      />

      <Columna2 selectedCollaborators={selectedCollaborators}
      project={project}
      username={username} />

      <Columna3
        project={project}
        onDownload={onDownload}
        onEdit={onEdit}
        onDelete={onDelete}
        renderProjectStatus={renderProjectStatus}
        selectedClients={selectedClients}
        username={username}
      />

      <ModalClientes
        id="modal-client"
        title="Clientes"
        searchQuery={searchQueryClients}
        handleSearchInputChange={handleSearchInputChangeClients}
        showSearchResults={showSearchResultsClients}
        filteredData={filteredClients}
        handleSelectItem={handleSelectClient}
        selectedItems={selectedClients}
        handleRemoveItem={handleRemoveClient}
        errorMessage={errorMessage}
        successMessage={successMessage}
        handleSave={handleSaveClients}
      />

      <Modal
        id="modal"
        title="Colaboradores"
        searchQuery={searchQuery}
        handleSearchInputChange={handleSearchInputChange}
        showSearchResults={showSearchResults}
        filteredData={filteredStaff}
        handleSelectItem={handleSelectCollaborator}
        selectedItems={selectedCollaborators}
        handleRemoveItem={handleRemoveCollaborator}
        errorMessage={errorMessage}
        successMessage={successMessage}
        handleSave={handleSaveCollaborators}
      />
    </div>
  );
};

export default ProjectDetails;
