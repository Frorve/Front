import axios from 'axios';

const backendAPI = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

export const loginUser = async (username, password) => {
  try {
    const response = await backendAPI.post('/auth/login', {
      nombre: username,
      contraseña: password,
    });
    return response;
  } catch (error) {
    throw new Error(error.response.data.message || "Error al iniciar sesión");
  }
}

export const registerUser = async (username, mail, password) => {
  try {
    const response = await backendAPI.post('/auth/register', {
      nombre: username,
      cargo: "Staff",
      correoElectronico: mail,
      contraseña: password,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchRepos = async (username) => {
  try {
    const currentUserResponse = await backendAPI.get(`/repo/${username}`);
    if (currentUserResponse.status === 200) {
      const currentUserData = currentUserResponse.data;
      return currentUserData;
    }

    const collaboratorResponse = await backendAPI.get(`/repo/collaborator-repos/${username}`);
    if (collaboratorResponse.status === 200) {
      const collaboratorData = collaboratorResponse.data;
      return collaboratorData;
    }
  } catch (error) {
    console.error("Error fetching repos:", error);
    throw error;
  }
};

export const createCliente = async (clienteData) => {
  try {
    const response = await backendAPI.post("/cliente", clienteData);
    if (response.status === 200 || response.status === 201) {
      console.log("Cliente creado exitosamente");
      return true;
    } else {
      throw new Error("Error al crear cliente");
    }
  } catch (error) {
    console.error("Error al crear cliente:", error);
    throw error;
  }
};

export default {
  registerUser,
  loginUser,
  fetchRepos,
  createCliente,
};
