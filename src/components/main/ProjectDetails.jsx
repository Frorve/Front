import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { AiFillCloseCircle } from "react-icons/ai";
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
    const storedCollaborators = localStorage.getItem("selectedCollaborators");
    if (storedCollaborators) {
      setSelectedCollaborators(JSON.parse(storedCollaborators));
    }
  }, []);

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

  const filteredStaff = searchResults.filter(
    (staff) =>
      !selectedCollaborators.some((selected) => selected.id === staff.id) &&
      staff.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="project-details">
      <button className="close-button" onClick={onClose}>
        <AiFillCloseCircle />
      </button>
      <div className="columa1">
        <div className="detail-nombre">
          <strong>Nombre: </strong>
          <p>{project.nombreProyecto}</p>
        </div>

        <div className="detail-descripcion">
          <strong>Descripción: </strong>

          <p>{project.descripcion}</p>
        </div>

        <div className="detail-inicio">
          <strong>Fecha de inicio: </strong>
          <div className="fecha-container">
            <p>{project.fechaInicio}</p>
          </div>
        </div>

        <div className="detail-inicio">
          <strong>Fecha de finalización: </strong>
          <div className="fecha-container">
            <p>{project.fechaFinalizacion}</p>
          </div>
        </div>

        <button
          id="clock"
          className="btn btn-info"
          onClick={() => document.getElementById("my_modal_3").showModal()}
        >
          Clockify
        </button>
        <dialog id="my_modal_3" className="modal">
          <div id="select-work" className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">¿En que estás trabajando?</h3>
            <input
              type="text"
              placeholder="Escribe aquí"
              onChange={handleTaskChange}
              className="input input-bordered w-full max-w-xs"
              maxLength={50}
              required
            />
            <br />
            <button
              id="timer"
              className="btn btn-success"
              onClick={handleStartTimer}
            >
              Iniciar Timer
            </button>
            <br />
            <br />
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
            {successMessage && (
              <div role="alert" className="alert alert-success">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}
          </div>
        </dialog>

        <button id="stop" className="btn btn-error" onClick={handleStopTimer}>
          Detener Timer
        </button>

        <div id="time" role="alert" className="alert">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-info shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <strong>Tiempo transcurrido: </strong>
          <span>{formatTime(timerDuration)}</span>
        </div>
      </div>

      <div className="columna2">
        <div className="detail-colaborador">
          <strong>Colaboradores: </strong>
          <div className="caja">
            {selectedCollaborators.map((staff, index) => (
              <p key={index}>
                {" "}
                <div className="w-10 rounded-full">
                  <img
                    alt="User Avatar"
                    src="https://cdn-icons-png.freepik.com/512/64/64572.png"
                  />
                </div>{" "}
                {staff.nombre}
                {/* <button id="remove-colab" className="btn btn-sm btn-circle btn-error">✕</button> */}
              </p>
            ))}
          </div>
        </div>
        <div className="detail-colab">
          <button
            className="btn btn-neutral"
            onClick={() => document.getElementById("modal").showModal()}
          >
            Añadir/Eliminar colaboradores
          </button>
        </div>
      </div>

      <div className="columna3">
        <div className="detail-autor">
          <strong>Cliente: </strong>
          {project.cliente ? (
            <p>{project.cliente}</p>
          ) : (
            <p>No hay cliente asociado</p>
          )}
          <button
            className="btn"
            id="modal-cliente"
            onClick={() => document.getElementById("modal-client").showModal()}
          >
            Asignar Cliente
          </button>
        </div>

        <div className="detail-autor">
          <strong>Propietario: </strong>

          <p>{project.autor}</p>
        </div>

        {project.archivo && (
          <div className="detail-archivo">
            <strong>Archivo: </strong>
            <p>Disponible{project.nombreArchivo}</p>
            <button id="down" className="btn btn-wide" onClick={onDownload}>
              Descargar archivo <FiDownload />
            </button>
          </div>
        )}

        <div className="project-actions">
          <button id="edit" className="btn btn-wide" onClick={onEdit}>
            Editar <FaEdit />
          </button>
          <button id="Sup" className="btn btn-wide" onClick={onDelete}>
            Borrar <FaTrash />
          </button>
        </div>

        <div id="tiempo-empleado" role="alert" className="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>
            Tiempo empleado en el proyecto: <strong>00:12:48</strong>
          </span>{" "}
          {}
        </div>

        {renderProjectStatus()}
      </div>

      <dialog id="modal-client" className="modal">
        <div className="modal-box w-full max-w-5xl">
          <button
            className="close-button"
            onClick={() => document.getElementById("modal-client").close()}
          >
            <AiFillCloseCircle />
          </button>
          <h2>
            <strong>Buscar Clientes</strong>
          </h2>
          <br />
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow"
              placeholder="Buscar clientes..."
              value={searchQueryClients}
              onChange={handleSearchInputChangeClients}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          <br />
          {showSearchResultsClients && (
            <ul className="search-results">
              {filteredClients.map((client) => (
                <li key={client.id} onClick={() => handleSelectClient(client)}>
                  {client.nombre}
                </li>
              ))}
            </ul>
          )}
          <br />
          <h3>
            <strong>Clientes Seleccionados:</strong>{" "}
          </h3>
          <br />
          <ul className="client-list">
            {" "}
            {selectedClients.map((client) => (
              <li key={client.id}>
                {" "}
                {client.nombre}
                <button
                  id="remove"
                  className="btn btn-xs btn-error"
                  onClick={() => handleRemoveClient(client)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          <br />
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
          {successMessage && (
            <div role="alert" className="alert alert-success">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}
          <br />
          <button className="btn" onClick={handleSaveClients}>
            Guardar Clientes
          </button>
        </div>
      </dialog>

      <dialog id="modal" className="modal">
        <div className="modal-box w-full max-w-5xl">
          <button
            className="close-button"
            onClick={() => document.getElementById("modal").close()}
          >
            <AiFillCloseCircle />
          </button>
          <h2>
            <strong>Añadir colaboradores</strong>
          </h2>
          <br />
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow"
              placeholder="Buscar colaboradores..."
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          <br />
          {showSearchResults && (
            <ul className="search-results">
              {filteredStaff.map((staff) => (
                <li
                  key={staff.id}
                  onClick={() => handleSelectCollaborator(staff)}
                >
                  {staff.nombre}
                </li>
              ))}
            </ul>
          )}
          <br />
          <div className="selected-collaborators">
            <h3>
              <strong>Colaboradores Seleccionados:</strong>{" "}
            </h3>
            <br />
            <ul className="collaborator-list">
              {" "}
              {selectedCollaborators.map((staff) => (
                <li key={staff.id}>
                  {" "}
                  {staff.nombre}
                  <button
                    id="remove"
                    className="btn btn-xs btn-error"
                    onClick={() => handleRemoveCollaborator(staff)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <br />
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
          {successMessage && (
            <div role="alert" className="alert alert-success">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}
          <br />
          <button className="btn" onClick={handleSaveCollaborators}>
            Guardar Colaboradores
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default ProjectDetails;
