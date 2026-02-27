import { Router } from 'express';
import { obtenerEventos, crearEvento } from '../controllers/evento-controller';
import { authMiddleware } from '../middleware/auth-middleware';

const router = Router();

router.get('/', authMiddleware, obtenerEventos);
router.post('/', authMiddleware, crearEvento);

export default router;
