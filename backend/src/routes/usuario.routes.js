// routes/usuario.routes.js
import { Router } from 'express';
import {
  crearUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario
} from '../controllers/usuario.controller.js';
import { verificarToken } from '../middlewares/auth.js';

const router = Router();

// Rutas para usuarios
router.post('/usuarios/', crearUsuario);             // Crear usuario
router.get('/usuarios/', obtenerUsuarios);           // Obtener todos
router.put('/usuarios/:id', verificarToken, actualizarUsuario);      // Actualizar usuario
router.delete('/usuarios/:id', verificarToken, eliminarUsuario);     // Eliminar usuario

export default router;