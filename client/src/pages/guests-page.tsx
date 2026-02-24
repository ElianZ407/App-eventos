import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Mail, Phone, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

type GuestStatus = "confirmed" | "pending" | "cancelled"

interface Guest {
    id: string
    name: string
    email: string
    phone: string
    status: GuestStatus
    avatar?: string
    table?: string
}

const mockGuests: Guest[] = [
    {
        id: "1",
        name: "Ana García Martínez",
        email: "ana.garcia@email.com",
        phone: "+34 612 345 678",
        status: "confirmed",
        table: "Mesa 5",
    },
    {
        id: "2",
        name: "Carlos López Fernández",
        email: "carlos.lopez@email.com",
        phone: "+34 623 456 789",
        status: "confirmed",
        table: "Mesa 3",
    },
    {
        id: "3",
        name: "María Rodríguez Sánchez",
        email: "maria.rodriguez@email.com",
        phone: "+34 634 567 890",
        status: "pending",
        table: "Mesa 8",
    },
    {
        id: "4",
        name: "David Martín González",
        email: "david.martin@email.com",
        phone: "+34 645 678 901",
        status: "confirmed",
        table: "Mesa 2",
    },
    {
        id: "5",
        name: "Laura Pérez Ruiz",
        email: "laura.perez@email.com",
        phone: "+34 656 789 012",
        status: "cancelled",
        table: "-",
    },
    {
        id: "6",
        name: "Javier Sánchez Torres",
        email: "javier.sanchez@email.com",
        phone: "+34 667 890 123",
        status: "pending",
        table: "Mesa 12",
    },
    {
        id: "7",
        name: "Elena Jiménez Castro",
        email: "elena.jimenez@email.com",
        phone: "+34 678 901 234",
        status: "confirmed",
        table: "Mesa 7",
    },
    {
        id: "8",
        name: "Miguel Ángel Díaz Moreno",
        email: "miguel.diaz@email.com",
        phone: "+34 689 012 345",
        status: "confirmed",
        table: "Mesa 4",
    },
]

const statusConfig: Record<GuestStatus, { label: string; variant: "default" | "secondary" | "destructive" }> = {
    confirmed: { label: "Confirmado", variant: "default" },
    pending: { label: "Pendiente", variant: "secondary" },
    cancelled: { label: "Cancelado", variant: "destructive" },
}

export default function GuestsPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredGuests = mockGuests.filter(
        (guest) =>
            guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guest.email.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
    }

    return (
        <main className="flex-1 overflow-y-auto">
            <div className="border-b border-border bg-card">
                <div className="flex items-center justify-between px-8 py-6">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Invitados</h1>
                        <p className="text-sm text-muted-foreground">Gestiona tu lista de invitados y su estado</p>
                    </div>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Añadir Invitado
                    </Button>
                </div>
            </div>

            <div className="p-8">
                <div className="mb-6 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre o email..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="outline" className="gap-1 px-3 py-1">
                            <span className="h-2 w-2 rounded-full bg-green-600" />
                            Confirmados: {mockGuests.filter((g) => g.status === "confirmed").length}
                        </Badge>
                        <Badge variant="outline" className="gap-1 px-3 py-1">
                            <span className="h-2 w-2 rounded-full bg-yellow-600" />
                            Pendientes: {mockGuests.filter((g) => g.status === "pending").length}
                        </Badge>
                        <Badge variant="outline" className="gap-1 px-3 py-1">
                            <span className="h-2 w-2 rounded-full bg-red-600" />
                            Cancelados: {mockGuests.filter((g) => g.status === "cancelled").length}
                        </Badge>
                    </div>
                </div>

                <div className="rounded-lg border border-border bg-card overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[300px]">Invitado</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="hidden md:table-cell">Teléfono</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Mesa</TableHead>
                                <TableHead className="w-[80px]">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredGuests.map((guest) => (
                                <TableRow key={guest.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={guest.avatar || "/placeholder.svg"} />
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {getInitials(guest.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-foreground">{guest.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground italic md:not-italic">{guest.email}</TableCell>
                                    <TableCell className="text-muted-foreground hidden md:table-cell">{guest.phone}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusConfig[guest.status].variant}>{statusConfig[guest.status].label}</Badge>
                                    </TableCell>
                                    <TableCell className="font-medium text-foreground">{guest.table}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="gap-2">
                                                    <Edit className="h-4 w-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2">
                                                    <Mail className="h-4 w-4" />
                                                    Enviar Email
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2">
                                                    <Phone className="h-4 w-4" />
                                                    Llamar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {filteredGuests.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-muted-foreground">No se encontraron invitados</p>
                    </div>
                )}
            </div>
        </main>
    )
}
