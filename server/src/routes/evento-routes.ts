import { Router } from 'express';
import { obtenerEventos, crearEvento } from '../controllers/evento-controller';

const router = Router();

router.get('/', obtenerEventos);
router.post('/', crearEvento);

export default router;
