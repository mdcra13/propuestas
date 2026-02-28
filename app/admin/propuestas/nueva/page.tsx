"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import useSWR from "swr"
import {
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Cliente, Plantilla } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Etapa {
  id: string
  nombre: string
  descripcion: string
  entregable: string
}

function generateEtapaId() {
  return "etapa-" + Math.random().toString(36).substring(2, 9)
}

function PropuestaPdfPreview({
  contenido,
  etapas,
  cliente,
  plantilla,
  onClose,
}: {
  contenido: Record<string, string>
  etapas: Etapa[]
  cliente?: Cliente
  plantilla?: Plantilla
  onClose: () => void
}) {
  const [currentSlide, setCurrentSlide] = useState(0)

  if (!plantilla) return null

  const secciones = plantilla.secciones.filter(
    (s) => s.titulo !== "Etapas",
  )
  // Build slides: Cover + each regular section + Etapas (one slide per etapa group) + end
  const slides: { tipo: string; titulo: string; contenido?: string; etapas?: Etapa[] }[] = [
    { tipo: "portada", titulo: plantilla.nombre },
  ]

  for (const sec of secciones) {
    slides.push({
      tipo: "seccion",
      titulo: sec.titulo,
      contenido: contenido[sec.titulo] || "",
    })
  }

  if (etapas.length > 0) {
    slides.push({ tipo: "etapas", titulo: "Etapas", etapas })
  }

  const totalSlides = slides.length
  const goPrev = () => setCurrentSlide((s) => Math.max(0, s - 1))
  const goNext = () => setCurrentSlide((s) => Math.min(totalSlides - 1, s + 1))

  const slide = slides[currentSlide]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-4xl flex-col">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-background/80">
            {currentSlide + 1} / {totalSlides}
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-background hover:bg-background/10 hover:text-background"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative aspect-[297/210] w-full overflow-hidden rounded-lg bg-card shadow-2xl">
          {slide.tipo === "portada" ? (
            <div className="flex h-full flex-col">
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[hsl(var(--sidebar-background))]">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-balance text-center text-3xl font-bold tracking-tight text-foreground">
                  {slide.titulo}
                </h1>
                {cliente && (
                  <div className="text-center">
                    <p className="text-lg text-muted-foreground">
                      Preparado para
                    </p>
                    <p className="text-xl font-semibold text-foreground">
                      {cliente.nombre}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      RUC: {cliente.ruc}-{cliente.dv}
                    </p>
                  </div>
                )}
              </div>
              <div className="bg-[hsl(var(--sidebar-background))] px-8 py-4">
                <p className="text-center text-sm text-[hsl(var(--sidebar-foreground))]">
                  {new Date().toLocaleDateString("es-PA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          ) : slide.tipo === "etapas" ? (
            <div className="flex h-full flex-col">
              <div className="bg-[hsl(var(--sidebar-background))] px-8 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-primary">
                    {plantilla.nombre}
                  </p>
                  <p className="text-xs text-[hsl(var(--sidebar-foreground))]">
                    {cliente?.nombre}
                  </p>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-8">
                <h2 className="mb-4 text-2xl font-bold text-foreground">
                  Etapas del Proyecto
                </h2>
                <div className="space-y-3">
                  {(slide.etapas || []).map((etapa, idx) => (
                    <div
                      key={etapa.id}
                      className="flex items-start gap-3 rounded-lg border border-border p-3"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground">
                          {etapa.nombre || "Sin nombre"}
                        </p>
                        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                          {etapa.descripcion || "Sin descripcion"}
                        </p>
                        {etapa.entregable && (
                          <p className="mt-1 text-xs text-primary">
                            Entregable: {etapa.entregable}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-border px-8 py-2">
                <p className="text-center text-xs text-muted-foreground">
                  Pagina {currentSlide + 1} de {totalSlides}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col">
              <div className="bg-[hsl(var(--sidebar-background))] px-8 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-primary">
                    {plantilla.nombre}
                  </p>
                  <p className="text-xs text-[hsl(var(--sidebar-foreground))]">
                    {cliente?.nombre}
                  </p>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-center p-10">
                <h2 className="mb-4 text-2xl font-bold text-foreground">
                  {slide.titulo}
                </h2>
                <p className="max-w-2xl whitespace-pre-wrap text-base leading-relaxed text-muted-foreground">
                  {slide.contenido || "(Sin contenido)"}
                </p>
              </div>
              <div className="border-t border-border px-8 py-2">
                <p className="text-center text-xs text-muted-foreground">
                  Pagina {currentSlide + 1} de {totalSlides}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="border-background/20 bg-transparent text-background hover:bg-background/10 hover:text-background disabled:opacity-30"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentSlide
                    ? "w-6 bg-primary"
                    : "w-2 bg-background/40 hover:bg-background/60"
                }`}
                aria-label={`Diapositiva ${i + 1}`}
              />
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={goNext}
            disabled={currentSlide === totalSlides - 1}
            className="border-background/20 bg-transparent text-background hover:bg-background/10 hover:text-background disabled:opacity-30"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function NuevaPropuestaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const clienteId = searchParams.get("cliente") || ""
  const plantillaId = searchParams.get("plantilla") || ""

  const { data: cliente } = useSWR<Cliente>(
    clienteId ? `/api/clientes/${clienteId}` : null,
    fetcher,
  )
  const { data: plantilla } = useSWR<Plantilla>(
    plantillaId ? `/api/plantillas/${plantillaId}` : null,
    fetcher,
  )

  const [contenido, setContenido] = useState<Record<string, string>>({})
  const [etapas, setEtapas] = useState<Etapa[]>([
    { id: generateEtapaId(), nombre: "", descripcion: "", entregable: "" },
  ])
  const [submitting, setSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Initialize contenido when plantilla loads
  useEffect(() => {
    if (plantilla) {
      const initial: Record<string, string> = {}
      for (const sec of plantilla.secciones) {
        if (sec.titulo !== "Etapas") {
          initial[sec.titulo] = ""
        }
      }
      setContenido(initial)
    }
  }, [plantilla])

  function addEtapa() {
    setEtapas([
      ...etapas,
      { id: generateEtapaId(), nombre: "", descripcion: "", entregable: "" },
    ])
  }

  function removeEtapa(id: string) {
    if (etapas.length <= 1) return
    setEtapas(etapas.filter((e) => e.id !== id))
  }

  function updateEtapa(id: string, field: keyof Etapa, value: string) {
    setEtapas(
      etapas.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    )
  }

  async function handleCrearPropuesta() {
    setSubmitting(true)
    try {
      const body = {
        idCliente: clienteId,
        idPlantilla: plantillaId,
        contenido: {
          ...contenido,
          Etapas: JSON.stringify(
            etapas.map(({ nombre, descripcion, entregable }) => ({
              nombre,
              descripcion,
              entregable,
            })),
          ),
        },
        estatus: "Activa",
      }

      await fetch("/api/propuestas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      toast.success("Propuesta creada exitosamente")
      router.push("/admin/propuestas")
    } catch {
      toast.error("Error al crear la propuesta")
    } finally {
      setSubmitting(false)
    }
  }

  const hasEtapas = plantilla?.secciones.some((s) => s.titulo === "Etapas")

  if (!plantilla || !cliente) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/propuestas")}
            aria-label="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Editor de Propuesta
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="outline">{plantilla.nombre}</Badge>
              <span className="text-sm text-muted-foreground">
                para {cliente.nombre}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            Vista Previa
          </Button>
          <Button onClick={handleCrearPropuesta} disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Crear Propuesta
          </Button>
        </div>
      </div>

      {/* Client info card */}
      <Card className="mb-6">
        <CardContent className="flex items-center gap-4 pt-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--sidebar-background))]">
            <span className="text-lg font-bold text-primary">
              {cliente.nombre.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-semibold text-foreground">{cliente.nombre}</p>
            <p className="text-sm text-muted-foreground">
              RUC: {cliente.ruc}-{cliente.dv} | {cliente.emailContacto}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sections editor */}
      <div className="space-y-4">
        {plantilla.secciones
          .filter((sec) => sec.titulo !== "Etapas")
          .map((sec, idx) => (
            <Card key={sec.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                    {idx + 1}
                  </span>
                  <div>
                    <CardTitle className="text-base text-foreground">
                      {sec.titulo}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {sec.descripcion}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={contenido[sec.titulo] || ""}
                  onChange={(e) =>
                    setContenido((prev) => ({
                      ...prev,
                      [sec.titulo]: e.target.value,
                    }))
                  }
                  placeholder={`Escribe el contenido de "${sec.titulo}"...`}
                  rows={5}
                  className="resize-y"
                />
              </CardContent>
            </Card>
          ))}

        {/* Etapas editor */}
        {hasEtapas && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                    {plantilla.secciones.filter(
                      (s) => s.titulo !== "Etapas",
                    ).length + 1}
                  </span>
                  <div>
                    <CardTitle className="text-base text-foreground">
                      Etapas
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Fases del proyecto. Puedes agregar varias etapas.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addEtapa}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Agregar Etapa
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {etapas.map((etapa, idx) => (
                <div
                  key={etapa.id}
                  className="rounded-lg border border-border bg-muted/30 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      Etapa {idx + 1}
                    </span>
                    {etapas.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => removeEtapa(etapa.id)}
                        aria-label="Eliminar etapa"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs">
                        Nombre de la etapa
                      </Label>
                      <Input
                        value={etapa.nombre}
                        onChange={(e) =>
                          updateEtapa(etapa.id, "nombre", e.target.value)
                        }
                        placeholder="Ej: Fase 1 - Analisis"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">
                        Descripcion
                      </Label>
                      <Textarea
                        value={etapa.descripcion}
                        onChange={(e) =>
                          updateEtapa(
                            etapa.id,
                            "descripcion",
                            e.target.value,
                          )
                        }
                        placeholder="Describe las actividades de esta etapa..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">
                        Entregable
                      </Label>
                      <Input
                        value={etapa.entregable}
                        onChange={(e) =>
                          updateEtapa(
                            etapa.id,
                            "entregable",
                            e.target.value,
                          )
                        }
                        placeholder="Ej: Documento de requerimientos"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom action bar */}
      <Separator className="my-6" />
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/propuestas")}
        >
          Cancelar
        </Button>
        <Button variant="outline" onClick={() => setShowPreview(true)}>
          Vista Previa
        </Button>
        <Button onClick={handleCrearPropuesta} disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Crear Propuesta
        </Button>
      </div>

      {/* PDF Preview */}
      {showPreview && (
        <PropuestaPdfPreview
          contenido={contenido}
          etapas={etapas}
          cliente={cliente}
          plantilla={plantilla}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  )
}
