import { Router } from 'express';
import { obtenerMesas, crearMesa, eliminarMesa, actualizarMesa } from '../controllers/mesa-controller';
import { authMiddleware } from '../middleware/auth-middleware';

const router = Router();

router.get('/:eventoId', authMiddleware, obtenerMesas);
router.post('/', authMiddleware, crearMesa);
router.delete('/:id', authMiddleware, eliminarMesa);
router.put('/:id', authMiddleware, actualizarMesa);

export default router;
