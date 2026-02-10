"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Zap, LogIn, Loader2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simulated login - navigates to admin
    setTimeout(() => {
      setLoading(false)
      router.push("/admin")
    }, 800)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[hsl(var(--sidebar-background))]">
      {/* Subtle background accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/5" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/5" />
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo and branding */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
              <Zap className="h-7 w-7 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold uppercase tracking-wide text-[hsl(var(--sidebar-primary-foreground))]">
                Servidores
              </span>
              <span className="text-xl font-extrabold uppercase tracking-wide text-primary">
                Rapidos
              </span>
            </div>
            <p className="mt-2 text-sm text-[hsl(var(--sidebar-foreground))]">
              Sistema de Gestion de Propuestas
            </p>
          </div>

          {/* Login card */}
          <Card className="border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent))]">
            <CardHeader className="pb-4 pt-6 text-center">
              <h1 className="text-lg font-semibold text-[hsl(var(--sidebar-primary-foreground))]">
                Iniciar Sesion
              </h1>
              <p className="text-sm text-[hsl(var(--sidebar-foreground))]">
                Ingresa tus credenciales para acceder al sistema
              </p>
            </CardHeader>
            <CardContent className="pb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-[hsl(var(--sidebar-accent-foreground))]"
                  >
                    Correo electronico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@empresa.com"
                    required
                    className="border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-primary-foreground))] placeholder:text-[hsl(var(--sidebar-foreground))]"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-[hsl(var(--sidebar-accent-foreground))]"
                  >
                    Contrasena
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingresa tu contrasena"
                      required
                      className="border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-background))] pr-10 text-[hsl(var(--sidebar-primary-foreground))] placeholder:text-[hsl(var(--sidebar-foreground))]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--sidebar-foreground))] hover:text-[hsl(var(--sidebar-primary-foreground))]"
                      aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full font-semibold"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogIn className="mr-2 h-4 w-4" />
                  )}
                  Iniciar Sesion
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Footer text */}
          <p className="mt-6 text-center text-xs text-[hsl(var(--sidebar-foreground))]">
            Desarrollado por{" "}
            <a
              href="https://servidoresrapidos.net"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              servidoresrapidos.net
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
