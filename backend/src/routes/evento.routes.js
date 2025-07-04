// routes/evento.routes.js

import { Router } from 'express';
import {
  crearEvento,
  obtenerEventos,
  obtenerEventoPorId,
  actualizarEvento,
  eliminarEvento,
  pruebaRegistro
} from '../controllers/evento.controller.js';
import { verificarToken } from '../middlewares/auth.js'; 
const router = Router();

router.post('/eventos/', verificarToken, crearEvento);
router.get('/eventos/', verificarToken, obtenerEventos);
router.get('/eventos/:id', obtenerEventoPorId);
router.put('/eventos/:id', actualizarEvento);
router.delete('/eventos/:id', eliminarEvento);
router.post('/pruebaEventos/', pruebaRegistro);
export default router;