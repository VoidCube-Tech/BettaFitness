import { createContext, type ReactNode, useContext, useState } from 'react'

const AUTH_SESSION_KEY = 'casa-materia-admin-session'
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? 'admin@betafitness.com.br'
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'materia2026'

type AuthContextValue = {
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem(AUTH_SESSION_KEY) === 'authenticated')

  const login = (email: string, password: string) => {
    const valid = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD
    if (!valid) return false
    sessionStorage.setItem(AUTH_SESSION_KEY, 'authenticated')
    setIsAuthenticated(true)
    return true
  }

  const logout = () => {
    sessionStorage.removeItem(AUTH_SESSION_KEY)
    setIsAuthenticated(false)
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return context
}
