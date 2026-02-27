import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth-middleware';

const prisma = new PrismaClient();

export const obtenerEventos = async (req: AuthRequest, res: Response) => {
    try {
        const usuarioId = req.usuario?.id;

        if (!usuarioId) {
            return res.status(401).json({ error: 'Usuario no identificado' });
        }

        const eventos = await prisma.evento.findMany({
            where: {
                usuarioId: usuarioId
            },
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

export const crearEvento = async (req: AuthRequest, res: Response) => {
    try {
        const {
            nombre, fecha, hora, tipo, descripcion, totalInvitados,
            lugarNombre, direccion, ciudad, codigoPostal, pais, lugarTelefono, puntoReferencia,
            nombreOrganizador, emailOrganizador, telefonoOrganizador, codigoVestimenta, notasEspeciales
        } = req.body;
        const usuarioId = req.usuario?.id;

        if (!usuarioId) {
            return res.status(401).json({ error: 'Usuario no identificado' });
        }

        // Mapear tipos de evento del frontend al enum de Prisma
        let tipoEnum: any = tipo;
        if (tipo === 'Fiesta Privada') tipoEnum = 'Fiesta_Privada';
        if (tipo === 'XV Años') tipoEnum = 'XV_Anos';

        const nuevoEvento = await prisma.evento.create({
            data: {
                nombre,
                fecha: new Date(fecha),
                hora,
                tipo: tipoEnum,
                descripcion,
                totalInvitados: Number(totalInvitados),
                lugarNombre,
                direccion,
                ciudad,
                codigoPostal,
                pais: pais || "España",
                lugarTelefono,
                puntoReferencia,
                nombreOrganizador,
                emailOrganizador,
                telefonoOrganizador,
                codigoVestimenta,
                notasEspeciales,
                usuarioId: usuarioId
            }
        });
        res.status(201).json(nuevoEvento);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el evento' });
    }
};
