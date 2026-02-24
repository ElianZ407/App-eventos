import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Mail, Lock, User, ArrowRight } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

export default function RegisterPage() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            // In a real app, you'd save a token here
            localStorage.setItem("user", JSON.stringify({ name: "Nuevo Usuario", email: "user@example.com" }))
            navigate("/")
        }, 1000)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background elements for premium feel */}
            <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 left-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl animate-pulse" />

            <Card className="w-full max-w-md relative z-10 border-border bg-card/50 backdrop-blur-sm">
                <CardHeader className="space-y-1 flex flex-col items-center pb-8 border-b">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-primary p-2 rounded-lg">
                            <Calendar className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="text-2xl font-bold text-foreground">EventFlow</span>
                    </div>
                    <CardTitle className="text-2xl">Crea una cuenta</CardTitle>
                    <CardDescription>
                        Únete hoy y empieza a organizar eventos como un profesional
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4 pt-8">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre Completo</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="name"
                                    placeholder="Tu nombre aquí"
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nombre@ejemplo.com"
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    className="pl-10"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 border-t pt-6 bg-secondary/30">
                        <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                            {!isLoading && <ArrowRight className="h-4 w-4" />}
                        </Button>
                        <p className="text-sm text-center text-muted-foreground">
                            ¿Ya tienes una cuenta?{" "}
                            <Link to="/login" className="text-primary hover:underline font-medium">
                                Inicia sesión
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
