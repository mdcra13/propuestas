"use client"

import React from "react"

import { useState } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { ClienteForm } from "@/components/cliente-form"
import type { Cliente, Plantilla } from "@/lib/types"

interface PropuestaCreatorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientes: Cliente[]
  plantillas: Plantilla[]
  onCreated: () => void
}

export function PropuestaCreator({
  open,
  onOpenChange,
  clientes,
  plantillas,
  onCreated,
}: PropuestaCreatorProps) {
  const [idCliente, setIdCliente] = useState("")
  const [idPlantilla, setIdPlantilla] = useState("")
  const [contenido, setContenido] = useState<Record<string, string>>({})
  const [clienteRapidoOpen, setClienteRapidoOpen] = useState(false)
  const [localClientes, setLocalClientes] = useState(clientes)

  const plantillaSeleccionada = plantillas.find((p) => p.id === idPlantilla)

  function handlePlantillaChange(value: string) {
    setIdPlantilla(value)
    const pl = plantillas.find((p) => p.id === value)
    if (pl) {
      const nuevoContenido: Record<string, string> = {}
      for (const sec of pl.secciones) {
        nuevoContenido[sec.titulo] = ""
      }
      setContenido(nuevoContenido)
    }
  }

  function updateSeccion(titulo: string, valor: string) {
    setContenido((prev) => ({ ...prev, [titulo]: valor }))
  }

  async function handleClienteRapido(
    data: Omit<Cliente, "id" | "creadoEn">,
  ) {
    const res = await fetch("/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const nuevoCliente = await res.json()
    setLocalClientes((prev) => [...prev, nuevoCliente])
    setIdCliente(nuevoCliente.id)
    toast.success("Cliente rapido creado")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!idCliente || !idPlantilla) {
      toast.error("Selecciona un cliente y una plantilla")
      return
    }

    await fetch("/api/propuestas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idCliente,
        idPlantilla,
        contenido,
        estatus: "Activa",
      }),
    })

    toast.success("Propuesta creada exitosamente")
    onCreated()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Nueva Propuesta
            </DialogTitle>
            <DialogDescription>
              Selecciona un cliente y una plantilla, luego completa cada seccion
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex gap-3">
              <div className="flex-1 space-y-2">
                <Label>Cliente</Label>
                <Select value={idCliente} onValueChange={setIdCliente}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {localClientes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setClienteRapidoOpen(true)}
                  aria-label="Cliente rapido"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Plantilla</Label>
              <Select
                value={idPlantilla}
                onValueChange={handlePlantillaChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar plantilla" />
                </SelectTrigger>
                <SelectContent>
                  {plantillas.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nombre} ({p.tipo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {plantillaSeleccionada && (
              <div className="space-y-4">
                <Label className="text-base font-semibold text-foreground">
                  Contenido de la Propuesta
                </Label>
                {plantillaSeleccionada.secciones.map((sec) => (
                  <div
                    key={sec.id}
                    className="space-y-2 rounded-lg border border-border bg-muted/30 p-4"
                  >
                    <Label className="text-sm font-medium text-foreground">
                      {sec.titulo}
                    </Label>
                    {sec.descripcion && (
                      <p className="text-xs text-muted-foreground">
                        {sec.descripcion}
                      </p>
                    )}
                    <Textarea
                      value={contenido[sec.titulo] || ""}
                      onChange={(e) =>
                        updateSeccion(sec.titulo, e.target.value)
                      }
                      placeholder={`Escribe el contenido de "${sec.titulo}"...`}
                      rows={4}
                    />
                  </div>
                ))}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!idCliente || !idPlantilla}>
                Crear Propuesta
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ClienteForm
        open={clienteRapidoOpen}
        onOpenChange={setClienteRapidoOpen}
        onSubmit={handleClienteRapido}
        modo="rapido"
      />
    </>
  )
}
