import { Router } from 'express';
import {
    obtenerInvitados,
    crearInvitado,
    actualizarInvitado,
    eliminarInvitado,
    enviarInvitacion,
    enviarTodasInvitaciones,
    enviarTestEmail,
    rsvpInvitado
} from '../controllers/invitado-controller';
import { authMiddleware } from '../middleware/auth-middleware';

const router = Router();

// Rutas estáticas primero para evitar conflictos con parámetros dinámicos
router.post('/enviar-invitacion', authMiddleware, enviarInvitacion);
router.post('/enviar-todas', authMiddleware, enviarTodasInvitaciones);
router.post('/test-email', authMiddleware, enviarTestEmail);
router.get('/rsvp/:id/:estado', rsvpInvitado);

router.get('/:eventoId', authMiddleware, obtenerInvitados);
router.post('/', authMiddleware, crearInvitado);
router.put('/:id', authMiddleware, actualizarInvitado);
router.delete('/:id', authMiddleware, eliminarInvitado);

export default router;
