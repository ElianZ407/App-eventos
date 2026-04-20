import { Router } from 'express';
import { registrar, login, getPerfil, updatePerfil, cambiarPassword } from '../controllers/auth-controller';
import { authMiddleware } from '../middleware/auth-middleware';
import { validate } from '../middleware/validate';
import { registrarSchema, loginSchema, cambiarPasswordSchema } from '../schemas/auth-schemas';

const router = Router();

router.post('/register', validate(registrarSchema), registrar);
router.post('/login', validate(loginSchema), login);
router.get('/perfil', authMiddleware, getPerfil);
router.put('/perfil', authMiddleware, updatePerfil);
router.put('/cambiar-password', authMiddleware, validate(cambiarPasswordSchema), cambiarPassword);

export default router;
