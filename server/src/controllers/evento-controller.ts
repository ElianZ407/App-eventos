import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const obtenerEventos = async (req: Request, res: Response) => {
    try {
        const eventos = await prisma.evento.findMany({
            include: {
                invitados: true,
                mesas: true,
            },
        });
        res.json(eventos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener eventos' });
    }
};

export const crearEvento = async (req: Request, res: Response) => {
    try {
        const { nombre, fecha, hora, tipo, totalInvitados, usuarioId } = req.body;
        const nuevoEvento = await prisma.evento.create({
            data: {
                nombre,
                fecha: new Date(fecha),
                hora,
                tipo,
                totalInvitados: Number(totalInvitados),
                usuarioId: usuarioId as string
            }
        });
        res.status(201).json(nuevoEvento);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el evento' });
    }
};
