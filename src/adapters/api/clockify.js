import axios from 'axios';

const clockifyAPI = axios.create({
  baseURL: 'https://api.clockify.me/api/v1/',
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': process.env.REACT_APP_CLOCKIFY_API_KEY,
  },
});

export const fetchAllClients = async () => {
  try {
    const response = await clockifyAPI.get(`workspaces/${process.env.REACT_APP_WORKSPACE_CLOCKIFY}/clients`);
    return response.data;
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

export const createClient = async (name) => {
  try {
    const response = await clockifyAPI.post(`workspaces/${process.env.REACT_APP_WORKSPACE_CLOCKIFY}/clients`, { name });
    return response.data;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

export const startTimeEntry = async (startTime, projectId, clientId, description) => {
    try {
      const response = await clockifyAPI.post(`workspaces/${process.env.REACT_APP_WORKSPACE_CLOCKIFY}/time-entries`,
        {
          start: startTime,
          projectId: projectId,
          clientId: clientId,
          description: description
        },
        );
      return response.data;
    } catch (error) {
      console.error("Error starting time entry:", error);
      throw error;
    }
  };
  

  export const createProject = async (projectName) => {
    try {
      const projectResponse = await clockifyAPI.post(
        `workspaces/${process.env.REACT_APP_WORKSPACE_CLOCKIFY}/projects`,
        { name: projectName },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": process.env.REACT_APP_CLOCKIFY_API_KEY,
          },
        }
      );
  
      return projectResponse.data;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error; 
    }
  };

  export const fetchAllProjects = async () => {
    try {
      const allProjectsResponse = await axios.get(
        `https://api.clockify.me/api/v1/workspaces/${process.env.REACT_APP_WORKSPACE_CLOCKIFY}/projects`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": process.env.REACT_APP_CLOCKIFY_API_KEY,
          },
        }
      );
      return allProjectsResponse.data;
    } catch (error){
      console.error("Error fetching all projects:", error);
      throw error;
    }
  };


export default {
  fetchAllClients,
  createClient,
  startTimeEntry,
  createProject,
  fetchAllProjects,
};
