// controllers/evento.controller.js
import mongoose from "mongoose";
import Evento from "../models/Evento.js";
import Asistente from "../models/Asistente.js";

// Crear un nuevo evento
export const crearEvento = async (req, res) => {
  try {
    const nuevoEvento = new Evento(req.body);
    await nuevoEvento.save();
    res.status(201).json(nuevoEvento);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear el evento", error });
  }
};

// Obtener todos los eventos
// Obtener todos los eventos con trabajadores y asistentes
export const obtenerEventos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const fecha = req.query.fecha;

    const filtro = {};

    if (fecha) {
      const fechaInicio = new Date(fecha);
      fechaInicio.setHours(0, 0, 0, 0);

      const fechaFin = new Date(fecha);
      fechaFin.setHours(23, 59, 59, 999);

      filtro.fecha = {
        $gte: fechaInicio,
        $lte: fechaFin,
      };
    }

    const total = await Evento.countDocuments(filtro);

    const eventos = await Evento.aggregate([
      { $match: filtro },
      { $sort: { fecha: 1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "asistentes",
          localField: "_id",
          foreignField: "evento",
          as: "asistentes",
        },
      },
      {
        $lookup: {
          from: "usuarios", // aquí cambia 'trabajadores' por 'usuarios'
          localField: "trabajadores",
          foreignField: "_id",
          as: "trabajadores",
        },
      },
    ]);

    res.json({
      eventos,
      totalEventos: total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener eventos", error });
  }
};

// Obtener eventos por trabajador
export const obtenerEventosPorTrabajador = async (req, res) => {
  try {
    const { trabajadorId } = req.params;
    const trabajadorObjectId = new mongoose.Types.ObjectId(trabajadorId);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const fecha = req.query.fecha;

    const filtro = {
      trabajadores: { $in: [trabajadorObjectId] },
    };

    if (fecha) {
      const fechaInicio = new Date(fecha);
      fechaInicio.setHours(0, 0, 0, 0);

      const fechaFin = new Date(fecha);
      fechaFin.setHours(23, 59, 59, 999);

      filtro.fecha = {
        $gte: fechaInicio,
        $lte: fechaFin,
      };
    }

    const total = await Evento.countDocuments(filtro);

    const eventos = await Evento.aggregate([
      { $match: filtro },
      { $sort: { fecha: 1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "asistentes",
          localField: "_id",
          foreignField: "evento",
          as: "asistentes",
        },
      },
      {
        $lookup: {
          from: "usuarios",
          localField: "trabajadores",
          foreignField: "_id",
          as: "trabajadores",
        },
      },
    ]);

    res.json({
      eventos,
      totalEventos: total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    res.status(500).json({
      mensaje: "Error al obtener eventos por trabajador",
      error: error.message,
    });
  }
};

// Obtener un evento por ID con trabajadores y asistentes
export const obtenerEventoPorId = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id)
      .populate("trabajadores", "nombre correo")
      .lean();
    if (!evento)
      return res.status(404).json({ mensaje: "Evento no encontrado" });

    const asistentes = await Asistente.find(
      { evento: evento._id },
      "nombre correo telefono"
    );
    evento.asistentes = asistentes;

    res.json(evento);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el evento", error });
  }
};

// Actualizar un evento
export const actualizarEvento = async (req, res) => {
  try {
    const eventoActualizado = await Evento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(eventoActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar el evento", error });
  }
};

// Eliminar un evento
export const eliminarEvento = async (req, res) => {
  try {
    await Evento.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Evento eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el evento", error });
  }
};
export const pruebaRegistro = async (req, res) => {
  try {
    const eventos = [];

    for (let i = 1; i <= 100; i++) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() + i); // Fecha hacia el futuro

      eventos.push({
        nombre: `Evento ${i}`,
        fecha: fecha,
        lugar: `Lugar ${i}`,
        descripcion: `Descripción del evento número ${i}`,
        valor: Math.floor(Math.random() * (200000 - 50000 + 1)) + 50000, // Entre 50.000 y 200.000
      });
    }

    await Evento.insertMany(eventos);
    res.status(201).json({ mensaje: "100 eventos creados con éxito" });
  } catch (error) {
    console.error("Error al crear eventos de prueba:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
