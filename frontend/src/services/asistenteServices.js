import axios from "axios";

const API_URL = "http://localhost:4000/api"; // Ajusta según tu backend

const getToken = () => localStorage.getItem("token");

export const crearAsistente = async (asistente) => {
  try {
    const response = await axios.post(`${API_URL}/asistente`, asistente, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear asistente:", error.response?.data || error);
    throw error;
  }
};

export const obtenerAsistentes = async (eventoId) => {
  try {
    const response = await axios.get(`${API_URL}/asistente`, {
      params: { eventoId },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    console.log("respuesta: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al obtener asistentes:", error);
    throw error;
  }
};

export const obtenerAsistentePorEventoYId = async (eventoId, asistenteId) => {
  try {
    const response = await axios.get(`${API_URL}/asistente/filtrar`, {
      params: { eventoId, asistenteId },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener asistente por evento e ID:", error.response?.data || error);
    throw error;
  }
};
export const eliminarAsistente = async (asistenteId, eventoId) => {
  try {
    const response = await axios.delete(`${API_URL}/asistente/eliminar`, {
      params: { asistenteId, eventoId },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar asistente:", error.response?.data || error);
    throw error;
  }
};

export const registrarPagoAsistente = async (eventoId, asistenteId, pagoData) => {
  try {
    const response = await axios.post(
      `${API_URL}/asistente/${eventoId}/${asistenteId}/pago`,
      pagoData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al registrar pago:", error.response?.data || error);
    throw error;
  }
};
