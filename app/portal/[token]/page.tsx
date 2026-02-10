"use client"

import React from "react"

import { useState, useEffect, use } from "react"
import { toast } from "sonner"
import {
  CheckCircle,
  XCircle,
  Upload,
  AlertTriangle,
  Building2,
  FileText,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Propuesta, Cliente, Plantilla } from "@/lib/types"

type PortalStep = "loading" | "propuesta" | "onboarding" | "completado" | "declinada" | "error"

interface PortalData {
  propuesta: Propuesta
  cliente: Cliente
  plantilla: Plantilla
}

export default function PortalPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = use(params)
  const [step, setStep] = useState<PortalStep>("loading")
  const [data, setData] = useState<PortalData | null>(null)
  const [errorMsg, setErrorMsg] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Onboarding state
  const [avisoOperacion, setAvisoOperacion] = useState<File | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState("")
  const [kardexDatos, setKardexDatos] = useState({
    ruc: "",
    dv: "",
    telefono: "",
    emailFacturacion: "",
    tipoContribuyente: "Juridico" as string,
  })

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/portal/${token}`)
        if (!res.ok) {
          const errData = await res.json()
          setErrorMsg(errData.error || "Enlace invalido")
          setStep("error")
          return
        }
        const portalData: PortalData = await res.json()
        setData(portalData)

        if (portalData.propuesta.estatus === "Aprobada") {
          setStep("onboarding")
        } else if (portalData.propuesta.estatus === "Declinada") {
          setStep("declinada")
        } else {
          setStep("propuesta")
        }
      } catch {
        setErrorMsg("Error al cargar la propuesta")
        setStep("error")
      }
    }
    loadData()
  }, [token])

  async function handleAprobar() {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/portal/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "aprobar" }),
      })
      if (res.ok) {
        setStep("onboarding")
        toast.success("Propuesta aprobada. Completa el onboarding.")
      }
    } catch {
      toast.error("Error al aprobar")
    }
    setSubmitting(false)
  }

  async function handleDeclinar() {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/portal/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "declinar" }),
      })
      if (res.ok) {
        setStep("declinada")
        toast.info("Propuesta declinada")
      }
    } catch {
      toast.error("Error al declinar")
    }
    setSubmitting(false)
  }

  async function handleFinalizarOnboarding(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch(`/api/portal/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "finalizar", kardexDatos }),
      })
      if (res.ok) {
        setStep("completado")
        toast.success("Onboarding completado exitosamente")
      }
    } catch {
      toast.error("Error al finalizar")
    }
    setSubmitting(false)
  }

  // Loading state
  if (step === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando propuesta...</p>
        </div>
      </div>
    )
  }

  // Error / expired token
  if (step === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-destructive" />
            <h1 className="mb-2 text-2xl font-bold text-foreground">
              Enlace Caducado
            </h1>
            <p className="text-muted-foreground">
              {errorMsg ||
                "Este enlace ya no es valido. Contacta al remitente para obtener un nuevo enlace."}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Declined state
  if (step === "declinada") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <XCircle className="mx-auto mb-4 h-16 w-16 text-destructive" />
            <h1 className="mb-2 text-2xl font-bold text-foreground">
              Propuesta Declinada
            </h1>
            <p className="text-muted-foreground">
              Has declinado esta propuesta. Si cambias de opinion, contacta
              directamente a la empresa.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Completed state
  if (step === "completado") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-[hsl(var(--success))]" />
            <h1 className="mb-2 text-2xl font-bold text-foreground">
              Proceso Completado
            </h1>
            <p className="text-muted-foreground">
              Tu propuesta ha sido aprobada y tus documentos han sido recibidos.
              Nos pondremos en contacto contigo pronto.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  const { propuesta, cliente, plantilla } = data

  // Onboarding step (post-approval)
  if (step === "onboarding") {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-bold text-foreground">Gestor Pro</span>
            </div>
            <Badge className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]">
              Aprobada
            </Badge>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-6 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              Onboarding - Documentos
            </h1>
            <p className="mt-1 text-muted-foreground">
              Completa la siguiente informacion y sube el aviso de operacion
              para finalizar el proceso.
            </p>
          </div>

          <form onSubmit={handleFinalizarOnboarding} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Datos del Kardex</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="kardex-ruc">RUC</Label>
                    <Input
                      id="kardex-ruc"
                      value={kardexDatos.ruc}
                      onChange={(e) =>
                        setKardexDatos((p) => ({
                          ...p,
                          ruc: e.target.value,
                        }))
                      }
                      placeholder="155123456"
                      required
                    />
                  </div>
                  <div className="w-20 space-y-2">
                    <Label htmlFor="kardex-dv">DV</Label>
                    <Input
                      id="kardex-dv"
                      value={kardexDatos.dv}
                      onChange={(e) =>
                        setKardexDatos((p) => ({
                          ...p,
                          dv: e.target.value,
                        }))
                      }
                      placeholder="78"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kardex-telefono">Telefono</Label>
                  <Input
                    id="kardex-telefono"
                    value={kardexDatos.telefono}
                    onChange={(e) =>
                      setKardexDatos((p) => ({
                        ...p,
                        telefono: e.target.value,
                      }))
                    }
                    placeholder="+507 6000-0000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kardex-emailFact">
                    Email para Facturacion Electronica
                  </Label>
                  <Input
                    id="kardex-emailFact"
                    type="email"
                    value={kardexDatos.emailFacturacion}
                    onChange={(e) =>
                      setKardexDatos((p) => ({
                        ...p,
                        emailFacturacion: e.target.value,
                      }))
                    }
                    placeholder="facturacion@empresa.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Contribuyente</Label>
                  <select
                    value={kardexDatos.tipoContribuyente}
                    onChange={(e) =>
                      setKardexDatos((p) => ({
                        ...p,
                        tipoContribuyente: e.target.value,
                      }))
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="Natural">Natural</option>
                    <option value="Juridico">Juridico</option>
                    <option value="Extranjero">Extranjero</option>
                    <option value="Agente de Retencion - Exento">
                      Agente de Retencion - Exento
                    </option>
                    <option value="Agente de Retencion - Gravado">
                      Agente de Retencion - Gravado
                    </option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Logo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6">
                  {logoPreview && (
                    <div className="mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    Selecciona tu logo
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      setLogoFile(file)
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (ev) => {
                          setLogoPreview(ev.target?.result as string)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="max-w-xs"
                  />
                  {logoFile && (
                    <p className="mt-2 text-sm text-[hsl(var(--success))]">
                      Archivo: {logoFile.name}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Aviso de Operacion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6">
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    Selecciona el archivo del aviso de operacion
                  </p>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setAvisoOperacion(e.target.files?.[0] || null)
                    }
                    className="max-w-xs"
                  />
                  {avisoOperacion && (
                    <p className="mt-2 text-sm text-[hsl(var(--success))]">
                      Archivo: {avisoOperacion.name}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" disabled={submitting} size="lg">
                {submitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Finalizar Onboarding
              </Button>
            </div>
          </form>
        </main>
      </div>
    )
  }

  // Main proposal view (split screen)
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">Gestor Pro</span>
          </div>
          <Badge variant="secondary">Propuesta Comercial</Badge>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: Client info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                    <Building2 className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-foreground">
                      {cliente.nombre}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      RUC: {cliente.ruc}-{cliente.dv}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Contacto
                  </p>
                  <p className="text-sm text-foreground">{cliente.emailContacto}</p>
                </div>
                {cliente.telefono && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Telefono
                    </p>
                    <p className="text-sm text-foreground">{cliente.telefono}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Pais
                  </p>
                  <p className="text-sm text-foreground">{cliente.pais}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Plantilla
                  </p>
                  <p className="text-sm text-foreground">{plantilla.nombre}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Proposal content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-foreground">
                  Propuesta Comercial
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Revisa la propuesta completa a continuacion
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(propuesta.contenido).map(
                  ([titulo, valor]) => (
                    <div key={titulo}>
                      <h3 className="mb-2 text-base font-semibold text-foreground">
                        {titulo}
                      </h3>
                      <p className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                        {valor || "(Sin contenido)"}
                      </p>
                      <Separator className="mt-4" />
                    </div>
                  ),
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Fixed footer with action buttons */}
      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-card shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Expira:{" "}
            {new Date(propuesta.fechaExpiracionToken).toLocaleDateString(
              "es-PA",
            )}
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleDeclinar}
              disabled={submitting}
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Declinar
            </Button>
            <Button onClick={handleAprobar} disabled={submitting} size="lg">
              {submitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <CheckCircle className="mr-2 h-4 w-4" />
              Aprobar Propuesta
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
