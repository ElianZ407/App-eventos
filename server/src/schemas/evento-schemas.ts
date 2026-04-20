import { z } from 'zod';

export const crearEventoSchema = z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    fecha: z.string().min(1, 'La fecha es requerida'),
    hora: z.string().min(1, 'La hora es requerida'),
    tipo: z.string().optional(),
    descripcion: z.string().optional(),
    totalInvitados: z.coerce.number().int().min(1, 'Debe haber al menos 1 invitado'),
    lugarNombre: z.string().optional(),
    direccion: z.string().optional(),
    ciudad: z.string().optional(),
    codigoPostal: z.string().optional(),
    pais: z.string().optional(),
    lugarTelefono: z.string().optional(),
    puntoReferencia: z.string().optional(),
    nombreOrganizador: z.string().optional(),
    emailOrganizador: z.string().email('Email del organizador inválido').optional().or(z.literal('')),
    telefonoOrganizador: z.string().optional(),
    codigoVestimenta: z.string().optional(),
    notasEspeciales: z.string().optional(),
});

export const actualizarEventoSchema = crearEventoSchema.partial();
