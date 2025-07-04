import Usuario from '../models/Usuario.js';

// Obtener todos los trabajadores
export const obtenerTrabajadores = async (req, res) => {
  try {
    const trabajadores = await Usuario.find({ rol: 'trabajador' });
    res.json(trabajadores);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los trabajadores', error });
  }
};

// Obtener trabajador por ID
export const obtenerTrabajadorPorId = async (req, res) => {
  try {
    const trabajador = await Usuario.findOne({ _id: req.params.id, rol: 'trabajador' });
    if (!trabajador) return res.status(404).json({ mensaje: 'Trabajador no encontrado' });
    res.json(trabajador);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el trabajador', error });
  }
};