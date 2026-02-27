import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export const registrar = async (req: Request, res: Response) => {
    try {
        const { email, password, nombre } = req.body;

        const existe = await prisma.usuario.findUnique({ where: { email } });
        if (existe) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const usuario = await prisma.usuario.create({
            data: {
                email,
                password: hashedPassword,
                nombre,
            },
        });

        res.status(201).json({ message: 'Usuario registrado correctamente', id: usuario.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario || !usuario.password) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const validPassword = await bcrypt.compare(password, usuario.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

export const getPerfil = async (req: any, res: Response) => {
    try {
        const usuarioId = req.usuario?.id;
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
            select: {
                id: true,
                nombre: true,
                email: true,
                rol: true,
                telefono: true
            }
        });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el perfil' });
    }
};

export const updatePerfil = async (req: any, res: Response) => {
    try {
        const usuarioId = req.usuario?.id;
        const { nombre, email, telefono, rol } = req.body;

        const usuarioActualizado = await prisma.usuario.update({
            where: { id: usuarioId },
            data: {
                nombre,
                email,
                telefono,
                rol
            },
            select: {
                id: true,
                nombre: true,
                email: true,
                rol: true,
                telefono: true
            }
        });

        res.json(usuarioActualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el perfil' });
    }
};
