import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Users, CheckCircle2, Clock, Calendar, MapPin, ArrowLeft, Mail, UtensilsCrossed, UserPlus, Edit, Trash2 } from "lucide-react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import api from "@/lib/api"

export default function EventDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [event, setEvent] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isSending, setIsSending] = useState(false)

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/eventos/${id}`)
                setEvent(response.data)
            } catch (error) {
                console.error("Error fetching event:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchEvent()
    }, [id])

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await api.delete(`/eventos/${id}`)
            navigate("/")
        } catch {
            alert("Error al eliminar el evento")
            setIsDeleting(false)
            setDeleteOpen(false)
        }
    }

    const handleSendAll = async () => {
        const pendientes = event?.invitados?.filter((i: any) => i.estado === "pendiente" && i.email)
        if (!pendientes?.length) { alert("No hay invitados pendientes con email registrado"); return }
        setIsSending(true)
        try {
            const res = await api.post("/invitados/enviar-todas", { eventoId: id })
            alert(res.data.message)
        } catch { alert("Error al enviar las invitaciones") }
        finally { setIsSending(false) }
    }

    if (isLoading) return <div className="flex h-screen items-center justify-center">Cargando evento...</div>
    if (!event) return <div className="p-8">Evento no encontrado</div>

    const invitados = event.invitados || []
    const totalInvitados = event.totalInvitados || 0
    const confirmados = invitados.filter((i: any) => i.estado === "confirmado").length
    const pendientes = invitados.filter((i: any) => i.estado === "pendiente").length
    const cancelados = invitados.filter((i: any) => i.estado === "cancelado").length
    const confirmedPercent = totalInvitados > 0 ? (confirmados / totalInvitados) * 100 : 0
    const pendingPercent = totalInvitados > 0 ? (pendientes / totalInvitados) * 100 : 0
    const cancelledPercent = totalInvitados > 0 ? (cancelados / totalInvitados) * 100 : 0

    return (
        <main className="flex-1 overflow-y-auto">
            <div className="border-b border-border bg-card">
                <div className="px-8 py-6">
                    <div className="mb-4">
                        <Link to="/"><Button variant="ghost" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" />Volver al Dashboard</Button></Link>
                    </div>
                    <div className="flex items-start justify-between">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-foreground">{event.nombre}</h1>
                                <Badge>{event.estado === "proximo" ? "Próximo" : event.estado === "pasado" ? "Pasado" : "Activo"}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{new Date(event.fecha).toLocaleDateString()}</span></div>
                                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{event.lugarNombre || "Sin ubicación"}</span></div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link to={`/events/${id}/guests`}><Button variant="outline" size="sm" className="gap-2 bg-transparent text-primary border-primary"><UserPlus className="h-4 w-4" />Invitados</Button></Link>
                            <Link to={`/events/${id}/tables`}><Button variant="outline" size="sm" className="gap-2 bg-transparent text-primary border-primary"><UtensilsCrossed className="h-4 w-4" />Mesas</Button></Link>
                            <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleSendAll} disabled={isSending}>
                                <Mail className="h-4 w-4" />{isSending ? "Enviando..." : "Enviar Invitaciones"}
                            </Button>
                            <Link to={`/events/${id}/edit`}><Button variant="outline" size="sm" className="gap-2 bg-transparent"><Edit className="h-4 w-4" />Editar</Button></Link>
                            <Button variant="outline" size="sm" className="gap-2 bg-transparent text-destructive border-destructive hover:bg-destructive/10" onClick={() => setDeleteOpen(true)}>
                                <Trash2 className="h-4 w-4" />Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Total de Invitados" value={totalInvitados.toString()} icon={Users} description="Capacidad máxima" />
                    <StatCard title="Confirmados" value={confirmados.toString()} icon={CheckCircle2} trend={{ value: `${confirmedPercent.toFixed(1)}% del total`, isPositive: true }} />
                    <StatCard title="Pendientes" value={pendientes.toString()} icon={Clock} description="Esperando respuesta" />
                    <StatCard title="Cancelados" value={cancelados.toString()} icon={Users} description="No asistirán" />
                </div>
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" />Distribución de Invitados</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {[["Confirmados", confirmados, confirmedPercent, "bg-green-600"], ["Pendientes", pendientes, pendingPercent, "bg-yellow-600"], ["Cancelados", cancelados, cancelledPercent, "bg-red-600"]].map(([label, count, pct, color]) => (
                            <div key={label as string} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">{label as string}</span>
                                    <span className="text-sm font-semibold">{count as number} ({(pct as number).toFixed(1)}%)</span>
                                </div>
                                <Progress value={pct as number} className={`h-2 bg-secondary/50 [&>div]:${color}`} />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader><DialogTitle>¿Eliminar evento?</DialogTitle></DialogHeader>
                    <p className="text-sm text-muted-foreground">Esta acción eliminará permanentemente <strong>{event.nombre}</strong> junto con todos sus invitados y mesas. No se puede deshacer.</p>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancelar</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>{isDeleting ? "Eliminando..." : "Eliminar Evento"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    )
}
