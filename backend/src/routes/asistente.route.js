// src/routes/asistente.routes.js
import { Router } from 'express';
import {
  crearAsistente,
  obtenerAsistentes,
  actualizarAsistente,
  eliminarAsistente,
  registrarPago,
  obtenerAsistentePorId,
  obtenerAsistentePorEventoYId
} from '../controllers/asistente.controller.js';

const router = Router();

router.get('/asistente/filtrar', obtenerAsistentePorEventoYId );
router.get('/asistente/', obtenerAsistentes);
router.get("/asistente/:id", obtenerAsistentePorId);
router.post('/asistente/', crearAsistente);
router.put('/asistente/:id', actualizarAsistente);
router.delete('/asistente/:id', eliminarAsistente);
router.post('/asistente/:idAsistente/pagos', registrarPago);



export default router;
