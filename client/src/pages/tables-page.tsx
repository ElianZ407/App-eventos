import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, MapPin, Edit, Trash2 } from "lucide-react"
import { AddTableModal } from "@/components/add-table-modal"
import { EditTableModal } from "@/components/edit-table-modal"
import { useState } from "react"

const initialTables = [
    {
        id: "1",
        number: 1,
        capacity: 8,
        assigned: 8,
        location: "Salón Principal - Frente",
        status: "full" as const,
        guests: [
            "Ana García",
            "Luis Martínez",
            "Carmen López",
            "Pedro Sánchez",
            "María Ruiz",
            "José Torres",
            "Laura Díaz",
            "Miguel Ángel",
        ],
    },
    {
        id: "2",
        number: 2,
        capacity: 10,
        assigned: 7,
        location: "Salón Principal - Centro",
        status: "partial" as const,
        guests: [
            "Elena Fernández",
            "Carlos Moreno",
            "Isabel Romero",
            "Francisco Gil",
            "Rosa Navarro",
            "Antonio Serrano",
            "Pilar Castro",
        ],
    },
    {
        id: "3",
        number: 3,
        capacity: 6,
        assigned: 0,
        location: "Salón Principal - Izquierda",
        status: "empty" as const,
        guests: [],
    },
    {
        id: "4",
        number: 4,
        capacity: 8,
        assigned: 5,
        location: "Terraza - Esquina",
        status: "partial" as const,
        guests: ["Lucía Herrera", "David Blanco", "Marta Vega", "Raúl Molina", "Silvia Ortiz"],
    },
    {
        id: "5",
        number: 5,
        capacity: 12,
        assigned: 12,
        location: "Salón VIP",
        status: "full" as const,
        guests: [
            "Jorge Ramírez",
            "Patricia Jiménez",
            "Alberto Muñoz",
            "Beatriz Alonso",
            "Sergio Márquez",
            "Cristina Santos",
            "Fernando Iglesias",
            "Nuria Pascual",
            "Javier Ramos",
            "Amparo Fuentes",
            "Gonzalo Guerrero",
            "Montserrat Prieto",
        ],
    },
    {
        id: "6",
        number: 6,
        capacity: 8,
        assigned: 0,
        location: "Terraza - Centro",
        status: "empty" as const,
        guests: [],
    },
]

export default function TablesPage() {
    const [tables, setTables] = useState(initialTables)

    const handleAddTable = (newTable: any) => {
        const table = {
            ...newTable,
            id: (tables.length + 1).toString(),
            assigned: 0,
            status: "empty" as const,
            guests: [],
            number: parseInt(newTable.number),
            capacity: parseInt(newTable.capacity),
        }
        setTables([...tables, table])
    }

    const handleUpdateTable = (updatedTable: any) => {
        setTables(tables.map((t) => (t.id === updatedTable.id ? updatedTable : t)))
    }

    const handleDeleteTable = (id: string) => {
        if (confirm("¿Estás seguro de que deseas eliminar esta mesa?")) {
            setTables(tables.filter((t) => t.id !== id))
        }
    }

    const totalCapacity = tables.reduce((acc, table) => acc + table.capacity, 0)
    const totalAssigned = tables.reduce((acc, table) => acc + table.assigned, 0)
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
                    {tables.map((table) => (
                        <Card key={table.id} className="overflow-hidden">
                            <CardHeader className="bg-secondary/30 pb-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">Mesa {table.number}</CardTitle>
                                        <CardDescription className="mt-1 flex items-center gap-1 text-xs">
                                            <MapPin className="h-3 w-3" />
                                            {table.location}
                                        </CardDescription>
                                    </div>
                                    <Badge
                                        variant={
                                            table.status === "full" ? "default" : table.status === "partial" ? "secondary" : "outline"
                                        }
                                    >
                                        {table.status === "full" ? "Completa" : table.status === "partial" ? "Parcial" : "Vacía"}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users className="h-4 w-4" />
                                        <span>
                                            {table.assigned} / {table.capacity} invitados
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-4 h-2 overflow-hidden rounded-full bg-secondary">
                                    <div
                                        className="h-full bg-primary transition-all"
                                        style={{ width: `${(table.assigned / table.capacity) * 100}%` }}
                                    />
                                </div>

                                {table.guests.length > 0 && (
                                    <div className="mb-4 space-y-1">
                                        {table.guests.slice(0, 3).map((guest, index) => (
                                            <p key={index} className="text-xs text-muted-foreground">
                                                • {guest}
                                            </p>
                                        ))}
                                        {table.guests.length > 3 && (
                                            <p className="text-xs text-muted-foreground">+ {table.guests.length - 3} más...</p>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <EditTableModal table={table} onUpdateTable={handleUpdateTable} />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1 text-destructive bg-transparent"
                                        onClick={() => handleDeleteTable(table.id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    )
}
