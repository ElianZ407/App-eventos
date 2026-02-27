import api from "@/lib/api"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, MapPin, Edit, Trash2 } from "lucide-react"
import { AddTableModal } from "@/components/add-table-modal"
import { EditTableModal } from "@/components/edit-table-modal"
import { ConfirmDeleteModal } from "@/components/confirm-delete-modal"

export default function TablesPage() {
    const { id: eventoId } = useParams<{ id: string }>();
    const [tables, setTables] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchTables = async () => {
            if (!eventoId) return;
            try {
                const response = await api.get(`/mesas/${eventoId}`)
                setTables(Array.isArray(response.data) ? response.data : [])
            } catch (error) {
                console.error("Error fetching tables:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchTables()
    }, [eventoId])

    const handleAddTable = async (newTable: any) => {
        try {
            const response = await api.post("/mesas", {
                ...newTable,
                eventoId
            })
            setTables([...tables, response.data])
        } catch (error) {
            console.error("Error adding table:", error)
            alert("Error al crear la mesa")
        }
    }

    const handleUpdateTable = async (updatedTable: any) => {
        try {
            const response = await api.put(`/mesas/${updatedTable.id}`, updatedTable)
            setTables(tables.map((t) => (t.id === updatedTable.id ? response.data : t)))
        } catch (error) {
            console.error("Error updating table:", error)
            alert("Error al actualizar la mesa")
        }
    }

    const handleDeleteTable = async (id: number) => {
        try {
            await api.delete(`/mesas/${id}`)
            setTables(tables.filter((t) => t.id !== id))
        } catch (error) {
            console.error("Error deleting table:", error)
            alert("Error al eliminar la mesa")
        }
    }

    const totalCapacity = tables.reduce((acc, table) => acc + table.capacidad, 0)
    const totalAssigned = tables.reduce((acc, table) => acc + (table.invitados?.length || 0), 0)
    const occupancyRate = totalCapacity > 0 ? ((totalAssigned / totalCapacity) * 100).toFixed(1) : "0"

    return (
        <main className="flex-1 overflow-y-auto">
            <div className="border-b border-border bg-card">
                <div className="flex items-center justify-between px-8 py-6">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Gestión de Mesas</h1>
                        <p className="text-sm text-muted-foreground">Organiza la distribución de invitados por mesa</p>
                    </div>
                    <AddTableModal onAddTable={handleAddTable} />
                </div>
            </div>

            <div className="p-8">
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Total de Mesas</CardDescription>
                            <CardTitle className="text-3xl">{tables.length}</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Capacidad Total</CardDescription>
                            <CardTitle className="text-3xl">{totalCapacity}</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Tasa de Ocupación</CardDescription>
                            <CardTitle className="text-3xl">{occupancyRate}%</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {tables.map((table) => {
                        const assigned = table.invitados?.length || 0;
                        const status = assigned >= table.capacidad ? "full" : (assigned > 0 ? "partial" : "empty");
                        const statusLabel = status === "full" ? "Completa" : status === "partial" ? "Parcial" : "Vacía";
                        const statusVariant = status === "full" ? "default" : status === "partial" ? "secondary" : "outline";

                        return (
                            <Card key={table.id} className="overflow-hidden">
                                <CardHeader className="bg-secondary/30 pb-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg">Mesa {table.numero}</CardTitle>
                                            <CardDescription className="mt-1 flex items-center gap-1 text-xs">
                                                <MapPin className="h-3 w-3" />
                                                {table.ubicacion || "Sin ubicación"}
                                            </CardDescription>
                                        </div>
                                        <Badge variant={statusVariant}>
                                            {statusLabel}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-4">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Users className="h-4 w-4" />
                                            <span>
                                                {assigned} / {table.capacidad} invitados
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-4 h-2 overflow-hidden rounded-full bg-secondary">
                                        <div
                                            className="h-full bg-primary transition-all"
                                            style={{ width: `${(assigned / table.capacidad) * 100}%` }}
                                        />
                                    </div>

                                    {table.invitados && table.invitados.length > 0 && (
                                        <div className="mb-4 space-y-1">
                                            {table.invitados.slice(0, 3).map((invitado: any, index: number) => (
                                                <p key={index} className="text-xs text-muted-foreground">
                                                    • {invitado.nombre}
                                                </p>
                                            ))}
                                            {table.invitados.length > 3 && (
                                                <p className="text-xs text-muted-foreground">+ {table.invitados.length - 3} más...</p>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <EditTableModal table={table} onUpdateTable={handleUpdateTable} />
                                        <ConfirmDeleteModal
                                            title={`¿Eliminar Mesa ${table.numero}?`}
                                            description="Esta acción eliminará la mesa y desasignará a todos los invitados que estén en ella actualmente."
                                            onConfirm={() => handleDeleteTable(table.id)}
                                            trigger={
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-1 text-destructive bg-transparent"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </main>
    )
}
