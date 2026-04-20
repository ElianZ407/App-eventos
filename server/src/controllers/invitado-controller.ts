import { Response } from 'express';
import { sendEventInvitation } from '../services/email-service';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth-middleware';

const prisma = new PrismaClient();

export const enviarTestEmail = async (req: AuthRequest, res: Response) => {
    try {
        const { guestName, eventName, guestEmail, guestId } = req.body;
        const result = await sendEventInvitation(guestName, eventName, guestEmail, Number(guestId) || 0);

        if (result.success) {
            res.json({ message: 'Email enviado correctamente', data: result.data });
        } else {
            res.status(500).json({ error: 'Error al enviar el email', details: result.error });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const obtenerInvitados = async (req: AuthRequest, res: Response) => {
    try {
        const eventoId = req.params.eventoId;
        const usuarioId = req.usuario?.id;

        if (!usuarioId) return res.status(401).json({ error: 'No autorizado' });

        // Verificar que el evento pertenezca al usuario
        const evento = await prisma.evento.findFirst({
            where: { id: Number(eventoId), usuarioId }
        });

        if (!evento) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        const invitados = await prisma.invitado.findMany({
            where: { eventoId: Number(eventoId) },
            include: { mesa: true }
        });
        res.json(invitados);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener invitados' });
    }
};

export const crearInvitado = async (req: AuthRequest, res: Response) => {
    try {
        const { nombre, email, telefono, estado, eventoId, mesaId } = req.body;
        const usuarioId = req.usuario?.id;

        if (!usuarioId) return res.status(401).json({ error: 'No autorizado' });

        const evento = await prisma.evento.findFirst({
            where: { id: Number(eventoId), usuarioId }
        });

        if (!evento) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        const nuevoInvitado = await prisma.invitado.create({
            data: {
                nombre,
                email,
                telefono,
                estado: estado || 'pendiente',
                eventoId: Number(eventoId),
                mesaId: mesaId === 'none' || !mesaId ? null : Number(mesaId)
            },
            include: { mesa: true }
        });

        res.status(201).json(nuevoInvitado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear invitado' });
    }
};

export const actualizarInvitado = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id;
        const { nombre, email, telefono, estado, mesaId } = req.body;
        const usuarioId = req.usuario?.id;

        if (!usuarioId) return res.status(401).json({ error: 'No autorizado' });

        const invitado = await prisma.invitado.findFirst({
            where: {
                id: Number(id),
                evento: { usuarioId }
            }
        });

        if (!invitado) {
            return res.status(404).json({ error: 'Invitado no encontrado' });
        }

        const invitadoActualizado = await prisma.invitado.update({
            where: { id: Number(id) },
            data: {
                nombre,
                email,
                telefono,
                estado,
                mesaId: mesaId === 'none' || !mesaId ? null : Number(mesaId)
            },
            include: { mesa: true }
        });

        res.json(invitadoActualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar invitado' });
    }
};

export const eliminarInvitado = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id;
        const usuarioId = req.usuario?.id;

        if (!usuarioId) return res.status(401).json({ error: 'No autorizado' });

        const invitado = await prisma.invitado.findFirst({
            where: {
                id: Number(id),
                evento: { usuarioId }
            }
        });

        if (!invitado) {
            return res.status(404).json({ error: 'Invitado no encontrado' });
        }

        await prisma.invitado.delete({ where: { id: Number(id) } });
        res.json({ message: 'Invitado eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar invitado' });
    }
};

export const enviarInvitacion = async (req: AuthRequest, res: Response) => {
    try {
        const { invitadoId } = req.body;
        const usuarioId = req.usuario?.id;

        if (!usuarioId) return res.status(401).json({ error: 'No autorizado' });

        const invitado = await prisma.invitado.findFirst({
            where: {
                id: Number(invitadoId),
                evento: { usuarioId }
            },
            include: { evento: true }
        });

        if (!invitado || !invitado.email) {
            return res.status(404).json({ error: 'Invitado no encontrado o sin email' });
        }

        const result = await sendEventInvitation(invitado.nombre, invitado.evento.nombre, invitado.email, invitado.id);

        if (result.success) {
            res.json({ message: `Invitación enviada a ${invitado.nombre}` });
        } else {
            res.status(500).json({ error: 'Fallo al enviar el correo' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno al enviar invitación' });
    }
};
export const rsvpInvitado = async (req: any, res: Response) => {
    try {
        const { id, estado } = req.params;
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        if (estado !== 'confirmado' && estado !== 'cancelado') {
            return res.status(400).send('Estado inválido');
        }

        const invitado = await prisma.invitado.findUnique({
            where: { id: Number(id) }
        });

        if (!invitado) {
            return res.status(404).send('Invitado no encontrado');
        }

        await prisma.invitado.update({
            where: { id: Number(id) },
            data: { estado }
        });

        // Enviar una respuesta HTML simple o redirigir
        res.send(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: #4f46e5;">¡Gracias, ${invitado.nombre}!</h1>
                <p>Tu respuesta ha sido registrada como: <strong>${estado === 'confirmado' ? 'Asistiré' : 'No asistiré'}</strong>.</p>
                <br/>
                <a href="${frontendUrl}" style="color: #4f46e5; text-decoration: none;">Ir a EventFlow</a>
            </div>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al procesar tu respuesta');
    }
};

export const enviarTodasInvitaciones = async (req: AuthRequest, res: Response) => {
    try {
        const { eventoId } = req.body;
        const usuarioId = req.usuario?.id;
        if (!usuarioId) return res.status(401).json({ error: 'No autorizado' });

        const evento = await prisma.evento.findFirst({ where: { id: Number(eventoId), usuarioId } });
        if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });

        const invitados = await prisma.invitado.findMany({
            where: { eventoId: Number(eventoId), estado: 'pendiente', email: { not: null } }
        });

        if (invitados.length === 0) {
            return res.json({ message: 'No hay invitados pendientes con email', enviados: 0, fallidos: 0 });
        }

        let enviados = 0;
        let fallidos = 0;
        for (const invitado of invitados) {
            if (!invitado.email) continue;
            const result = await sendEventInvitation(invitado.nombre, evento.nombre, invitado.email, invitado.id);
            if (result.success) enviados++;
            else fallidos++;
        }

        res.json({ message: `Invitaciones enviadas: ${enviados}, fallidas: ${fallidos}`, enviados, fallidos });
    } catch (error) {
        res.status(500).json({ error: 'Error al enviar invitaciones' });
    }
};
