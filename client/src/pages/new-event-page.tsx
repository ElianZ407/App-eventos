import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import api from "@/lib/api"
import { LocationPicker } from "@/components/location-picker"

const EVENT_TYPES = [
    "Boda",
    "XV Años",
    "Cumpleaños",
    "Bautizo",
    "Graduación",
    "Conferencia",
    "Corporativo",
    "Fiesta Privada",
    "Otro"
]

type Step = 1 | 2 | 3

export default function NewEventPage() {
    const [currentStep, setCurrentStep] = useState<Step>(1)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate();

    // Form states
    const [formData, setFormData] = useState({
        nombre: "",
        fecha: "",
        hora: "",
        tipo: "Otro",
        descripcion: "",
        totalInvitados: 0,
        lugarNombre: "",
        direccion: "",
        ciudad: "",
        codigoPostal: "",
        pais: "España",
        lugarTelefono: "",
        puntoReferencia: "",
        nombreOrganizador: "",
        emailOrganizador: "",
        telefonoOrganizador: "",
        codigoVestimenta: "",
        notasEspeciales: ""
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        const fieldMap: { [key: string]: string } = {
            'event-name': 'nombre',
            'event-date': 'fecha',
            'event-time': 'hora',
            'event-description': 'descripcion',
            'total-guests': 'totalInvitados',
            'venue-name': 'lugarNombre',
            'address': 'direccion',
            'city': 'ciudad',
            'postal-code': 'codigoPostal',
            'country': 'pais',
            'venue-phone': 'lugarTelefono',
            'parking': 'puntoReferencia',
            'organizer-name': 'nombreOrganizador',
            'organizer-email': 'emailOrganizador',
            'organizer-phone': 'telefonoOrganizador',
            'dress-code': 'codigoVestimenta',
            'special-notes': 'notasEspeciales'
        }

        const field = fieldMap[id]
        if (field) {
            setFormData(prev => ({
                ...prev,
                [field]: field === 'totalInvitados' ? Number(value) : value
            }))
        }
    }

    const setEventType = (value: string) => {
        setFormData(prev => ({ ...prev, tipo: value }))
    }

    const steps = [
        { number: 1, title: "Información Básica", description: "Datos principales del evento" },
        { number: 2, title: "Ubicación", description: "Lugar y detalles de localización" },
        { number: 3, title: "Ajustes", description: "Configuración adicional" },
    ]

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep((currentStep + 1) as Step)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep((currentStep - 1) as Step)
        }
    }

    const handleCreate = async () => {
        setIsLoading(true)
        setError(null)
        try {
            await api.post("/eventos", formData)
            navigate("/")
        } catch (err: any) {
            console.error(err)
            setError(err.response?.data?.error || "Error al crear el evento")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="flex-1 overflow-y-auto">
            <div className="border-b border-border bg-card">
                <div className="px-8 py-6">
                    <Link to="/">
                        <Button variant="ghost" size="sm" className="mb-4 gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Volver al Dashboard
                        </Button>
                    </Link>

                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Crear Nuevo Evento</h1>
                        <p className="text-sm text-muted-foreground">Completa los siguientes pasos para crear tu evento</p>
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="mx-auto max-w-3xl">
                    {/* Stepper */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => (
                                <div key={step.number} className="flex flex-1 items-center">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={cn(
                                                "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                                                currentStep === step.number
                                                    ? "border-primary bg-primary text-primary-foreground"
                                                    : currentStep > step.number
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : "border-border bg-card text-muted-foreground",
                                            )}
                                        >
                                            {currentStep > step.number ? <Check className="h-5 w-5" /> : step.number}
                                        </div>
                                        <div className="mt-2 text-center">
                                            <p
                                                className={cn(
                                                    "text-sm font-medium",
                                                    currentStep >= step.number ? "text-foreground" : "text-muted-foreground",
                                                )}
                                            >
                                                {step.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground hidden sm:block">{step.description}</p>
                                        </div>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={cn(
                                                "mx-4 h-[2px] flex-1 transition-colors",
                                                currentStep > step.number ? "bg-primary" : "bg-border",
                                            )}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step Content */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {error && (
                                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md border border-destructive/20 text-center">
                                    {error}
                                </div>
                            )}
                            {currentStep === 1 && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="event-name">Nombre del Evento *</Label>
                                        <Input
                                            id="event-name"
                                            placeholder="Ej: Boda García-López"
                                            value={formData.nombre}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="event-date">Fecha del Evento *</Label>
                                            <Input
                                                id="event-date"
                                                type="date"
                                                value={formData.fecha}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="event-time">Hora *</Label>
                                            <Input
                                                id="event-time"
                                                type="time"
                                                value={formData.hora}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="event-type">Tipo de Evento *</Label>
                                        <Select value={formData.tipo} onValueChange={setEventType}>
                                            <SelectTrigger id="event-type">
                                                <SelectValue placeholder="Selecciona el tipo de evento" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {EVENT_TYPES.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="event-description">Descripción</Label>
                                        <Textarea
                                            id="event-description"
                                            placeholder="Describe tu evento..."
                                            rows={4}
                                            value={formData.descripcion}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="total-guests">Total de Invitados *</Label>
                                        <Input
                                            id="total-guests"
                                            type="number"
                                            placeholder="200"
                                            className="max-w-[200px]"
                                            value={formData.totalInvitados}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            {currentStep === 2 && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="venue-name">Nombre del Lugar *</Label>
                                        <Input
                                            id="venue-name"
                                            placeholder="Ej: Hacienda San José"
                                            value={formData.lugarNombre}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Dirección Completa *</Label>
                                        <Input
                                            id="address"
                                            placeholder="Calle, número, piso..."
                                            value={formData.direccion}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="grid gap-6 sm:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">Ciudad *</Label>
                                            <Input
                                                id="city"
                                                placeholder="Madrid"
                                                value={formData.ciudad}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="postal-code">Código Postal *</Label>
                                            <Input
                                                id="postal-code"
                                                placeholder="28001"
                                                value={formData.codigoPostal}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="country">País *</Label>
                                            <Input
                                                id="country"
                                                placeholder="España"
                                                value={formData.pais}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="venue-phone">Teléfono del Lugar</Label>
                                        <Input
                                            id="venue-phone"
                                            type="tel"
                                            placeholder="+34 912 345 678"
                                            value={formData.lugarTelefono}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="parking">Información de Parking</Label>
                                        <Textarea
                                            id="parking"
                                            placeholder="Detalles sobre estacionamiento, acceso, etc..."
                                            rows={3}
                                            value={formData.puntoReferencia}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </>
                            )}

                            {currentStep === 3 && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="organizer-name">Nombre del Organizador *</Label>
                                        <Input
                                            id="organizer-name"
                                            placeholder="Tu nombre"
                                            value={formData.nombreOrganizador}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="organizer-email">Email de Contacto *</Label>
                                            <Input
                                                id="organizer-email"
                                                type="email"
                                                placeholder="email@ejemplo.com"
                                                value={formData.emailOrganizador}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="organizer-phone">Teléfono de Contacto *</Label>
                                            <Input
                                                id="organizer-phone"
                                                type="tel"
                                                placeholder="+34 612 345 678"
                                                value={formData.telefonoOrganizador}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="dress-code">Código de Vestimenta</Label>
                                        <Input
                                            id="dress-code"
                                            placeholder="Ej: Formal, Semi-formal, Casual..."
                                            value={formData.codigoVestimenta}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="special-notes">Notas Especiales</Label>
                                        <Textarea
                                            id="special-notes"
                                            placeholder="Requisitos especiales, alergias, restricciones dietéticas..."
                                            rows={4}
                                            value={formData.notasEspeciales}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {/* Website field removed */}
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Navigation Buttons */}
                    <div className="mt-6 flex items-center justify-between">
                        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Anterior
                        </Button>

                        {currentStep < 3 ? (
                            <Button onClick={handleNext}>
                                Siguiente
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button className="gap-2" onClick={handleCreate} disabled={isLoading}>
                                {isLoading ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                                ) : (
                                    <Check className="h-4 w-4" />
                                )}
                                {isLoading ? "Creando..." : "Crear Evento"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
