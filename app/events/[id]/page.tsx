"use client"

import { EventSidebar } from "@/components/event-sidebar"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Users, CheckCircle2, Clock, DollarSign, Calendar, MapPin, ArrowLeft, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function EventDetailPage() {
  const totalBudget = 50000
  const spentBudget = 32500
  const budgetProgress = (spentBudget / totalBudget) * 100

  return (
    <div className="flex min-h-screen bg-background">
      <EventSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <div className="mb-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Volver al Dashboard
                </Button>
              </Link>
            </div>

            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-foreground">Boda Anual García-López</h1>
                  <Badge>Activo</Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>15 Mayo 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Hacienda San José, Madrid</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Mail className="h-4 w-4" />
                  Enviar Invitaciones
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Phone className="h-4 w-4" />
                  Contactar
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total de Invitados" value="200" icon={Users} description="Capacidad máxima" />
            <StatCard
              title="Confirmados"
              value="145"
              icon={CheckCircle2}
              trend={{ value: "12% más que ayer", isPositive: true }}
            />
            <StatCard title="Pendientes" value="48" icon={Clock} description="Esperando respuesta" />
            <StatCard title="Cancelados" value="7" icon={Users} description="No asistirán" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Presupuesto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Gastado</p>
                    <p className="text-3xl font-bold text-foreground">€{spentBudget.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-xl font-semibold text-muted-foreground">€{totalBudget.toLocaleString()}</p>
                  </div>
                </div>
                <Progress value={budgetProgress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{budgetProgress.toFixed(0)}% utilizado</span>
                  <span>€{(totalBudget - spentBudget).toLocaleString()} restante</span>
                </div>
              </CardContent>
            </Card>

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
                    <span className="text-sm font-semibold text-foreground">145 (72.5%)</span>
                  </div>
                  <Progress value={72.5} className="h-2 bg-secondary [&>div]:bg-green-600" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pendientes</span>
                    <span className="text-sm font-semibold text-foreground">48 (24%)</span>
                  </div>
                  <Progress value={24} className="h-2 bg-secondary [&>div]:bg-yellow-600" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Cancelados</span>
                    <span className="text-sm font-semibold text-foreground">7 (3.5%)</span>
                  </div>
                  <Progress value={3.5} className="h-2 bg-secondary [&>div]:bg-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Categorías de Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { category: "Catering", amount: 15000, percentage: 46 },
                  { category: "Decoración", amount: 8000, percentage: 25 },
                  { category: "Fotografía/Video", amount: 5500, percentage: 17 },
                  { category: "Música", amount: 2500, percentage: 8 },
                  { category: "Otros", amount: 1500, percentage: 4 },
                ].map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{item.category}</span>
                      <span className="text-muted-foreground">
                        €{item.amount.toLocaleString()} ({item.percentage}%)
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
