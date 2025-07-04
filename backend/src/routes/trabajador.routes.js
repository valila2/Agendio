import { Router } from 'express';
import {
  obtenerTrabajadores,
  obtenerTrabajadorPorId
} from '../controllers/trabajador.controller.js';
import { verificarToken } from '../middlewares/auth.js'; 
const router = Router();

router.get('/trabajadores/', verificarToken, obtenerTrabajadores);
router.get('/trabajadores/:id', verificarToken, obtenerTrabajadorPorId);

export default router;