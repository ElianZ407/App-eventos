import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Mail, Lock, ArrowRight } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import api from "@/lib/api"

export default function LoginPage() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget as HTMLFormElement)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try {
            const response = await api.post("/auth/login", { email, password })
            const { token, usuario } = response.data

            // Guardamos el token y la info del usuario
            localStorage.setItem("user", JSON.stringify({ ...usuario, token }))
            navigate("/")
        } catch (err: any) {
            console.error(err)
            setError(err.response?.data?.error || "Error al iniciar sesión. Inténtalo de nuevo.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background elements for premium feel */}
            <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl animate-pulse" />

            <Card className="w-full max-w-md relative z-10 border-border bg-card/50 backdrop-blur-sm">
                <CardHeader className="space-y-1 flex flex-col items-center pb-8 border-b">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-primary p-2 rounded-lg">
                            <Calendar className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="text-2xl font-bold text-foreground">EventFlow</span>
                    </div>
                    <CardTitle className="text-2xl">Bienvenido de nuevo</CardTitle>
                    <CardDescription>
                        Introduce tus credenciales para acceder a tu cuenta
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4 pt-8">
                        {error && (
                            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4 border border-destructive/20 text-center animate-shake">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="nombre@ejemplo.com"
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Contraseña</Label>
                                <Button variant="link" className="px-0 h-auto text-xs font-normal text-primary">
                                    ¿Olvidaste tu contraseña?
                                </Button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 border-t pt-6 bg-secondary/30">
                        <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                            {!isLoading && <ArrowRight className="h-4 w-4" />}
                        </Button>
                        <p className="text-sm text-center text-muted-foreground">
                            ¿No tienes una cuenta?{" "}
                            <Link to="/register" className="text-primary hover:underline font-medium">
                                Regístrate gratis
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
