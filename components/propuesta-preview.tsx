"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Propuesta, Cliente, Plantilla } from "@/lib/types"

interface PropuestaPreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  propuesta: Propuesta
  cliente?: Cliente
  plantilla?: Plantilla
}

export function PropuestaPreview({
  open,
  onOpenChange,
  propuesta,
  cliente,
  plantilla,
}: PropuestaPreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">Vista Previa de Propuesta</DialogTitle>
          <DialogDescription>
            Propuesta para {cliente?.nombre || "Cliente"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {cliente?.nombre}
              </h3>
              <p className="text-sm text-muted-foreground">
                RUC: {cliente?.ruc}-{cliente?.dv}
              </p>
              <p className="text-sm text-muted-foreground">
                {cliente?.emailContacto}
              </p>
            </div>
            <Badge
              variant={
                propuesta.estatus === "Aprobada"
                  ? "default"
                  : propuesta.estatus === "Declinada"
                    ? "destructive"
                    : "secondary"
              }
            >
              {propuesta.estatus}
            </Badge>
          </div>

          <Separator />

          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Plantilla
            </p>
            <p className="text-sm text-foreground">
              {plantilla?.nombre || "—"} ({plantilla?.tipo})
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            {Object.entries(propuesta.contenido).map(([titulo, valor]) => (
              <div key={titulo}>
                <h4 className="mb-1 text-sm font-semibold text-foreground">
                  {titulo}
                </h4>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                  {valor || "(Sin contenido)"}
                </p>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Creada:{" "}
              {new Date(propuesta.creadaEn).toLocaleDateString("es-PA")}
            </span>
            <span>
              Expira:{" "}
              {new Date(
                propuesta.fechaExpiracionToken,
              ).toLocaleDateString("es-PA")}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
