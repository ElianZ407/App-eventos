import { Calendar, MapPin, Users } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"

interface EventCardProps {
  id: string
  name: string
  date: string
  location: string
  confirmedGuests: number
  totalGuests: number
  status: "upcoming" | "active" | "completed"
}

export function EventCard({ id, name, date, location, confirmedGuests, totalGuests, status }: EventCardProps) {
  const progress = (confirmedGuests / totalGuests) * 100

  return (
    <Link to={`/events/${id}`}>
      <Card className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
        <CardHeader className="space-y-3 pb-3">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{name}</h3>
            <Badge
              variant={status === "active" ? "default" : status === "upcoming" ? "secondary" : "outline"}
              className="capitalize"
            >
              {status === "active" ? "Activo" : status === "upcoming" ? "Próximo" : "Completado"}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Invitados confirmados</span>
            </div>
            <span className="font-semibold text-foreground">
              {confirmedGuests}/{totalGuests}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>
    </Link>
  )
}
