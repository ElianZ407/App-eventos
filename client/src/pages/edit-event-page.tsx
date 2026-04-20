import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { cn } from "@/lib/utils"
import api from "@/lib/api"
import { LocationPicker } from "@/components/location-picker"

const EVENT_TYPES = ["Boda", "XV Años", "Cumpleaños", "Bautizo", "Graduación", "Conferencia", "Corporativo", "Fiesta Privada", "Otro"]
type Step = 1 | 2 | 3

const dbTipoToDisplay = (tipo: string) => {
    if (tipo === "Fiesta_Privada") return "Fiesta Privada"
    if (tipo === "XV_Anos") return "XV Años"
    return tipo
}

const toDateInput = (fechaIso: string) => {
    try { return new Date(fechaIso).toISOString().split("T")[0] } catch { return "" }
}

export default function EditEventPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState<Step>(1)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        nombre: "", fecha: "", hora: "", tipo: "Otro", descripcion: "",
        totalInvitados: 0, lugarNombre: "", direccion: "", ciudad: "",
        codigoPostal: "", pais: "España", lugarTelefono: "", puntoReferencia: "",
        nombreOrganizador: "", emailOrganizador: "", telefonoOrganizador: "",
        codigoVestimenta: "", notasEspeciales: ""
    })

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/eventos/${id}`)
                const e = res.data
                setFormData({
                    nombre: e.nombre || "", fecha: toDateInput(e.fecha), hora: e.hora || "",
                    tipo: dbTipoToDisplay(e.tipo || "Otro"), descripcion: e.descripcion || "",
                    totalInvitados: e.totalInvitados || 0, lugarNombre: e.lugarNombre || "",
                    direccion: e.direccion || "", ciudad: e.ciudad || "", codigoPostal: e.codigoPostal || "",
                    pais: e.pais || "España", lugarTelefono: e.lugarTelefono || "",
                    puntoReferencia: e.puntoReferencia || "", nombreOrganizador: e.nombreOrganizador || "",
                    emailOrganizador: e.emailOrganizador || "", telefonoOrganizador: e.telefonoOrganizador || "",
                    codigoVestimenta: e.codigoVestimenta || "", notasEspeciales: e.notasEspeciales || ""
                })
            } catch { setError("No se pudo cargar el evento") }
            finally { setIsFetching(false) }
        }
        if (id) fetchEvent()
    }, [id])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id: fieldId, value } = e.target
        const fieldMap: Record<string, string> = {
            "event-name": "nombre", "event-date": "fecha", "event-time": "hora",
            "event-description": "descripcion", "total-guests": "totalInvitados",
            "venue-name": "lugarNombre", "address": "direccion", "city": "ciudad",
            "postal-code": "codigoPostal", "country": "pais", "venue-phone": "lugarTelefono",
            "parking": "puntoReferencia", "organizer-name": "nombreOrganizador",
            "organizer-email": "emailOrganizador", "organizer-phone": "telefonoOrganizador",
            "dress-code": "codigoVestimenta", "special-notes": "notasEspeciales"
        }
        const field = fieldMap[fieldId]
        if (field) setFormData(prev => ({ ...prev, [field]: field === "totalInvitados" ? Number(value) : value }))
    }

    const handleSave = async () => {
        setIsLoading(true); setError(null)
        try {
            await api.put(`/eventos/${id}`, formData)
            navigate(`/events/${id}`)
        } catch (err: any) {
            setError(err.response?.data?.error || "Error al guardar el evento")
        } finally { setIsLoading(false) }
    }

    const steps = [
        { number: 1, title: "Información Básica", description: "Datos principales" },
        { number: 2, title: "Ubicación", description: "Lugar del evento" },
        { number: 3, title: "Ajustes", description: "Configuración adicional" },
    ]

    if (isFetching) return <div className="flex h-screen items-center justify-center">Cargando evento...</div>

    return (
        <main className="flex-1 overflow-y-auto">
            <div className="border-b border-border bg-card">
                <div className="px-8 py-6">
                    <Link to={`/events/${id}`}>
                        <Button variant="ghost" size="sm" className="mb-4 gap-2"><ArrowLeft className="h-4 w-4" />Volver al Evento</Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-foreground">Editar Evento</h1>
                    <p className="text-sm text-muted-foreground">Modifica los datos de tu evento</p>
                </div>
            </div>

            <div className="p-8">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-8 flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex flex-1 items-center">
                                <div className="flex flex-col items-center">
                                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors", currentStep === step.number ? "border-primary bg-primary text-primary-foreground" : currentStep > step.number ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground")}>
                                        {currentStep > step.number ? <Check className="h-5 w-5" /> : step.number}
                                    </div>
                                    <div className="mt-2 text-center">
                                        <p className={cn("text-sm font-medium", currentStep >= step.number ? "text-foreground" : "text-muted-foreground")}>{step.title}</p>
                                        <p className="text-xs text-muted-foreground hidden sm:block">{step.description}</p>
                                    </div>
                                </div>
                                {index < steps.length - 1 && <div className={cn("mx-4 h-[2px] flex-1 transition-colors", currentStep > step.number ? "bg-primary" : "bg-border")} />}
                            </div>
                        ))}
                    </div>

                    <Card>
                        <CardHeader><CardTitle>{steps[currentStep - 1].title}</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            {error && <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md border border-destructive/20 text-center">{error}</div>}

                            {currentStep === 1 && (
                                <>
                                    <div className="space-y-2"><Label htmlFor="event-name">Nombre del Evento *</Label><Input id="event-name" value={formData.nombre} onChange={handleInputChange} required /></div>
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-2"><Label htmlFor="event-date">Fecha *</Label><Input id="event-date" type="date" value={formData.fecha} onChange={handleInputChange} required /></div>
                                        <div className="space-y-2"><Label htmlFor="event-time">Hora *</Label><Input id="event-time" type="time" value={formData.hora} onChange={handleInputChange} required /></div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tipo de Evento</Label>
                                        <Select value={formData.tipo} onValueChange={(v) => setFormData(p => ({ ...p, tipo: v }))}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>{EVENT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2"><Label htmlFor="event-description">Descripción</Label><Textarea id="event-description" rows={4} value={formData.descripcion} onChange={handleInputChange} /></div>
                                    <div className="space-y-2"><Label htmlFor="total-guests">Total de Invitados *</Label><Input id="total-guests" type="number" className="max-w-[200px]" value={formData.totalInvitados} onChange={handleInputChange} required /></div>
                                </>
                            )}

                            {currentStep === 2 && (
                                <>
                                    <LocationPicker
                                        initialLat={40.4168}
                                        initialLon={-3.7038}
                                        onSelect={(loc) => setFormData(p => ({
                                            ...p,
                                            lugarNombre: loc.lugarNombre || p.lugarNombre,
                                            direccion: loc.direccion,
                                            ciudad: loc.ciudad,
                                            codigoPostal: loc.codigoPostal,
                                            pais: loc.pais,
                                        }))}
                                    />
                                    <div className="space-y-2"><Label htmlFor="venue-name">Nombre del Lugar</Label><Input id="venue-name" value={formData.lugarNombre} onChange={handleInputChange} /></div>
                                    <div className="space-y-2"><Label htmlFor="address">Dirección</Label><Input id="address" value={formData.direccion} onChange={handleInputChange} /></div>
                                    <div className="grid gap-6 sm:grid-cols-3">
                                        <div className="space-y-2"><Label htmlFor="city">Ciudad</Label><Input id="city" value={formData.ciudad} onChange={handleInputChange} /></div>
                                        <div className="space-y-2"><Label htmlFor="postal-code">Código Postal</Label><Input id="postal-code" value={formData.codigoPostal} onChange={handleInputChange} /></div>
                                        <div className="space-y-2"><Label htmlFor="country">País</Label><Input id="country" value={formData.pais} onChange={handleInputChange} /></div>
                                    </div>
                                    <div className="space-y-2"><Label htmlFor="venue-phone">Teléfono del Lugar</Label><Input id="venue-phone" type="tel" value={formData.lugarTelefono} onChange={handleInputChange} /></div>
                                    <div className="space-y-2"><Label htmlFor="parking">Punto de Referencia</Label><Textarea id="parking" rows={3} value={formData.puntoReferencia} onChange={handleInputChange} /></div>
                                </>
                            )}

                            {currentStep === 3 && (
                                <>
                                    <div className="space-y-2"><Label htmlFor="organizer-name">Nombre del Organizador</Label><Input id="organizer-name" value={formData.nombreOrganizador} onChange={handleInputChange} /></div>
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-2"><Label htmlFor="organizer-email">Email de Contacto</Label><Input id="organizer-email" type="email" value={formData.emailOrganizador} onChange={handleInputChange} /></div>
                                        <div className="space-y-2"><Label htmlFor="organizer-phone">Teléfono de Contacto</Label><Input id="organizer-phone" type="tel" value={formData.telefonoOrganizador} onChange={handleInputChange} /></div>
                                    </div>
                                    <div className="space-y-2"><Label htmlFor="dress-code">Código de Vestimenta</Label><Input id="dress-code" value={formData.codigoVestimenta} onChange={handleInputChange} /></div>
                                    <div className="space-y-2"><Label htmlFor="special-notes">Notas Especiales</Label><Textarea id="special-notes" rows={4} value={formData.notasEspeciales} onChange={handleInputChange} /></div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <div className="mt-6 flex items-center justify-between">
                        <Button variant="outline" onClick={() => setCurrentStep(s => (s - 1) as Step)} disabled={currentStep === 1}><ArrowLeft className="mr-2 h-4 w-4" />Anterior</Button>
                        {currentStep < 3
                            ? <Button onClick={() => setCurrentStep(s => (s + 1) as Step)}>Siguiente<ArrowRight className="ml-2 h-4 w-4" /></Button>
                            : <Button onClick={handleSave} disabled={isLoading} className="gap-2">
                                {isLoading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : <Check className="h-4 w-4" />}
                                {isLoading ? "Guardando..." : "Guardar Cambios"}
                            </Button>
                        }
                    </div>
                </div>
            </div>
        </main>
    )
}
