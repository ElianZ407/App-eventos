"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"

interface EditGuestModalProps {
    guest: any
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpdateGuest?: (guest: any) => void
    tables?: any[]
}

export function EditGuestModal({ guest, open, onOpenChange, onUpdateGuest, tables = [] }: EditGuestModalProps) {
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        telefono: "",
        estado: "",
        mesaId: "",
    })

    useEffect(() => {
        if (guest) {
            setFormData({
                nombre: guest.nombre || "",
                email: guest.email || "",
                telefono: guest.telefono || "",
                estado: guest.estado || "pendiente",
                mesaId: guest.mesaId ? guest.mesaId.toString() : "none",
            })
        }
    }, [guest, open])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (onUpdateGuest) {
            onUpdateGuest({
                ...guest,
                ...formData,
            })
        }
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Invitado</DialogTitle>
                    <DialogDescription>
                        Modifica los detalles del invitado aquí. Haz clic en guardar cuando termines.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-nombre" className="text-right">
                            Nombre
                        </Label>
                        <Input
                            id="edit-nombre"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="edit-email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-telefono" className="text-right">
                            Teléfono
                        </Label>
                        <Input
                            id="edit-telefono"
                            value={formData.telefono}
                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-estado" className="text-right">
                            Estado
                        </Label>
                        <Select
                            value={formData.estado}
                            onValueChange={(value) => setFormData({ ...formData, estado: value })}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecciona un estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="confirmado">Confirmado</SelectItem>
                                <SelectItem value="pendiente">Pendiente</SelectItem>
                                <SelectItem value="cancelado">Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-mesaId" className="text-right">
                            Mesa
                        </Label>
                        <Select
                            value={formData.mesaId}
                            onValueChange={(value) => setFormData({ ...formData, mesaId: value })}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Asignar mesa" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Sin asignar</SelectItem>
                                {tables.map((table) => (
                                    <SelectItem key={table.id} value={table.id.toString()}>
                                        Mesa {table.numero} - {table.ubicacion || "Sin ubicación"}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Guardar Cambios</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
