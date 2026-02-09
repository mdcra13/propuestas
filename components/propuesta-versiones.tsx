"use client"

import { useState } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import {
  History,
  RotateCcw,
  Plus,
  Check,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import type { PropuestaVersion, Propuesta, Plantilla } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface PropuestaVersionesProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  propuesta: Propuesta
  plantilla?: Plantilla
  onUpdated: () => void
}

export function PropuestaVersiones({
  open,
  onOpenChange,
  propuesta,
  plantilla,
  onUpdated,
}: PropuestaVersionesProps) {
  const { data, mutate } = useSWR<{
    versiones: PropuestaVersion[]
    versionActual: number
  }>(open ? `/api/propuestas/${propuesta.id}/versiones` : null, fetcher)

  const [creandoVersion, setCreandoVersion] = useState(false)
  const [nuevaNota, setNuevaNota] = useState("")
  const [nuevoContenido, setNuevoContenido] = useState<Record<string, string>>(
    {},
  )
  const [expandedVersion, setExpandedVersion] = useState<number | null>(null)
  const [restaurando, setRestaurando] = useState(false)

  const versiones = data?.versiones || propuesta.versiones
  const versionActual = data?.versionActual ?? propuesta.versionActual

  function iniciarNuevaVersion() {
    setNuevoContenido({ ...propuesta.contenido })
    setNuevaNota("")
    setCreandoVersion(true)
  }

  async function guardarNuevaVersion() {
    const res = await fetch(`/api/propuestas/${propuesta.id}/versiones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accion: "crear",
        contenido: nuevoContenido,
        nota: nuevaNota,
      }),
    })

    if (res.ok) {
      toast.success("Nueva version creada exitosamente")
      setCreandoVersion(false)
      mutate()
      onUpdated()
    } else {
      toast.error("Error al crear la version")
    }
  }

  async function restaurarVersion(versionNumber: number) {
    setRestaurando(true)
    const res = await fetch(`/api/propuestas/${propuesta.id}/versiones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accion: "restaurar",
        version: versionNumber,
      }),
    })

    if (res.ok) {
      toast.success(`Restaurada a v${versionNumber}`)
      mutate()
      onUpdated()
    } else {
      toast.error("Error al restaurar la version")
    }
    setRestaurando(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <History className="h-5 w-5" />
            Historial de Versiones
          </DialogTitle>
          <DialogDescription>
            Gestiona las versiones de esta propuesta. La version activa es{" "}
            <span className="font-semibold">v{versionActual}</span>.
          </DialogDescription>
        </DialogHeader>

        {!creandoVersion ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                {versiones.length}{" "}
                {versiones.length === 1 ? "version" : "versiones"}
              </p>
              <Button size="sm" onClick={iniciarNuevaVersion}>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Nueva Version
              </Button>
            </div>

            <div className="space-y-2">
              {[...versiones].reverse().map((ver) => {
                const isActual = ver.version === versionActual
                const isExpanded = expandedVersion === ver.version

                return (
                  <div
                    key={ver.id}
                    className={`rounded-lg border transition-colors ${
                      isActual
                        ? "border-primary/40 bg-primary/5"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-3 p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-bold text-foreground">
                        {ver.etiqueta}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            Version {ver.version}
                          </span>
                          {isActual && (
                            <Badge
                              variant="default"
                              className="text-[10px] px-1.5 py-0"
                            >
                              Activa
                            </Badge>
                          )}
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          {ver.nota || "Sin nota"} &middot;{" "}
                          {new Date(ver.creadaEn).toLocaleDateString("es-PA", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            setExpandedVersion(isExpanded ? null : ver.version)
                          }
                          aria-label={
                            isExpanded ? "Contraer contenido" : "Ver contenido"
                          }
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        {!isActual && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs bg-transparent"
                            disabled={restaurando}
                            onClick={() => restaurarVersion(ver.version)}
                          >
                            <RotateCcw className="mr-1 h-3 w-3" />
                            Restaurar
                          </Button>
                        )}
                        {isActual && (
                          <div className="flex h-8 items-center px-2 text-xs text-primary">
                            <Check className="mr-1 h-3 w-3" />
                            En uso
                          </div>
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-border px-3 pb-3 pt-2">
                        <div className="space-y-3">
                          {Object.entries(ver.contenido).map(
                            ([titulo, valor]) => (
                              <div key={titulo}>
                                <p className="mb-0.5 text-xs font-semibold text-foreground">
                                  {titulo}
                                </p>
                                <p className="whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                                  {valor || "(Sin contenido)"}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Creando <span className="font-semibold text-foreground">v{versiones.length}</span>{" "}
                a partir de la version actual (v{versionActual})
              </p>
            </div>

            <div className="space-y-2">
              <Label>Nota de la version</Label>
              <Input
                value={nuevaNota}
                onChange={(e) => setNuevaNota(e.target.value)}
                placeholder="Ej: Ajuste de precios, correccion de texto..."
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <Label className="text-base font-semibold text-foreground">
                Contenido
              </Label>
              {plantilla?.secciones.map((sec) => (
                <div
                  key={sec.id}
                  className="space-y-2 rounded-lg border border-border bg-muted/20 p-3"
                >
                  <Label className="text-sm font-medium text-foreground">
                    {sec.titulo}
                  </Label>
                  <Textarea
                    value={nuevoContenido[sec.titulo] || ""}
                    onChange={(e) =>
                      setNuevoContenido((prev) => ({
                        ...prev,
                        [sec.titulo]: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>
              )) ||
                Object.entries(nuevoContenido).map(([titulo, valor]) => (
                  <div
                    key={titulo}
                    className="space-y-2 rounded-lg border border-border bg-muted/20 p-3"
                  >
                    <Label className="text-sm font-medium text-foreground">
                      {titulo}
                    </Label>
                    <Textarea
                      value={valor}
                      onChange={(e) =>
                        setNuevoContenido((prev) => ({
                          ...prev,
                          [titulo]: e.target.value,
                        }))
                      }
                      rows={3}
                    />
                  </div>
                ))}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCreandoVersion(false)}
              >
                Cancelar
              </Button>
              <Button onClick={guardarNuevaVersion}>
                <Check className="mr-1.5 h-4 w-4" />
                Guardar v{versiones.length}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
