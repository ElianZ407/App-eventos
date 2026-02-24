"use client"

import { EventSidebar } from "@/components/event-sidebar"
import { EventCard } from "@/components/event-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

const mockEvents = [
  {
    id: "1",
    name: "Boda Anual García-López",
    date: "15 Mayo 2024",
    location: "Hacienda San José, Madrid",
    confirmedGuests: 145,
    totalGuests: 200,
    status: "active" as const,
  },
  {
    id: "2",
    name: "Conferencia Tech Summit",
    date: "22 Junio 2024",
    location: "Centro de Convenciones, Barcelona",
    confirmedGuests: 320,
    totalGuests: 500,
    status: "upcoming" as const,
  },
  {
    id: "3",
    name: "Cumpleaños María 30",
    date: "8 Julio 2024",
    location: "Restaurante El Jardín, Valencia",
    confirmedGuests: 45,
    totalGuests: 60,
    status: "upcoming" as const,
  },
  {
    id: "4",
    name: "Gala Anual Empresa",
    date: "12 Marzo 2024",
    location: "Hotel Ritz, Madrid",
    confirmedGuests: 180,
    totalGuests: 180,
    status: "completed" as const,
  },
  {
    id: "5",
    name: "Festival de Verano",
    date: "1 Agosto 2024",
    location: "Parque Central, Sevilla",
    confirmedGuests: 890,
    totalGuests: 1200,
    status: "active" as const,
  },
  {
    id: "6",
    name: "Reunión Familiar Anual",
    date: "20 Agosto 2024",
    location: "Casa Rural Los Olivos",
    confirmedGuests: 28,
    totalGuests: 35,
    status: "upcoming" as const,
  },
]

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEvents = mockEvents.filter(
    (event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex min-h-screen bg-background">
      <EventSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="border-b border-border bg-card">
          <div className="flex items-center justify-between px-8 py-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Gestiona todos tus eventos en un solo lugar</p>
            </div>
            <Link href="/new-event">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Evento
              </Button>
            </Link>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos por nombre o ubicación..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No se encontraron eventos</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
