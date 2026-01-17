"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, UtensilsCrossed, Wallet, Settings, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Invitados", href: "/guests", icon: Users },
  { name: "Mesas", href: "/tables", icon: UtensilsCrossed },
  { name: "Presupuesto", href: "/budget", icon: Wallet },
  { name: "Configuración", href: "/settings", icon: Settings },
]

export function EventSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Calendar className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold text-foreground">EventFlow</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            JD
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-foreground">John Doe</p>
            <p className="truncate text-xs text-muted-foreground">john@eventflow.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
