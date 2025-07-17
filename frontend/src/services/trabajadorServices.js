import axios from "axios";
const API_URL = "http://localhost:4000/api"; // Ajusta según tu backend
const getToken = () => localStorage.getItem("token");

export const obtenerTrabajadores = async ({
  page = 1,
  limit = 5,
  busqueda = "",
}) => {
  const response = await axios.get(`${API_URL}/trabajadores`, {
    params: { page, limit, busqueda },
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const crearTrabajador = async (trabajador) => {
  const response = await axios.post(`${API_URL}/usuarios`, trabajador, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const actualizarTrabajador = async (id, trabajador) => {
  const response = await axios.put(`${API_URL}/usuarios/${id}`, trabajador, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const eliminarTrabajador = async (id) => {
  const response = await axios.delete(`${API_URL}/usuarios/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const asignarTrabajadorEvento = async (eventoId, trabajadores) => {
  try {
    await axios.post(
      `${API_URL}/trabajadores/asignar-evento`,
      {
        trabajadores,
        eventoId,
        
      },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    alert("Trabajador asignado con éxito");
  } catch (err) {
    console.error("Error asignando trabajador:", err);
  }
};

export const obtenerTrabajadoresDisponibles = async () => {
  const response = await axios.get(`${API_URL}/trabajadores/disponibles`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response;
};


