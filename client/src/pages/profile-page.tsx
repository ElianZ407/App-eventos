import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { User, Mail, Phone, Shield, Save, Lock } from "lucide-react"
import { useState, useEffect } from "react"
import api from "@/lib/api"
import { useUser } from "@/contexts/user-context"

export default function ProfilePage() {
    const { updateUser } = useUser()
    const [formData, setFormData] = useState({ nombre: "", email: "", telefono: "", rol: "Organizador" })
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [pwOpen, setPwOpen] = useState(false)
    const [pwData, setPwData] = useState({ passwordActual: "", passwordNueva: "", confirmar: "" })
    const [pwError, setPwError] = useState<string | null>(null)
    const [pwLoading, setPwLoading] = useState(false)

    useEffect(() => {
        api.get("/auth/perfil").then(res => {
            if (res.data) setFormData({ nombre: res.data.nombre || "", email: res.data.email || "", telefono: res.data.telefono || "", rol: res.data.rol || "Organizador" })
        }).catch(console.error).finally(() => setIsLoading(false))
    }, [])

    const handleSave = async () => {
        try {
            const res = await api.put("/auth/perfil", formData)
            if (res.data) {
                updateUser({ nombre: res.data.nombre, email: res.data.email })
                setFormData({ nombre: res.data.nombre, email: res.data.email, telefono: res.data.telefono || "", rol: res.data.rol })
                setIsEditing(false)
                alert("Perfil actualizado correctamente")
            }
        } catch { alert("Error al actualizar el perfil") }
    }

    const handleChangePassword = async () => {
        setPwError(null)
        if (pwData.passwordNueva !== pwData.confirmar) { setPwError("Las contraseñas nuevas no coinciden"); return }
        if (pwData.passwordNueva.length < 6) { setPwError("La nueva contraseña debe tener al menos 6 caracteres"); return }
        setPwLoading(true)
        try {
            await api.put("/auth/cambiar-password", { passwordActual: pwData.passwordActual, passwordNueva: pwData.passwordNueva })
            setPwOpen(false)
            setPwData({ passwordActual: "", passwordNueva: "", confirmar: "" })
            alert("Contraseña actualizada correctamente")
        } catch (err: any) {
            setPwError(err.response?.data?.error || "Error al cambiar la contraseña")
        } finally { setPwLoading(false) }
    }

    if (isLoading) return <div className="flex h-screen items-center justify-center">Cargando perfil...</div>

    return (
        <main className="flex-1 overflow-y-auto bg-background">
            <div className="border-b border-border bg-card">
                <div className="px-8 py-10">
                    <h1 className="text-3xl font-bold text-foreground">Perfil de Usuario</h1>
                    <p className="text-muted-foreground mt-1">Gestiona tu información personal y seguridad</p>
                </div>
            </div>
            <div className="p-8 mx-auto max-w-3xl space-y-8">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <Avatar className="h-32 w-32 border-4 border-card shadow-xl">
                        <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">{formData.nombre.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-2xl font-bold">{formData.nombre}</h2>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">{formData.rol}</Badge>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>{isEditing ? "Cancelar" : "Editar Perfil"}</Button>
                            {isEditing && <Button size="sm" onClick={handleSave} className="gap-2"><Save className="h-4 w-4" />Guardar Cambios</Button>}
                        </div>
                    </div>
                </div>

                <Card className="border-border bg-card/50">
                    <CardHeader><CardTitle className="text-lg flex items-center gap-2"><User className="h-5 w-5 text-primary" />Información Personal</CardTitle><CardDescription>Datos vinculados a tu cuenta</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2"><Label>Nombre Completo</Label><Input value={formData.nombre} disabled={!isEditing} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} /></div>
                            <div className="space-y-2"><Label>Cargo / Rol</Label><Input value={formData.rol} disabled={!isEditing} onChange={(e) => setFormData({ ...formData, rol: e.target.value })} /></div>
                            <div className="space-y-2"><Label>Email</Label><div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={formData.email} disabled={!isEditing} className="pl-10" onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div></div>
                            <div className="space-y-2"><Label>Teléfono</Label><div className="relative"><Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={formData.telefono} disabled={!isEditing} className="pl-10" onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} /></div></div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card/50">
                    <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />Seguridad</CardTitle><CardDescription>Gestiona el acceso a tu cuenta</CardDescription></CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50">
                            <div><p className="text-sm font-medium">Contraseña</p><p className="text-xs text-muted-foreground">Cambiar contraseña de la cuenta</p></div>
                            <Button variant="outline" size="sm" onClick={() => { setPwError(null); setPwOpen(true) }}>Actualizar</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={pwOpen} onOpenChange={setPwOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader><DialogTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-primary" />Cambiar Contraseña</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-2">
                        {pwError && <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{pwError}</p>}
                        <div className="space-y-2"><Label>Contraseña actual</Label><Input type="password" value={pwData.passwordActual} onChange={(e) => setPwData({ ...pwData, passwordActual: e.target.value })} /></div>
                        <div className="space-y-2"><Label>Nueva contraseña</Label><Input type="password" value={pwData.passwordNueva} onChange={(e) => setPwData({ ...pwData, passwordNueva: e.target.value })} /></div>
                        <div className="space-y-2"><Label>Confirmar nueva contraseña</Label><Input type="password" value={pwData.confirmar} onChange={(e) => setPwData({ ...pwData, confirmar: e.target.value })} /></div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPwOpen(false)}>Cancelar</Button>
                        <Button onClick={handleChangePassword} disabled={pwLoading}>{pwLoading ? "Guardando..." : "Cambiar Contraseña"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    )
}
