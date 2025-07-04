import axios from 'axios';

const API_URL = 'http://localhost:4000/api'; // Ajusta según tu backend

const getToken = () => localStorage.getItem('token');

export const obtenerEventos = async (page  , limit, fecha = "") => {
  const response = await axios.get(`${API_URL}/eventos`, {
    params: {
      page, 
      limit,
      fecha,
    },
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  console.log(response)
  return response.data;
};

export const crearEvento = async (evento) => {
  const response = await axios.post(`${API_URL}/eventos`, evento, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};

export const actualizarEvento = async (id, evento) => {
  const response = await axios.put(`${API_URL}/eventos/${id}`, evento, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};

export const eliminarEvento = async (id) => {
  const response = await axios.delete(`${API_URL}/eventos/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};
