import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api', // Cambia según tu backend
});

export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (data) => api.post('/auth/register', data);
