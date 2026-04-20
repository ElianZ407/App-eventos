import { z } from 'zod';

export const registrarSchema = z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
});

export const cambiarPasswordSchema = z.object({
    passwordActual: z.string().min(1, 'La contraseña actual es requerida'),
    passwordNueva: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
});
