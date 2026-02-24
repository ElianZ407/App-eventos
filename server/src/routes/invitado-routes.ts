import { Router } from 'express';
import { obtenerInvitados, enviarInvitacion, enviarTestEmail } from '../controllers/invitado-controller';

const router = Router();

router.get('/:eventoId', obtenerInvitados);
router.post('/enviar-invitacion', enviarInvitacion);
router.post('/test-email', enviarTestEmail);

export default router;
