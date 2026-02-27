import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, Camera, Shield, Save } from "lucide-react"
import { useState, useEffect } from "react"
import api from "@/lib/api"

export default function ProfilePage() {
    const [user, setUser] = useState({
        nombre: "Cargando...",
        email: "",
        telefono: "",
        rol: "Organizador",
        avatar: "/placeholder.svg"
    })

    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/auth/perfil")
                if (response.data) {
                    setUser({
                        nombre: response.data.nombre || "Usuario",
                        email: response.data.email || "",
                        telefono: response.data.telefono || "",
                        rol: response.data.rol || "Organizador",
                        avatar: "/placeholder.svg"
                    })
                }
            } catch (error) {
                console.error("Error fetching profile:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [])

    const handleSave = async () => {
        try {
            const response = await api.put("/auth/perfil", {
                nombre: user.nombre,
                email: user.email,
                telefono: user.telefono,
                rol: user.rol
            })

            if (response.data) {
                // Actualizar localStorage para mantener sincronía en el resto de la app
                const storedUser = localStorage.getItem("user")
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser)
                    localStorage.setItem("user", JSON.stringify({
                        ...parsedUser,
                        name: response.data.nombre,
                        email: response.data.email
                    }))
                }

                setUser({
                    ...user,
                    nombre: response.data.nombre,
                    email: response.data.email,
                    telefono: response.data.telefono,
                    rol: response.data.rol
                })
                setIsEditing(false)
                alert("Perfil actualizado correctamente")
            }
        } catch (error) {
            console.error("Error updating profile:", error)
            alert("Error al actualizar el perfil")
        }
    }

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Cargando perfil...</div>
    }

    return (
        <main className="flex-1 overflow-y-auto bg-background">
            <div className="border-b border-border bg-card">
                <div className="px-8 py-10">
                    <h1 className="text-3xl font-bold text-foreground">Perfil de Usuario</h1>
                    <p className="text-muted-foreground mt-1">Gestiona tu información personal y seguridad</p>
                </div>
            </div>

            <div className="p-8 mx-auto max-w-3xl space-y-8">
                {/* Header Profile Section */}
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                    <div className="relative group">
                        <Avatar className="h-32 w-32 border-4 border-card shadow-xl">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                                {user.nombre.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="absolute bottom-0 right-0 rounded-full border-2 border-background shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Camera className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <h2 className="text-2xl font-bold">{user.nombre}</h2>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                {user.rol}
                            </Badge>
                        </div>

                        <div className="flex gap-2 pt-2 justify-center md:justify-start">
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                                {isEditing ? "Cancelar" : "Editar Perfil"}
                            </Button>
                            {isEditing && (
                                <Button size="sm" onClick={handleSave} className="gap-2">
                                    <Save className="h-4 w-4" />
                                    Guardar Cambios
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="border-border bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Información Personal
                            </CardTitle>
                            <CardDescription>Datos vinculados a tu cuenta de EventFlow</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="perf-name">Nombre Completo</Label>
                                    <Input
                                        id="perf-name"
                                        value={user.nombre}
                                        disabled={!isEditing}
                                        onChange={(e) => setUser({ ...user, nombre: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="perf-role">Cargo / Rol</Label>
                                    <Input
                                        id="perf-role"
                                        value={user.rol}
                                        disabled={!isEditing}
                                        onChange={(e) => setUser({ ...user, rol: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="perf-email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="perf-email"
                                            value={user.email}
                                            disabled={!isEditing}
                                            className="pl-10"
                                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="perf-phone">Teléfono</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="perf-phone"
                                            value={user.telefono}
                                            disabled={!isEditing}
                                            className="pl-10"
                                            onChange={(e) => setUser({ ...user, telefono: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                Seguridad
                            </CardTitle>
                            <CardDescription>Gestiona el acceso y la protección de tu cuenta</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">Contraseña</p>
                                    <p className="text-xs text-muted-foreground">Cambiar contraseña de la cuenta</p>
                                </div>
                                <Button variant="outline" size="sm">Actualizar</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}
