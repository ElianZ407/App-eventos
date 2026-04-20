import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth-middleware';

const prisma = new PrismaClient();

export const obtenerEvento = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const usuarioId = req.usuario?.id;
        if (!usuarioId) return res.status(401).json({ error: 'Usuario no identificado' });

        const evento = await prisma.evento.findFirst({
            where: { id: Number(id), usuarioId },
            include: { invitados: true, mesas: true },
        });

        if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
        res.json(evento);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el evento' });
    }
};

export const actualizarEvento = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const usuarioId = req.usuario?.id;
        if (!usuarioId) return res.status(401).json({ error: 'Usuario no identificado' });

        const existente = await prisma.evento.findFirst({ where: { id: Number(id), usuarioId } });
        if (!existente) return res.status(404).json({ error: 'Evento no encontrado' });

        const {
            nombre, fecha, hora, tipo, descripcion, totalInvitados,
            lugarNombre, direccion, ciudad, codigoPostal, pais, lugarTelefono, puntoReferencia,
            nombreOrganizador, emailOrganizador, telefonoOrganizador, codigoVestimenta, notasEspeciales
        } = req.body;

        let tipoEnum: any = tipo;
        if (tipo === 'Fiesta Privada') tipoEnum = 'Fiesta_Privada';
        if (tipo === 'XV Años') tipoEnum = 'XV_Anos';

        const eventoActualizado = await prisma.evento.update({
            where: { id: Number(id) },
            data: {
                nombre, hora, tipo: tipoEnum, descripcion,
                totalInvitados: Number(totalInvitados),
                lugarNombre, direccion, ciudad, codigoPostal,
                pais: pais || 'España', lugarTelefono, puntoReferencia,
                nombreOrganizador, emailOrganizador, telefonoOrganizador,
                codigoVestimenta, notasEspeciales,
                ...(fecha && { fecha: new Date(fecha) }),
            },
            include: { invitados: true, mesas: true },
        });
        res.json(eventoActualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el evento' });
    }
};

export const eliminarEvento = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const usuarioId = req.usuario?.id;
        if (!usuarioId) return res.status(401).json({ error: 'Usuario no identificado' });

        const existente = await prisma.evento.findFirst({ where: { id: Number(id), usuarioId } });
        if (!existente) return res.status(404).json({ error: 'Evento no encontrado' });

        await prisma.evento.delete({ where: { id: Number(id) } });
        res.json({ message: 'Evento eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el evento' });
    }
};

export const obtenerEventos = async (req: AuthRequest, res: Response) => {
    try {
        const usuarioId = req.usuario?.id;
        if (!usuarioId) return res.status(401).json({ error: 'Usuario no identificado' });

        const eventos = await prisma.evento.findMany({
            where: { usuarioId },
            include: { invitados: true, mesas: true },
        });
        res.json(eventos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener eventos' });
    }
};

export const crearEvento = async (req: AuthRequest, res: Response) => {
    try {
        const {
            nombre, fecha, hora, tipo, descripcion, totalInvitados,
            lugarNombre, direccion, ciudad, codigoPostal, pais, lugarTelefono, puntoReferencia,
            nombreOrganizador, emailOrganizador, telefonoOrganizador, codigoVestimenta, notasEspeciales
        } = req.body;
        const usuarioId = req.usuario?.id;
        if (!usuarioId) return res.status(401).json({ error: 'Usuario no identificado' });

        let tipoEnum: any = tipo;
        if (tipo === 'Fiesta Privada') tipoEnum = 'Fiesta_Privada';
        if (tipo === 'XV Años') tipoEnum = 'XV_Anos';

        const nuevoEvento = await prisma.evento.create({
            data: {
                nombre, fecha: new Date(fecha), hora, tipo: tipoEnum, descripcion,
                totalInvitados: Number(totalInvitados), lugarNombre, direccion, ciudad,
                codigoPostal, pais: pais || 'España', lugarTelefono, puntoReferencia,
                nombreOrganizador, emailOrganizador, telefonoOrganizador,
                codigoVestimenta, notasEspeciales, usuarioId,
            }
        });
        res.status(201).json(nuevoEvento);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el evento' });
    }
};
