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
import { Badge } from "@/components/ui/badge"
import { Edit, Users } from "lucide-react"
import { useState, useEffect } from "react"

interface EditTableModalProps {
    table: any
    onUpdateTable?: (table: any) => void
}

export function EditTableModal({ table, onUpdateTable }: EditTableModalProps) {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        numero: table.numero?.toString() || "",
        capacidad: table.capacidad?.toString() || "",
        ubicacion: table.ubicacion || "",
    })

    useEffect(() => {
        if (open) {
            setFormData({
                numero: table.numero?.toString() || "",
                capacidad: table.capacidad?.toString() || "",
                ubicacion: table.ubicacion || "",
            })
        }
    }, [open, table])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const updatedTable = {
            ...table,
            numero: parseInt(formData.numero),
            capacidad: parseInt(formData.capacidad),
            ubicacion: formData.ubicacion,
        }
        if (onUpdateTable) onUpdateTable(updatedTable)
        setOpen(false)
    }

    const invitados: any[] = table.invitados || []

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 gap-1 bg-transparent">
                    <Edit className="h-3 w-3" />
                    Editar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Mesa {table.numero}</DialogTitle>
                    <DialogDescription>
                        Edita los detalles de la mesa. Para asignar invitados, hazlo desde la página de Invitados.
                    </DialogDescription>
                </DialogHeader>
                <form id="edit-table-form" onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-numero" className="text-right">Número</Label>
                        <Input
                            id="edit-numero"
                            type="number"
                            value={formData.numero}
                            onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-capacidad" className="text-right">Capacidad</Label>
                        <Input
                            id="edit-capacidad"
                            type="number"
                            value={formData.capacidad}
                            onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-ubicacion" className="text-right">Ubicación</Label>
                        <Input
                            id="edit-ubicacion"
                            value={formData.ubicacion}
                            onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                            className="col-span-3"
                        />
                    </div>

                    {invitados.length > 0 && (
                        <div className="grid gap-2 pt-2 border-t">
                            <p className="text-sm font-medium flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Invitados asignados ({invitados.length}/{formData.capacidad})
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {invitados.map((inv: any, i: number) => (
                                    <Badge key={i} variant="secondary">{inv.nombre}</Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </form>
                <DialogFooter>
                    <Button form="edit-table-form" type="submit" className="w-full">Guardar Cambios</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
