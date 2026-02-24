import { Request, Response } from 'express';
import { sendEventInvitation } from '../services/email-service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const enviarTestEmail = async (req: Request, res: Response) => {
    try {
        const { guestName, eventName, guestEmail } = req.body;
        const result = await sendEventInvitation(guestName, eventName, guestEmail);

        if (result.success) {
            res.json({ message: 'Email enviado correctamente', data: result.data });
        } else {
            res.status(500).json({ error: 'Error al enviar el email', details: result.error });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const obtenerInvitados = async (req: Request, res: Response) => {
    try {
        const eventoId = req.params.eventoId as string;
        const invitados = await prisma.invitado.findMany({
            where: { eventoId }
        });
        res.json(invitados);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener invitados' });
    }
};

export const enviarInvitacion = async (req: Request, res: Response) => {
    try {
        const invitadoId = req.body.invitadoId as string;
        const invitado = await prisma.invitado.findUnique({
            where: { id: invitadoId },
            include: { evento: true }
        });

        if (!invitado || !invitado.email) {
            return res.status(404).json({ error: 'Invitado no encontrado o sin email' });
        }

        const result = await sendEventInvitation(invitado.nombre, invitado.evento.nombre, invitado.email);

        if (result.success) {
            res.json({ message: `Invitación enviada a ${invitado.nombre}` });
        } else {
            res.status(500).json({ error: 'Fallo al enviar el correo' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno al enviar invitación' });
    }
};
