import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { EventSidebar } from './components/event-sidebar'
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Plus, Search } from "lucide-react"
import { EventCard } from "./components/event-card"
import { Link } from 'react-router-dom'

// Import New Pages
import GuestsPage from './pages/guests-page'
import TablesPage from './pages/tables-page'
import EventDetailPage from './pages/event-detail-page'
import NewEventPage from './pages/new-event-page'
import LoginPage from './pages/login-page'
import RegisterPage from './pages/register-page'
import ProfilePage from './pages/profile-page'

import { ThemeProvider } from './components/theme-provider'

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
];

function Dashboard() {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredEvents = mockEvents.filter(
        (event) =>
            event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
        <main className="flex-1 overflow-y-auto">
            <div className="border-b border-border bg-card">
                <div className="flex items-center justify-between px-8 py-6">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                        <p className="text-sm text-muted-foreground">Gestiona todos tus eventos en un solo lugar</p>
                    </div>
                    <Link to="/new-event">
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
    );
}

function App() {
    return (
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <Router>
                <Routes>
                    {/* Auth Routes (No Sidebar) */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* App Routes (With Sidebar) */}
                    <Route
                        path="/*"
                        element={
                            <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
                                <EventSidebar />
                                <div className="flex-1 flex flex-col overflow-hidden">
                                    <Routes>
                                        <Route path="/" element={<Dashboard />} />
                                        <Route path="/guests" element={<GuestsPage />} />
                                        <Route path="/tables" element={<TablesPage />} />
                                        <Route path="/events/:id" element={<EventDetailPage />} />
                                        <Route path="/new-event" element={<NewEventPage />} />
                                        <Route path="/profile" element={<ProfilePage />} />
                                    </Routes>
                                </div>
                            </div>
                        }
                    />
                </Routes>
            </Router>
        </ThemeProvider>
    )
}

export default App
