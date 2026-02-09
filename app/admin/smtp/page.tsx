"use client"

import React from "react"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { Save, Mail, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { ConfigSMTP } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function SMTPPage() {
  const { data: config, mutate } = useSWR<ConfigSMTP>("/api/smtp", fetcher)
  const [host, setHost] = useState("")
  const [puerto, setPuerto] = useState("587")
  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (config) {
      setHost(config.host)
      setPuerto(config.puerto)
      setUsuario(config.usuario)
      setPassword(config.password)
    }
  }, [config])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch("/api/smtp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host, puerto, usuario, password }),
      })
      mutate()
      toast.success("Configuracion SMTP guardada")
    } catch {
      toast.error("Error al guardar")
    }
    setSaving(false)
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Configuracion SMTP
        </h1>
        <p className="mt-1 text-muted-foreground">
          Configura el servidor de correo para enviar propuestas
        </p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Mail className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-foreground">Servidor de Correo</CardTitle>
                <CardDescription>
                  Datos del servidor SMTP para el envio de propuestas por correo
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="smtp-host">Host</Label>
                  <Input
                    id="smtp-host"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    placeholder="smtp.example.com"
                    required
                  />
                </div>
                <div className="w-28 space-y-2">
                  <Label htmlFor="smtp-puerto">Puerto</Label>
                  <Input
                    id="smtp-puerto"
                    value={puerto}
                    onChange={(e) => setPuerto(e.target.value)}
                    placeholder="587"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-usuario">Usuario</Label>
                <Input
                  id="smtp-usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="usuario@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-password">Password</Label>
                <div className="relative">
                  <Input
                    id="smtp-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu password SMTP"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Ocultar password" : "Mostrar password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Guardando..." : "Guardar Configuracion"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-foreground">Nota sobre Envio de Correos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Al enviar una propuesta, el sistema generara un enlace unico con
              un token de un solo uso y lo enviara al email de contacto del
              cliente. El token expira en 7 dias. En este prototipo, el enlace
              se copia al portapapeles. Para produccion, conecta un servicio
              SMTP real como SendGrid, AWS SES o tu servidor de correo
              corporativo.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
