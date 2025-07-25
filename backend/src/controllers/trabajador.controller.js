import mongoose from 'mongoose';
import Evento from "../models/Evento.js";
import Usuario from "../models/Usuario.js";

// Obtener todos los trabajadores con paginación y búsqueda
export const obtenerTrabajadores = async (req, res) => {
  try {
    const { page = 1, limit = 10, busqueda = "" } = req.query;

    // Filtro de búsqueda y rol
    const query = {
      rol: "trabajador",
      $or: [
        { nombre: { $regex: busqueda, $options: "i" } },
        { correo: { $regex: busqueda, $options: "i" } },
      ],
    };

    const trabajadores = await Usuario.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Usuario.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      trabajadores,
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener los trabajadores", error });
  }
};

// Obtener trabajador por ID
export const obtenerTrabajadorPorId = async (req, res) => {
  try {
    const trabajador = await Usuario.findOne({
      _id: req.params.id,
      rol: "trabajador",
    });
    if (!trabajador)
      return res.status(404).json({ mensaje: "Trabajador no encontrado" });
    res.json(trabajador);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el trabajador", error });
  }
};
export const asignarTrabajadorEvento = async (req, res) => {
  const { eventoId, trabajadores } = req.body; // trabajadores será un array de IDs
  console.log("body:", req.body);

  // Validar ID del evento
  if (!mongoose.Types.ObjectId.isValid(eventoId)) {
    return res.status(400).json({ mensaje: "ID de evento no válido" });
  }

  // Validar que trabajadores sea un array de ObjectId válidos
  if (
    !Array.isArray(trabajadores) ||
    trabajadores.some(id => !mongoose.Types.ObjectId.isValid(id))
  ) {
    return res.status(400).json({ mensaje: "Lista de trabajadores no válida" });
  }

  try {
    // Buscar evento
    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({ mensaje: "Evento no encontrado" });
    }

    // Filtrar los IDs ya asignados para evitar duplicados
    const nuevosTrabajadores = [];

    for (const id of trabajadores) {
      const trabajador = await Usuario.findById(id);

      if (!trabajador || trabajador.rol !== "trabajador") {
        continue; // Ignora si no es válido o no tiene rol adecuado
      }

      if (!evento.trabajadores.includes(id)) {
        nuevosTrabajadores.push(id); // Solo agrega si aún no está asignado
      }
    }

    if (nuevosTrabajadores.length === 0) {
      return res
        .status(400)
        .json({ mensaje: "Ningún trabajador nuevo fue asignado" });
    }

    // Asignar todos los nuevos trabajadores
    evento.trabajadores.push(...nuevosTrabajadores);
    await evento.save();

    res.json({
      mensaje: "Trabajadores asignados correctamente",
      trabajadoresAsignados: nuevosTrabajadores,
      evento,
    });
  } catch (error) {
    console.error("Error al asignar trabajadores:", error);
    res.status(500).json({
      mensaje: "Error al asignar trabajadores",
      error: error.message,
    });
  }
};


export const obtenerTrabajadoresDisponibles = async (req, res) => {
  try {
    const trabajadores = await Usuario.find({ rol: "trabajador" });
    res.json(trabajadores);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener los trabajadores", error });
  }
};
