// controllers/usuario.controller.js
import Usuario from '../models/Usuario.js';
import bcrypt from "bcryptjs";
// Crear un nuevo usuario
export const crearUsuario = async (req, res) => {
    const { nombre, correo, contrasena, rol } = req.body;
  
    // Validación de campos requeridos
    if (!nombre || !correo || !contrasena || !rol) {
      return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });
    }
  
    try {
          // Verificar si ya existe un usuario con ese correo
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(409).json({ mensaje: 'El correo ya está registrado' });
    }
    const salt = await bcrypt.genSalt(10);
    const claveCifrada = await bcrypt.hash(contrasena, salt);

      const nuevoUsuario = new Usuario({ nombre, correo, contrasena:claveCifrada, rol });
      await nuevoUsuario.save();
      res.status(201).json(nuevoUsuario);
    } catch (error) {
      res.status(400).json({ mensaje: 'Error al crear el usuario', error });
    }
  };
  

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const { correo } = req.body;

    // Buscar el usuario actual
    const usuarioActual = await Usuario.findById(req.params.id);
    if (!usuarioActual) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Validar si se intenta cambiar el correo
    if (correo && correo !== usuarioActual.correo) {
      const correoExistente = await Usuario.findOne({ correo });
      if (correoExistente) {
        return res.status(409).json({ mensaje: 'El correo ya está en uso por otro usuario' });
      }
    }

    // Actualizar el usuario
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar usuario', error });
  }
};


// Eliminar un usuario
export const eliminarUsuario = async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar usuario', error });
  }
};