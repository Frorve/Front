import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AiFillCloseCircle } from "react-icons/ai";
import Columna1 from "./Columna1";
import Columna2 from "./Columna2";
import Columna3 from "./Columna3";
import Modal from "./Modal";
import "./styles/Details.css";
import axios from "axios";

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
  const [timeEntryId, setTimeEntryId] = useState(null);
  const [duracionProyecto, setDuracionProyecto] = useState(null);
  const { username } = useParams();
  const [projectId, setProjectId] = useState(null);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const convertirSegundosAHorasMinutosSegundos = (duracionSegundos) => {
    const horas = Math.floor(duracionSegundos / 3600);
    const minutos = Math.floor((duracionSegundos % 3600) / 60);
    const segundos = duracionSegundos % 60;

    return `${horas} horas ${minutos} minutos ${segundos} segundos`;
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

        if (project.cliente) {
          const allClientsResponse = await axios.get(
            "https://api.clockify.me/api/v1/workspaces/662f3bdccdbdaa6762287ea7/clients",
            {
              headers: {
                "Content-Type": "application/json",
                "X-Api-Key": process.env.REACT_APP_CLOCKIFY_API_KEY,
              },
            }
          );

          const existingClient = allClientsResponse.data.find(
            (client) => client.name === project.cliente
          );

          if (existingClient) {
            clientId = existingClient.id;
          } else {
            const projectClient = await axios.post(
              "https://api.clockify.me/api/v1/workspaces/662f3bdccdbdaa6762287ea7/clients",
              { name: project.cliente },
              {
                headers: {
                  "Content-Type": "application/json",
                  "X-Api-Key": process.env.REACT_APP_CLOCKIFY_API_KEY,
                },
              }
            );
            clientId = projectClient.data.id;
          }
        }

        const allProjectsResponse = await axios.get(
          "https://api.clockify.me/api/v1/workspaces/662f3bdccdbdaa6762287ea7/projects",
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
            "https://api.clockify.me/api/v1/workspaces/662f3bdccdbdaa6762287ea7/projects",
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

        const response = await axios.post(
          "https://api.clockify.me/api/v1/workspaces/662f3bdccdbdaa6762287ea7/time-entries",
          {
            start: startTime,
            projectId: projectId,
            clientId: clientId,
            description: task + " | " + username,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-Api-Key": process.env.REACT_APP_CLOCKIFY_API_KEY,
            },
          }
        );

        console.log("Entrada de tiempo iniciada:", response.data);
        setTimerActive(true);
        setTimeEntryId(response.data.id);
        const intervalId = setInterval(() => {
          const elapsedTime =
            new Date().getTime() - new Date(startTime).getTime();
          setTimerDuration(elapsedTime);
        }, 1000);
        setTimerIntervalId(intervalId);
        setsuccessMessage("Entrada de tiempo iniciada correctamente");
        setTimeout(() => setsuccessMessage(""), 3000);
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
          `https://api.clockify.me/api/v1/workspaces/662f3bdccdbdaa6762287ea7/user/662f3bdccdbdaa6762287ea6/time-entries/`,
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
        clearInterval(timerIntervalId);
        setTimerActive(false);
        setTimerIntervalId(null);
        setTimerDuration(0);
      }
    } catch (error) {
      console.error("Error al detener la entrada de tiempo:", error);
    }
  };

  const obtenerDuracionProyecto = async (projectId) => {
    try {
      const response = await axios.get(
        `https://api.clockify.me/api/v1/workspaces/662f3bdccdbdaa6762287ea7/projects/${projectId}/time-entries`,
        {
          headers: {
            "X-Api-Key": process.env.REACT_APP_CLOCKIFY_API_KEY,
          },
        }
      );
      const duracionTotal = response.data.reduce(
        (total, entry) => total + entry.timeInterval.duration,
        0
      );

      return convertirSegundosAHorasMinutosSegundos(duracionTotal);
    } catch (error) {
      console.error(
        "Error al obtener los detalles de las entradas de tiempo del proyecto:",
        error
      );
      return null;
    }
  };

  useEffect(() => {
    const fetchDuracionProyecto = async () => {
      const duracion = await obtenerDuracionProyecto(projectId);
      setDuracionProyecto(duracion);
    };

    fetchDuracionProyecto();
  }, [projectId]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/cliente/all`
        );
        if (response.ok) {
          const data = await response.json();
          setSearchResultsClients(data);
        } else {
          console.error("Error fetching clients:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const storedClients = localStorage.getItem("selectedClients");
    if (storedClients) {
      setSelectedClients(JSON.parse(storedClients));
    }
  }, []);

  const handleSelectClient = (client) => {
    if (!selectedClients.some((selected) => selected.id === client.id)) {
      const updatedClients = [...selectedClients, client];
      setSelectedClients(updatedClients);
      localStorage.setItem("selectedClients", JSON.stringify(updatedClients));
    }
  };

  const handleSearchInputChangeClients = (event) => {
    const query = event.target.value;
    setSearchQueryClients(query);
    if (query.trim() !== "") {
      setShowSearchResultsClients(true);
    } else {
      setShowSearchResultsClients(false);
    }
  };

  const handleRemoveClient = async (client) => {
    const updatedClients = selectedClients.filter(
      (item) => item.id !== client.id
    );
    setSelectedClients(updatedClients);
    localStorage.setItem("selectedClients", JSON.stringify(updatedClients));

    console.log("Cliente a eliminar:", client);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/repo/${client.id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        console.log("Cliente eliminado correctamente de la base de datos");
      } else {
        console.error(
          "Error al eliminar cliente de la base de datos:",
          response.statusText
        );
        setErrorMessage("Error al eliminar cliente de la base de datos");
        setTimeout(() => setErrorMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error al eliminar cliente de la base de datos:", error);
      setErrorMessage("Error al eliminar cliente de la base de datos");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleSaveClients = async () => {
    try {
      const clientNamesString = clientNames.join(", ");

      const formData = new FormData();
      formData.append("cliente", clientNamesString);

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/repo/${project.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
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

  const filteredClients = searchResultsClients.filter(
    (client) =>
      !selectedClients.some((selected) => selected.id === client.id) &&
      client.nombre.toLowerCase().includes(searchQuery.toLowerCase())
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

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/staff`
        );
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
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
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/repo/collaborators/${project.id}`);
        if (response.status === 200) {
          setSelectedCollaborators(response.data);
          console.log(response.data);
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
    if (query.trim() !== "") {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleSelectCollaborator = (staff) => {
    if (
      !selectedCollaborators.some(
        (collaborator) => collaborator.id === staff.id
      )
    ) {
      const updatedCollaborators = [...selectedCollaborators, staff];
      setSelectedCollaborators(updatedCollaborators);
      localStorage.setItem(
        "selectedCollaborators",
        JSON.stringify(updatedCollaborators)
      );
    }
  };

  const handleRemoveCollaborator = async (staff) => {
    const updatedCollaborators = selectedCollaborators.filter(
      (item) => item.id !== staff.id
    );
    setSelectedCollaborators(updatedCollaborators);
    localStorage.setItem(
      "selectedCollaborators",
      JSON.stringify(updatedCollaborators)
    );

    console.log("Colaborador a eliminar:", staff);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/repo/${staff.id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        console.log("Colaborador eliminado correctamente de la base de datos");
      } else {
        console.error(
          "Error al eliminar colaborador de la base de datos:",
          response.statusText
        );
        setErrorMessage("Error al eliminar colaborador de la base de datos");
        setTimeout(() => setErrorMessage(""), 5000);
      }
    } catch (error) {
      console.error(
        "Error al eliminar colaborador de la base de datos:",
        error
      );
      setErrorMessage("Error al eliminar colaborador de la base de datos");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleSaveCollaborators = async () => {
    try {
      const collaboratorNamesString = collaboratorNames.join(", ");

      const formData = new FormData();
      formData.append("colaboradores", collaboratorNamesString);

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/repo/${project.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
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

  const filteredStaff = searchResults.filter((staff) => {
    const isSelected = selectedCollaborators.some((selected) => selected.id === staff.id);
    const matchesSearchQuery = staff.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    return !isSelected && matchesSearchQuery;
  });
  

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

      <Columna2 selectedCollaborators={selectedCollaborators} />

      <Columna3
        project={project}
        onDownload={onDownload}
        onEdit={onEdit}
        onDelete={onDelete}
        renderProjectStatus={renderProjectStatus}
      />

      <Modal
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
