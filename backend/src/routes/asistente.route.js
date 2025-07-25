// src/routes/asistente.routes.js
import { Router } from 'express';
import {
  crearAsistente,
  obtenerAsistentes,
  obtenerAsistentePorId,
  obtenerAsistentePorEventoYId,
  eliminarAsistenteDeEvento,
  registrarPagoAsistente,

} from '../controllers/asistente.controller.js';

const router = Router();

// Rutas CRUD 
router.get('/asistente/filtrar', obtenerAsistentePorEventoYId);

router.get('/asistente/', obtenerAsistentes);
router.post('/asistente/', crearAsistente);
router.get('/asistente/:id', obtenerAsistentePorId);

// Rutas con acciones
router.delete('/asistente/eliminar', eliminarAsistenteDeEvento);
router.post('/asistente/:eventoId/:asistenteId/pago', registrarPagoAsistente);




export default router;
