import axios from 'axios';

const API_URL = 'http://localhost:4000/api'; // Ajusta si es necesario

export const login = async (correo, contrasena) => {
  const response = await axios.post(`${API_URL}/auth/login`, { correo, contrasena });
  return response.data;
};