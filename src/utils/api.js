import axios from "axios";

const BASE_URL = "http://localhost:5074/api";

//** Task management API Methods **/
export const fetchTasks = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Tasks/tasks`);
    return response.data; 
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to fetch Tasks." };
  }
};

export const addTasks = async (newTask) => {
  try {
    const response = await axios.post(`${BASE_URL}/Tasks`, newTask);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to add Task." };
  }
};

export const EditTasks = async (id, updatedTask) => {
  try {
    const response = await axios.put(`${BASE_URL}/Tasks/id/${id}`, updatedTask);
    return response.data;
  }catch(error){
    throw error.response ? error.response.data : { message: "Failed to update Task."};
  }
};

export const deleteTask = async (Id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/Tasks/id/${Id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to delete client." };
  }
};

// ** Clients API Methods **
export const fetchClients = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Settings/clients`);
    return response.data; 
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to fetch clients." };
  }
};

export const addClient = async (clientData) => {
  try {
    const response = await axios.post(`${BASE_URL}/Settings/clients`, clientData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to add client." };
  }
};

// export const deleteClient = async (clientId) => {
//   try {
//     const response = await axios.delete(`${BASE_URL}/Settings/clients/${clientId}`);
//     return response.data;
//   } catch (error) {
//     throw error.response ? error.response.data : { message: "Failed to delete client." };
//   }
// };

// ** Departments API Methods **
export const fetchDepartments = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Settings/departments`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to fetch departments." };
  }
};

export const addDepartment = async (departmentData) => {
  try {
    const response = await axios.post(`${BASE_URL}/Settings/departments`, departmentData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to add client." };
  }
};

// ** categories API Methods **
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Settings/categories`);
    return response.data; // Return the fetched data
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to fetch categories." };
  }
};

export const addCategories = async (categoryData) => {
  try {
    const response = await axios.post(`${BASE_URL}/Settings/categories`, categoryData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to add client." };
  }
};

// ** Roles API Methods **
export const fetchRoles = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Settings/roles`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to fetch roles." };
  }
};

export const addRole = async (roleData) => {
  try {
    const response = await axios.post(`${BASE_URL}/Settings/roles`, roleData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to add client." };
  }
};

// ** Access Rights API Methods **
export const fetchAccessRights = async (role) => {
  try {
    const response = await axios.get(`${BASE_URL}/Users/get-access-by-role/${role}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to fetch access rights." };
  }
};

export const saveAccessRights = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/Users/save-access-by-role`, payload);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Failed to save access rights." };
  }
};


// ** login API methods **
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/Users/login`, { username, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Login failed" };
  }
};
