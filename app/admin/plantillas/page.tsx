"use client"

import { useState } from "react"
import useSWR from "swr"
import {
  FileText,
  Building2,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Plantilla } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function PlantillaSlideshow({
  plantilla,
  onClose,
}: {
  plantilla: Plantilla
  onClose: () => void
}) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = plantilla.secciones.length + 1

  const goPrev = () => setCurrentSlide((s) => Math.max(0, s - 1))
  const goNext = () => setCurrentSlide((s) => Math.min(totalSlides - 1, s + 1))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-4xl flex-col">
        {/* Close button */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-background/80">
            {currentSlide + 1} / {totalSlides}
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-background hover:bg-background/10 hover:text-background"
            aria-label="Cerrar vista previa"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Slide container - A4 aspect ratio */}
        <div className="relative aspect-[297/210] w-full overflow-hidden rounded-lg bg-card shadow-2xl">
          {currentSlide === 0 ? (
            /* Cover Slide */
            <div className="flex h-full flex-col">
              <div className="flex flex-1 flex-col items-center justify-center gap-6 p-12">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[hsl(var(--sidebar-background))]">
                  {plantilla.tipo === "Propuesta" ? (
                    <FileText className="h-10 w-10 text-primary" />
                  ) : (
                    <Building2 className="h-10 w-10 text-primary" />
                  )}
                </div>
                <div className="text-center">
                  <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground">
                    {plantilla.nombre}
                  </h1>
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <Badge variant="outline" className="text-sm">
                      {plantilla.tipo}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {plantilla.secciones.length} secciones
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-[hsl(var(--sidebar-background))] px-8 py-4">
                <p className="text-center text-sm text-[hsl(var(--sidebar-foreground))]">
                  Plantilla del Sistema de Propuestas
                </p>
              </div>
            </div>
          ) : (
            /* Section Slide */
            <div className="flex h-full flex-col">
              <div className="bg-[hsl(var(--sidebar-background))] px-8 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-primary">
                    {plantilla.nombre}
                  </p>
                  <p className="text-xs text-[hsl(var(--sidebar-foreground))]">
                    Seccion {currentSlide} de {plantilla.secciones.length}
                  </p>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-center p-12">
                <div className="mb-2 flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
                    {currentSlide}
                  </span>
                  <h2 className="text-balance text-3xl font-bold text-foreground">
                    {plantilla.secciones[currentSlide - 1].titulo}
                  </h2>
                </div>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  {plantilla.secciones[currentSlide - 1].descripcion}
                </p>
              </div>
              <div className="border-t border-border px-8 py-3">
                <p className="text-center text-xs text-muted-foreground">
                  Pagina {currentSlide + 1} de {totalSlides}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-4 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="border-background/20 bg-transparent text-background hover:bg-background/10 hover:text-background disabled:opacity-30"
            aria-label="Diapositiva anterior"
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
                aria-label={`Ir a diapositiva ${i + 1}`}
              />
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={goNext}
            disabled={currentSlide === totalSlides - 1}
            className="border-background/20 bg-transparent text-background hover:bg-background/10 hover:text-background disabled:opacity-30"
            aria-label="Siguiente diapositiva"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function PlantillasPage() {
  const { data: plantillas = [] } = useSWR<Plantilla[]>(
    "/api/plantillas",
    fetcher,
  )

  const [previewPlantilla, setPreviewPlantilla] = useState<Plantilla | null>(
    null,
  )

  const iconMap: Record<string, React.ReactNode> = {
    Propuesta: <FileText className="h-8 w-8 text-primary" />,
    "Perfil Empresa": <Building2 className="h-8 w-8 text-primary" />,
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Plantillas
        </h1>
        <p className="mt-1 text-muted-foreground">
          Plantillas predefinidas para propuestas y perfiles de empresa
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {plantillas.map((p) => (
          <Card
            key={p.id}
            className="group overflow-hidden border-border transition-shadow hover:shadow-lg"
          >
            {/* Card header band */}
            <div className="bg-[hsl(var(--sidebar-background))] px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--sidebar-accent))]">
                  {iconMap[p.tipo] || (
                    <Layers className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[hsl(var(--sidebar-primary-foreground))]">
                    {p.nombre}
                  </h2>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-[hsl(var(--sidebar-border))] text-[hsl(var(--sidebar-foreground))]"
                    >
                      {p.tipo}
                    </Badge>
                    <span className="text-xs text-[hsl(var(--sidebar-foreground))]">
                      {p.secciones.length} secciones
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              {/* Sections list */}
              <div className="mb-5 space-y-2">
                {p.secciones.map((sec, idx) => (
                  <div key={sec.id} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-foreground">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {sec.titulo}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {sec.descripcion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                className="w-full"
                onClick={() => setPreviewPlantilla(p)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Vista Previa
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {previewPlantilla && (
        <PlantillaSlideshow
          plantilla={previewPlantilla}
          onClose={() => setPreviewPlantilla(null)}
        />
      )}
    </div>
  )
}
