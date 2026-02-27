import { Router } from 'express';
import { registrar, login, getPerfil, updatePerfil } from '../controllers/auth-controller';
import { authMiddleware } from '../middleware/auth-middleware';

const router = Router();

router.post('/register', registrar);
router.post('/login', login);
router.get('/perfil', authMiddleware, getPerfil);
router.put('/perfil', authMiddleware, updatePerfil);

export default router;
