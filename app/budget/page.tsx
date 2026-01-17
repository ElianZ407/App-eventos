"use client"

import { EventSidebar } from "@/components/event-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, TrendingUp, TrendingDown } from "lucide-react"

const budgetCategories = [
  {
    id: "1",
    name: "Catering",
    allocated: 15000,
    spent: 12500,
    status: "on-track" as const,
  },
  {
    id: "2",
    name: "Decoración",
    allocated: 5000,
    spent: 5500,
    status: "over-budget" as const,
  },
  {
    id: "3",
    name: "Fotografía & Video",
    allocated: 3500,
    spent: 2800,
    status: "on-track" as const,
  },
  {
    id: "4",
    name: "Música & Entretenimiento",
    allocated: 4000,
    spent: 4000,
    status: "on-track" as const,
  },
  {
    id: "5",
    name: "Flores",
    allocated: 2500,
    spent: 1200,
    status: "under-budget" as const,
  },
  {
    id: "6",
    name: "Transporte",
    allocated: 1500,
    spent: 0,
    status: "pending" as const,
  },
]

export default function BudgetPage() {
  const totalAllocated = budgetCategories.reduce((acc, cat) => acc + cat.allocated, 0)
  const totalSpent = budgetCategories.reduce((acc, cat) => acc + cat.spent, 0)
  const remaining = totalAllocated - totalSpent
  const percentageSpent = ((totalSpent / totalAllocated) * 100).toFixed(1)

  return (
    <div className="flex min-h-screen bg-background">
      <EventSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="border-b border-border bg-card">
          <div className="flex items-center justify-between px-8 py-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Presupuesto</h1>
              <p className="text-sm text-muted-foreground">Controla los gastos de tu evento</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Categoría
            </Button>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Presupuesto Total</CardDescription>
                <CardTitle className="text-3xl">{totalAllocated.toLocaleString()}€</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Gastado</CardDescription>
                <CardTitle className="text-3xl">{totalSpent.toLocaleString()}€</CardTitle>
                <p className="text-sm text-muted-foreground">{percentageSpent}% del presupuesto</p>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Restante</CardDescription>
                <CardTitle className="text-3xl">{remaining.toLocaleString()}€</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Progreso General</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={Number.parseFloat(percentageSpent)} className="h-3" />
              <p className="mt-2 text-sm text-muted-foreground">
                Has gastado {totalSpent.toLocaleString()}€ de {totalAllocated.toLocaleString()}€
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {budgetCategories.map((category) => {
              const percentage = ((category.spent / category.allocated) * 100).toFixed(1)
              const isOverBudget = category.spent > category.allocated

              return (
                <Card key={category.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="font-semibold text-foreground">{category.name}</h3>
                          <Badge
                            variant={
                              category.status === "over-budget"
                                ? "destructive"
                                : category.status === "on-track"
                                  ? "default"
                                  : category.status === "under-budget"
                                    ? "secondary"
                                    : "outline"
                            }
                          >
                            {category.status === "over-budget" && "Sobre presupuesto"}
                            {category.status === "on-track" && "En curso"}
                            {category.status === "under-budget" && "Bajo presupuesto"}
                            {category.status === "pending" && "Pendiente"}
                          </Badge>
                        </div>

                        <Progress value={Number.parseFloat(percentage)} className="mb-2 h-2" />

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Gastado: {category.spent.toLocaleString()}€ / {category.allocated.toLocaleString()}€
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            {isOverBudget ? (
                              <>
                                <TrendingUp className="h-4 w-4 text-destructive" />
                                <span className="text-destructive">+{percentage}%</span>
                              </>
                            ) : (
                              <>
                                <TrendingDown className="h-4 w-4 text-green-600" />
                                <span className="text-green-600">{percentage}%</span>
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
