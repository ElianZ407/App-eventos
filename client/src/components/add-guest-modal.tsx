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
}

export function AddGuestModal({ onAddGuest }: AddGuestModalProps) {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        status: "pending",
        table: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would normally call an API
        console.log("Adding guest:", formData)
        if (onAddGuest) onAddGuest(formData)
        setOpen(false)
        setFormData({
            name: "",
            email: "",
            phone: "",
            status: "pending",
            table: "",
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
                        <Label htmlFor="name" className="text-right">
                            Nombre
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        <Label htmlFor="phone" className="text-right">
                            Teléfono
                        </Label>
                        <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="col-span-3"
                            placeholder="+34 600 000 000"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
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
                        <Label htmlFor="table" className="text-right">
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
                                <SelectItem value="Sin asignar">Sin asignar</SelectItem>
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
