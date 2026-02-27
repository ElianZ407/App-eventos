import { Router } from 'express';
import {
    obtenerInvitados,
    crearInvitado,
    actualizarInvitado,
    eliminarInvitado,
    enviarInvitacion,
    enviarTestEmail,
    rsvpInvitado
} from '../controllers/invitado-controller';
import { authMiddleware } from '../middleware/auth-middleware';

const router = Router();

router.get('/:eventoId', authMiddleware, obtenerInvitados);
router.post('/', authMiddleware, crearInvitado);
router.put('/:id', authMiddleware, actualizarInvitado);
router.delete('/:id', authMiddleware, eliminarInvitado);
router.post('/enviar-invitacion', authMiddleware, enviarInvitacion);
router.post('/test-email', authMiddleware, enviarTestEmail);
router.get('/rsvp/:id/:estado', rsvpInvitado);

export default router;
