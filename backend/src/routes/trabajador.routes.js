import { Router } from 'express';
import {
  asignarTrabajadorEvento,
  obtenerTrabajadores,
  obtenerTrabajadoresDisponibles,
  obtenerTrabajadorPorId
} from '../controllers/trabajador.controller.js';
import { verificarToken } from '../middlewares/auth.js'; 
const router = Router();

router.get('/trabajadores/', verificarToken, obtenerTrabajadores);
router.get('/trabajadores/disponibles/', verificarToken, obtenerTrabajadoresDisponibles);
router.get('/trabajadores/:id', verificarToken, obtenerTrabajadorPorId);
router.post("/trabajadores/asignar-evento", verificarToken, asignarTrabajadorEvento);
export default router;
