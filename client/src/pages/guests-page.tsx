import api from "@/lib/api"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Mail, Edit, Trash2 } from "lucide-react"
import { AddGuestModal } from "@/components/add-guest-modal"
import { EditGuestModal } from "@/components/edit-guest-modal"
import { ConfirmDeleteModal } from "@/components/confirm-delete-modal"

type GuestStatus = "confirmado" | "pendiente" | "cancelado"

interface Guest {
    id: number
    nombre: string
    email: string
    telefono: string
    estado: GuestStatus
    mesa?: { numero: number } | string
}

const statusConfig: Record<GuestStatus, { label: string; variant: "default" | "secondary" | "destructive" }> = {
    confirmado: { label: "Confirmado", variant: "default" },
    pendiente: { label: "Pendiente", variant: "secondary" },
    cancelado: { label: "Cancelado", variant: "destructive" },
}

export default function GuestsPage() {
    const { id: eventoId } = useParams<{ id: string }>();
    const [guests, setGuests] = useState<Guest[]>([])
    const [tables, setTables] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [guestToDelete, setGuestToDelete] = useState<number | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            if (!eventoId) return;
            try {
                const [guestsRes, tablesRes] = await Promise.all([
                    api.get(`/invitados/${eventoId}`),
                    api.get(`/mesas/${eventoId}`)
                ])
                setGuests(Array.isArray(guestsRes.data) ? guestsRes.data : [])
                setTables(Array.isArray(tablesRes.data) ? tablesRes.data : [])
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [eventoId])

    const handleAddGuest = async (newGuest: any) => {
        try {
            const response = await api.post("/invitados", {
                ...newGuest,
                eventoId
            })
            setGuests([...guests, response.data])
        } catch (error) {
            console.error("Error adding guest:", error)
            alert("Error al añadir invitado")
        }
    }

    const handleUpdateGuest = async (updatedGuest: any) => {
        try {
            const response = await api.put(`/invitados/${updatedGuest.id}`, updatedGuest)
            setGuests(guests.map((g) => (g.id === updatedGuest.id ? response.data : g)))
        } catch (error) {
            console.error("Error updating guest:", error)
            alert("Error al actualizar invitado")
        }
    }

    const confirmDeleteGuest = async () => {
        if (guestToDelete) {
            try {
                await api.delete(`/invitados/${guestToDelete}`)
                setGuests(guests.filter((g) => g.id !== guestToDelete))
                setGuestToDelete(null)
                setIsDeleteModalOpen(false)
            } catch (error) {
                console.error("Error deleting guest:", error)
                alert("Error al eliminar invitado")
            }
        }
    }

    const handleSendInvitation = async (guestId: number) => {
        try {
            const response = await api.post("/invitados/enviar-invitacion", { invitadoId: guestId })
            alert(response.data.message || "Invitación enviada")
        } catch (error) {
            console.error("Error sending invitation:", error)
            alert("Error al enviar la invitación")
        }
    }

    const handleDeleteClick = (id: number) => {
        setGuestToDelete(id)
        setIsDeleteModalOpen(true)
    }


    const openEditModal = (guest: Guest) => {
        setEditingGuest(guest)
        setIsEditModalOpen(true)
    }

    const filteredGuests = guests.filter(
        (guest) =>
            (guest.nombre?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (guest.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()),
    )

    const getInitials = (nombre: string) => {
        if (!nombre) return "??";
        return nombre
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
                    <AddGuestModal onAddGuest={handleAddGuest} tables={tables} />
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
                            Confirmados: {guests.filter((g) => g.estado === "confirmado").length}
                        </Badge>
                        <Badge variant="outline" className="gap-1 px-3 py-1">
                            <span className="h-2 w-2 rounded-full bg-yellow-600" />
                            Pendientes: {guests.filter((g) => g.estado === "pendiente").length}
                        </Badge>
                        <Badge variant="outline" className="gap-1 px-3 py-1">
                            <span className="h-2 w-2 rounded-full bg-red-600" />
                            Cancelados: {guests.filter((g) => g.estado === "cancelado").length}
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
                                                <AvatarImage src={"/placeholder.svg"} />
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {getInitials(guest.nombre)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-foreground">{guest.nombre}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground italic md:not-italic">{guest.email}</TableCell>
                                    <TableCell className="text-muted-foreground hidden md:table-cell">{guest.telefono}</TableCell>
                                    <TableCell>
                                        <Badge variant={(statusConfig[guest.estado] || statusConfig.pendiente).variant}>
                                            {(statusConfig[guest.estado] || statusConfig.pendiente).label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium text-foreground">
                                        {guest.mesa && typeof guest.mesa === 'object' ? `Mesa ${guest.mesa.numero}` : guest.mesa || "-"}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="gap-2" onClick={() => openEditModal(guest)}>
                                                    <Edit className="h-4 w-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2" onClick={() => handleSendInvitation(guest.id)}>
                                                    <Mail className="h-4 w-4" />
                                                    Enviar Email
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                                                    onClick={() => {
                                                        setGuestToDelete(Number(guest.id))
                                                        setIsDeleteModalOpen(true)
                                                    }}
                                                >
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
                        <p className="text-muted-foreground">{isLoading ? "Cargando..." : "No se encontraron invitados"}</p>
                    </div>
                )}
            </div>

            <EditGuestModal
                guest={editingGuest}
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                onUpdateGuest={handleUpdateGuest}
                tables={tables}
            />

            <ConfirmDeleteModal
                title={`¿Eliminar a ${guests.find(g => g.id === guestToDelete)?.nombre || 'este invitado'}?`}
                description="Esta acción es permanente y no se podrá deshacer. El invitado será removido de su mesa asignada."
                onConfirm={confirmDeleteGuest}
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
            />
        </main>
    )
}
