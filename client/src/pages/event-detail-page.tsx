import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Users, CheckCircle2, Clock, Calendar, MapPin, ArrowLeft, Mail, Phone, UtensilsCrossed, UserPlus } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import api from "@/lib/api"

export default function EventDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/eventos`)
                // Find this specific event since the get /eventos returns all user events
                const foundEvent = Array.isArray(response.data)
                    ? response.data.find((e: any) => String(e.id) === id)
                    : null
                setEvent(foundEvent)
            } catch (error) {
                console.error("Error fetching event:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchEvent()
    }, [id])

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Cargando evento...</div>
    }

    if (!event) {
        return <div className="p-8">Evento no encontrado</div>
    }

    const invitados = event.invitados || []
    const totalInvitados = event.totalInvitados || 0
    const confirmados = invitados.filter((i: any) => i.estado === 'confirmado').length
    const pendientes = invitados.filter((i: any) => i.estado === 'pendiente').length
    const cancelados = invitados.filter((i: any) => i.estado === 'cancelado').length

    const confirmedPercent = totalInvitados > 0 ? (confirmados / totalInvitados) * 100 : 0
    const pendingPercent = totalInvitados > 0 ? (pendientes / totalInvitados) * 100 : 0
    const cancelledPercent = totalInvitados > 0 ? (cancelados / totalInvitados) * 100 : 0

    return (
        <main className="flex-1 overflow-y-auto">
            <div className="border-b border-border bg-card">
                <div className="px-8 py-6">
                    <div className="mb-4">
                        <Link to="/">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Volver al Dashboard
                            </Button>
                        </Link>
                    </div>

                    <div className="flex items-start justify-between">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-foreground">{event.nombre}</h1>
                                <Badge>{event.estado === 'proximo' ? 'Próximo' : (event.estado === 'pasado' ? 'Pasado' : 'Activo')}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(event.fecha).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{event.lugarNombre || "Sin ubicación"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Link to={`/events/${id}/guests`}>
                                <Button variant="outline" size="sm" className="gap-2 bg-transparent text-primary border-primary">
                                    <UserPlus className="h-4 w-4" />
                                    Gestionar Invitados
                                </Button>
                            </Link>
                            <Link to={`/events/${id}/tables`}>
                                <Button variant="outline" size="sm" className="gap-2 bg-transparent text-primary border-primary">
                                    <UtensilsCrossed className="h-4 w-4" />
                                    Gestionar Mesas
                                </Button>
                            </Link>
                            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                                <Mail className="h-4 w-4" />
                                Enviar Invitaciones
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Total de Invitados" value={totalInvitados.toString()} icon={Users} description="Capacidad máxima" />
                    <StatCard
                        title="Confirmados"
                        value={confirmados.toString()}
                        icon={CheckCircle2}
                        trend={{ value: `${confirmedPercent.toFixed(1)}% del total`, isPositive: true }}
                    />
                    <StatCard title="Pendientes" value={pendientes.toString()} icon={Clock} description="Esperando respuesta" />
                    <StatCard title="Cancelados" value={cancelados.toString()} icon={Users} description="No asistirán" />
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Distribución de Invitados
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Confirmados</span>
                                    <span className="text-sm font-semibold text-foreground">{confirmados} ({confirmedPercent.toFixed(1)}%)</span>
                                </div>
                                <Progress value={confirmedPercent} className="h-2 bg-secondary/50 [&>div]:bg-green-600" />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Pendientes</span>
                                    <span className="text-sm font-semibold text-foreground">{pendientes} ({pendingPercent.toFixed(1)}%)</span>
                                </div>
                                <Progress value={pendingPercent} className="h-2 bg-secondary/50 [&>div]:bg-yellow-600" />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Cancelados</span>
                                    <span className="text-sm font-semibold text-foreground">{cancelados} ({cancelledPercent.toFixed(1)}%)</span>
                                </div>
                                <Progress value={cancelledPercent} className="h-2 bg-secondary/50 [&>div]:bg-red-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}
