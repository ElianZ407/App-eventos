import { createContext, useContext, useState, ReactNode } from "react"

interface UserData {
    id?: number
    nombre: string
    email: string
    rol?: string
    telefono?: string
    token: string
}

interface UserContextType {
    user: UserData | null
    setUser: (user: UserData | null) => void
    updateUser: (updates: Partial<UserData>) => void
    logout: () => void
    isAuthenticated: boolean
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUserState] = useState<UserData | null>(() => {
        try {
            const stored = localStorage.getItem("user")
            if (!stored || stored === "undefined" || stored === "null") return null
            return JSON.parse(stored)
        } catch {
            return null
        }
    })

    const setUser = (newUser: UserData | null) => {
        setUserState(newUser)
        if (newUser) localStorage.setItem("user", JSON.stringify(newUser))
        else localStorage.removeItem("user")
    }

    const updateUser = (updates: Partial<UserData>) => {
        setUserState(prev => {
            if (!prev) return prev
            const updated = { ...prev, ...updates }
            localStorage.setItem("user", JSON.stringify(updated))
            return updated
        })
    }

    const logout = () => {
        setUserState(null)
        localStorage.removeItem("user")
    }

    return (
        <UserContext.Provider value={{ user, setUser, updateUser, logout, isAuthenticated: !!user?.token }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const ctx = useContext(UserContext)
    if (!ctx) throw new Error("useUser debe usarse dentro de UserProvider")
    return ctx
}
