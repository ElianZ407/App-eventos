import { Router } from 'express';
import { obtenerEventos, crearEvento, obtenerEvento, actualizarEvento, eliminarEvento } from '../controllers/evento-controller';
import { authMiddleware } from '../middleware/auth-middleware';
import { validate } from '../middleware/validate';
import { crearEventoSchema, actualizarEventoSchema } from '../schemas/evento-schemas';

const router = Router();

router.get('/', authMiddleware, obtenerEventos);
router.post('/', authMiddleware, validate(crearEventoSchema), crearEvento);
router.get('/:id', authMiddleware, obtenerEvento);
router.put('/:id', authMiddleware, validate(actualizarEventoSchema), actualizarEvento);
router.delete('/:id', authMiddleware, eliminarEvento);

export default router;
