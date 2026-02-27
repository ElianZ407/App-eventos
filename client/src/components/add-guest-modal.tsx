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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useState } from "react"

interface AddGuestModalProps {
    onAddGuest?: (guest: any) => void
    tables?: any[]
}

export function AddGuestModal({ onAddGuest, tables = [] }: AddGuestModalProps) {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        telefono: "",
        estado: "pendiente",
        mesaId: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (onAddGuest) onAddGuest(formData)
        setOpen(false)
        setFormData({
            nombre: "",
            email: "",
            telefono: "",
            estado: "pendiente",
            mesaId: "",
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Añadir Invitado
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Añadir Nuevo Invitado</DialogTitle>
                    <DialogDescription>
                        Introduce los detalles del invitado aquí. Haz clic en guardar cuando termines.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nombre" className="text-right">
                            Nombre
                        </Label>
                        <Input
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            className="col-span-3"
                            placeholder="Nombre completo"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="col-span-3"
                            placeholder="ejemplo@correo.com"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="telefono" className="text-right">
                            Teléfono
                        </Label>
                        <Input
                            id="telefono"
                            value={formData.telefono}
                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            className="col-span-3"
                            placeholder="+34 600 000 000"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="estado" className="text-right">
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
                        <Label htmlFor="mesaId" className="text-right">
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
                        <Button type="submit">Guardar Invitado</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
