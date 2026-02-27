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
import { Plus } from "lucide-react"
import { useState } from "react"

interface AddTableModalProps {
    onAddTable?: (table: any) => void
}

export function AddTableModal({ onAddTable }: AddTableModalProps) {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        numero: "",
        capacidad: "",
        ubicacion: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (onAddTable) onAddTable(formData)
        setOpen(false)
        setFormData({
            numero: "",
            capacidad: "",
            ubicacion: "",
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Añadir Mesa
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Añadir Nueva Mesa</DialogTitle>
                    <DialogDescription>
                        Configura los detalles de la mesa aquí. Haz clic en guardar cuando termines.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="numero" className="text-right">
                            Número
                        </Label>
                        <Input
                            id="numero"
                            type="number"
                            value={formData.numero}
                            onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                            className="col-span-3"
                            placeholder="Ej: 1"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="capacidad" className="text-right">
                            Capacidad
                        </Label>
                        <Input
                            id="capacidad"
                            type="number"
                            value={formData.capacidad}
                            onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
                            className="col-span-3"
                            placeholder="Número de personas"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="ubicacion" className="text-right">
                            Ubicación
                        </Label>
                        <Input
                            id="ubicacion"
                            value={formData.ubicacion}
                            onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                            className="col-span-3"
                            placeholder="Ej: Salón Principal - Centro"
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Guardar Mesa</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
