import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Users, UtensilsCrossed, Settings, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Invitados", href: "/guests", icon: Users },
  { name: "Mesas", href: "/tables", icon: UtensilsCrossed },
  { name: "Configuración", href: "/settings", icon: Settings },
]

export function EventSidebar() {
  const location = useLocation()
  const pathname = location.pathname
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "relative flex h-screen flex-col border-r border-border bg-card transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[80px]" : "w-64",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-20 z-10 h-8 w-8 rounded-full border border-border bg-card shadow-md hover:bg-secondary"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      <div className={cn("flex h-16 items-center gap-2 border-b border-border px-6", isCollapsed && "justify-center px-0")}>
        <Calendar className="h-6 w-6 text-primary shrink-0" />
        {!isCollapsed && <span className="text-lg font-semibold text-foreground truncate">EventFlow</span>}
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isCollapsed && "justify-center px-0",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
              title={isCollapsed ? item.name : ""}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div className={cn("border-t border-border p-4", isCollapsed && "flex justify-center")}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            JD
          </div>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-foreground">John Doe</p>
              <p className="truncate text-xs text-muted-foreground">john@eventflow.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
