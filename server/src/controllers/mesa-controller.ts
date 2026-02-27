import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth-middleware';

const prisma = new PrismaClient();

export const obtenerMesas = async (req: AuthRequest, res: Response) => {
    try {
        const { eventoId } = req.params;
        const usuarioId = req.usuario?.id;

        if (!eventoId) {
            return res.status(400).json({ error: 'ID de evento inválido' });
        }

        // Verificar que el evento pertenezca al usuario
        const evento = await prisma.evento.findFirst({
            where: { id: Number(eventoId), usuarioId }
        });

        if (!evento) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        const mesas = await prisma.mesa.findMany({
            where: { eventoId: Number(eventoId) },
            include: {
                invitados: true
            }
        });
        res.json(mesas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener mesas' });
    }
};

export const crearMesa = async (req: AuthRequest, res: Response) => {
    try {
        const { numero, capacidad, ubicacion, eventoId } = req.body;
        const usuarioId = req.usuario?.id;

        if (!eventoId) {
            return res.status(400).json({ error: 'ID de evento requerido' });
        }

        // Verificar que el evento pertenezca al usuario
        const evento = await prisma.evento.findFirst({
            where: { id: Number(eventoId), usuarioId }
        });

        if (!evento) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        const nuevaMesa = await prisma.mesa.create({
            data: {
                numero: Number(numero),
                capacidad: Number(capacidad),
                ubicacion,
                eventoId: Number(eventoId)
            }
        });
        res.status(201).json(nuevaMesa);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la mesa' });
    }
};

export const eliminarMesa = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const usuarioId = req.usuario?.id;

        if (!id) {
            return res.status(400).json({ error: 'ID de mesa inválido' });
        }

        // Verificar que la mesa sea de un evento del usuario
        const mesa = await prisma.mesa.findFirst({
            where: {
                id: Number(id),
                evento: {
                    usuarioId: usuarioId
                }
            }
        });

        if (!mesa) {
            return res.status(404).json({ error: 'Mesa no encontrada' });
        }

        await prisma.mesa.delete({ where: { id: Number(id) } });
        res.json({ message: 'Mesa eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la mesa' });
    }
};

export const actualizarMesa = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { numero, capacidad, ubicacion } = req.body;
        const usuarioId = req.usuario?.id;

        const mesa = await prisma.mesa.findFirst({
            where: {
                id: Number(id),
                evento: {
                    usuarioId: usuarioId
                }
            }
        });

        if (!mesa) {
            return res.status(404).json({ error: 'Mesa no encontrada' });
        }

        const mesaActualizada = await prisma.mesa.update({
            where: { id: Number(id) },
            data: {
                numero: numero !== undefined ? Number(numero) : undefined,
                capacidad: capacidad !== undefined ? Number(capacidad) : undefined,
                ubicacion
            }
        });

        res.json(mesaActualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la mesa' });
    }
};
