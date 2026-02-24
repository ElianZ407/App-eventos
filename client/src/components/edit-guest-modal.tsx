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
}

export function EditGuestModal({ guest, open, onOpenChange, onUpdateGuest }: EditGuestModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        status: "",
        table: "",
    })

    useEffect(() => {
        if (guest) {
            setFormData({
                name: guest.name || "",
                email: guest.email || "",
                phone: guest.phone || "",
                status: guest.status || "pending",
                table: guest.table || "",
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
                        <Label htmlFor="edit-name" className="text-right">
                            Nombre
                        </Label>
                        <Input
                            id="edit-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        <Label htmlFor="edit-phone" className="text-right">
                            Teléfono
                        </Label>
                        <Input
                            id="edit-phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-status" className="text-right">
                            Estado
                        </Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData({ ...formData, status: value })}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecciona un estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="confirmed">Confirmado</SelectItem>
                                <SelectItem value="pending">Pendiente</SelectItem>
                                <SelectItem value="cancelled">Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-table" className="text-right">
                            Mesa
                        </Label>
                        <Select
                            value={formData.table}
                            onValueChange={(value) => setFormData({ ...formData, table: value })}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Asignar mesa" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Mesa 1">Mesa 1</SelectItem>
                                <SelectItem value="Mesa 2">Mesa 2</SelectItem>
                                <SelectItem value="Mesa 3">Mesa 3</SelectItem>
                                <SelectItem value="Mesa 4">Mesa 4</SelectItem>
                                <SelectItem value="Mesa 5">Mesa 5</SelectItem>
                                <SelectItem value="Sin asignar">Sin asignar</SelectItem>
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
