"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, X, Plus, Users } from "lucide-react"
import { useState, useEffect } from "react"

interface EditTableModalProps {
    table: any
    onUpdateTable?: (table: any) => void
}

export function EditTableModal({ table, onUpdateTable }: EditTableModalProps) {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        number: table.number.toString(),
        capacity: table.capacity.toString(),
        location: table.location,
    })
    const [guests, setGuests] = useState<string[]>(table.guests || [])
    const [newGuestName, setNewGuestName] = useState("")

    // Reset when modal opens
    useEffect(() => {
        if (open) {
            setFormData({
                number: table.number.toString(),
                capacity: table.capacity.toString(),
                location: table.location,
            })
            setGuests(table.guests || [])
            setNewGuestName("")
        }
    }, [open, table])

    const handleAddGuest = () => {
        if (newGuestName.trim()) {
            setGuests([...guests, newGuestName.trim()])
            setNewGuestName("")
        }
    }

    const handleRemoveGuest = (index: number) => {
        const updatedGuests = guests.filter((_, i) => i !== index)
        setGuests(updatedGuests)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const capacityVal = parseInt(formData.capacity)
        const assignedVal = guests.length

        const updatedTable = {
            ...table,
            number: parseInt(formData.number),
            capacity: capacityVal,
            location: formData.location,
            guests: guests,
            assigned: assignedVal,
        }

        // Recalculate status
        if (assignedVal >= capacityVal) {
            updatedTable.status = "full"
        } else if (assignedVal > 0) {
            updatedTable.status = "partial"
        } else {
            updatedTable.status = "empty"
        }

        if (onUpdateTable) onUpdateTable(updatedTable)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 gap-1 bg-transparent">
                    <Edit className="h-3 w-3" />
                    Editar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] flex flex-col max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Mesa {table.number}</DialogTitle>
                    <DialogDescription>
                        Gestiona los detalles y la lista de invitados para esta mesa.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto py-4">
                    <form id="edit-table-form" onSubmit={handleSubmit} className="grid gap-6">
                        <div className="grid gap-4 border-b pb-6">
                            <h3 className="text-sm font-semibold flex items-center gap-2">Configuración General</h3>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-number" className="text-right">Número</Label>
                                <Input
                                    id="edit-number"
                                    type="number"
                                    value={formData.number}
                                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                    className="col-span-3 h-8 text-xs"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-capacity" className="text-right">Capacidad</Label>
                                <Input
                                    id="edit-capacity"
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                    className="col-span-3 h-8 text-xs"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-location" className="text-right">Ubicación</Label>
                                <Input
                                    id="edit-location"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="col-span-3 h-8 text-xs"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <h3 className="text-sm font-semibold flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Invitados ({guests.length}/{formData.capacity})
                                </div>
                            </h3>

                            <div className="flex gap-2">
                                <Input
                                    placeholder="Nombre del invitado..."
                                    value={newGuestName}
                                    onChange={(e) => setNewGuestName(e.target.value)}
                                    className="flex-1 h-8 text-xs"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            handleAddGuest()
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    className="h-8 w-8 p-0"
                                    onClick={handleAddGuest}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="grid gap-2 max-h-[200px] overflow-y-auto pr-2">
                                {guests.length > 0 ? (
                                    guests.map((guest, index) => (
                                        <div key={index} className="flex items-center justify-between bg-secondary/50 p-2 rounded-md group">
                                            <span className="text-xs font-medium">{guest}</span>
                                            <button
                                                type="button"
                                                className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                                onClick={() => handleRemoveGuest(index)}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-muted-foreground italic text-center py-4">Sin invitados asignados</p>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
                <DialogFooter className="pt-4 border-t">
                    <Button form="edit-table-form" type="submit" className="w-full">Guardar Cambios</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
