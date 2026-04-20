import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { EventSidebar } from './components/event-sidebar'
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Plus, Search } from "lucide-react"
import { EventCard } from "./components/event-card"
import { useState, useEffect } from 'react'

import GuestsPage from './pages/guests-page'
import TablesPage from './pages/tables-page'
import EventDetailPage from './pages/event-detail-page'
import NewEventPage from './pages/new-event-page'
import EditEventPage from './pages/edit-event-page'
import LoginPage from './pages/login-page'
import RegisterPage from './pages/register-page'
import ProfilePage from './pages/profile-page'

import { ThemeProvider } from './components/theme-provider'
import { UserProvider, useUser } from './contexts/user-context'
import api from './lib/api'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useUser()
    const navigate = useNavigate()
    useEffect(() => { if (!isAuthenticated) navigate("/login") }, [isAuthenticated, navigate])
    if (!isAuthenticated) return null
    return <>{children}</>
}

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useUser()
    const navigate = useNavigate()
    useEffect(() => { if (isAuthenticated) navigate("/") }, [isAuthenticated, navigate])
    if (isAuthenticated) return null
    return <>{children}</>
}

function Dashboard() {
    const [searchQuery, setSearchQuery] = useState("")
    const [events, setEvents] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const { logout } = useUser()

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/eventos')
                setEvents(response.data)
            } catch (error) {
                if ((error as any).response?.status === 401) { logout(); navigate("/login") }
            } finally {
                setIsLoading(false)
            }
        }
        fetchEvents()
    }, [navigate, logout])

    const filteredEvents = events.filter(e =>
        e.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.lugarNombre && e.lugarNombre.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return (
        <main className="flex-1 overflow-y-auto">
            <div className="border-b border-border bg-card">
                <div className="flex items-center justify-between px-8 py-6">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                        <p className="text-sm text-muted-foreground">Gestiona todos tus eventos en un solo lugar</p>
                    </div>
                    <Link to="/new-event"><Button className="gap-2"><Plus className="h-4 w-4" />Nuevo Evento</Button></Link>
                </div>
            </div>
            <div className="p-8">
                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Buscar eventos..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredEvents.map((event) => (
                            <EventCard key={event.id} id={event.id} name={event.nombre} date={new Date(event.fecha).toLocaleDateString()} location={event.lugarNombre || "Sin ubicación"} confirmedGuests={event.invitados?.filter((i: any) => i.estado === 'confirmado').length || 0} totalGuests={event.totalInvitados} status={event.estado === 'pasado' ? 'completed' : event.estado === 'proximo' ? 'upcoming' : 'active'} />
                        ))}
                    </div>
                )}
                {!isLoading && filteredEvents.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-muted-foreground">No se encontraron eventos</p>
                        <Link to="/new-event" className="mt-4"><Button variant="outline">Crear tu primer evento</Button></Link>
                    </div>
                )}
            </div>
        </main>
    )
}

function App() {
    return (
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <UserProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
                        <Route path="/*" element={
                            <ProtectedRoute>
                                <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
                                    <EventSidebar />
                                    <div className="flex-1 flex flex-col overflow-hidden">
                                        <Routes>
                                            <Route path="/" element={<Dashboard />} />
                                            <Route path="/events/:id" element={<EventDetailPage />} />
                                            <Route path="/events/:id/edit" element={<EditEventPage />} />
                                            <Route path="/events/:id/guests" element={<GuestsPage />} />
                                            <Route path="/events/:id/tables" element={<TablesPage />} />
                                            <Route path="/new-event" element={<NewEventPage />} />
                                            <Route path="/profile" element={<ProfilePage />} />
                                            <Route path="/guests" element={<div className="p-8">Selecciona un evento primero.</div>} />
                                            <Route path="/tables" element={<div className="p-8">Selecciona un evento primero.</div>} />
                                        </Routes>
                                    </div>
                                </div>
                            </ProtectedRoute>
                        } />
                    </Routes>
                </Router>
            </UserProvider>
        </ThemeProvider>
    )
}

export default App
