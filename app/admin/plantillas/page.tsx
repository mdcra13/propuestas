"use client"

import React from "react"

import { useState } from "react"
import useSWR from "swr"
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import type {
  Plantilla,
  SeccionPlantilla,
  TipoPlantilla,
  EstatusPlantilla,
} from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function generateTempId() {
  return "sec-" + Math.random().toString(36).substring(2, 9)
}

export default function PlantillasPage() {
  const { data: plantillas = [], mutate } = useSWR<Plantilla[]>(
    "/api/plantillas",
    fetcher,
  )

  const [formOpen, setFormOpen] = useState(false)
  const [editPlantilla, setEditPlantilla] = useState<Plantilla | null>(null)

  const [nombre, setNombre] = useState("")
  const [tipo, setTipo] = useState<TipoPlantilla>("Propuesta")
  const [estatus, setEstatus] = useState<EstatusPlantilla>("Activa")
  const [secciones, setSecciones] = useState<SeccionPlantilla[]>([])

  function openNew() {
    setNombre("")
    setTipo("Propuesta")
    setEstatus("Activa")
    setSecciones([
      {
        id: generateTempId(),
        titulo: "",
        descripcion: "",
        orden: 1,
      },
    ])
    setEditPlantilla(null)
    setFormOpen(true)
  }

  function openEdit(p: Plantilla) {
    setNombre(p.nombre)
    setTipo(p.tipo)
    setEstatus(p.estatus)
    setSecciones([...p.secciones])
    setEditPlantilla(p)
    setFormOpen(true)
  }

  function addSeccion() {
    setSecciones([
      ...secciones,
      {
        id: generateTempId(),
        titulo: "",
        descripcion: "",
        orden: secciones.length + 1,
      },
    ])
  }

  function removeSeccion(id: string) {
    setSecciones(
      secciones
        .filter((s) => s.id !== id)
        .map((s, i) => ({ ...s, orden: i + 1 })),
    )
  }

  function updateSeccion(
    id: string,
    field: keyof SeccionPlantilla,
    value: string,
  ) {
    setSecciones(
      secciones.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const body = { nombre, tipo, estatus, secciones }

    if (editPlantilla) {
      await fetch(`/api/plantillas/${editPlantilla.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      toast.success("Plantilla actualizada")
    } else {
      await fetch("/api/plantillas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      toast.success("Plantilla creada")
    }
    mutate()
    setFormOpen(false)
  }

  async function handleDelete(id: string) {
    await fetch(`/api/plantillas/${id}`, { method: "DELETE" })
    mutate()
    toast.success("Plantilla eliminada")
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Plantillas
          </h1>
          <p className="mt-1 text-muted-foreground">
            Configura las plantillas para propuestas y perfiles
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Plantilla
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plantillas.map((p) => (
          <Card key={p.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg text-foreground">{p.nombre}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{p.tipo}</Badge>
                  <Badge
                    variant={p.estatus === "Activa" ? "default" : "secondary"}
                  >
                    {p.estatus}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm text-muted-foreground">
                {p.secciones.length} secciones
              </p>
              <div className="mb-4 space-y-1">
                {p.secciones.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <GripVertical className="h-3 w-3 shrink-0" />
                    {s.titulo || "Sin titulo"}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(p)}
                >
                  <Pencil className="mr-1 h-3 w-3" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(p.id)}
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {plantillas.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No hay plantillas. Crea una nueva para empezar.
          </div>
        )}
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editPlantilla ? "Editar Plantilla" : "Nueva Plantilla"}
            </DialogTitle>
            <DialogDescription>
              Define el nombre, tipo y las secciones de la plantilla
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 space-y-2">
                <Label htmlFor="tpl-nombre">Nombre</Label>
                <Input
                  id="tpl-nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Propuesta Comercial Estandar"
                  required
                />
              </div>
              <div className="w-44 space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={tipo}
                  onValueChange={(v) => setTipo(v as TipoPlantilla)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Propuesta">Propuesta</SelectItem>
                    <SelectItem value="Perfil Empresa">
                      Perfil Empresa
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-32 space-y-2">
                <Label>Estatus</Label>
                <Select
                  value={estatus}
                  onValueChange={(v) => setEstatus(v as EstatusPlantilla)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activa">Activa</SelectItem>
                    <SelectItem value="Inactiva">Inactiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base">Secciones</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSeccion}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Agregar Seccion
                </Button>
              </div>

              {secciones.map((sec, idx) => (
                <div
                  key={sec.id}
                  className="rounded-lg border border-border bg-muted/50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Seccion {idx + 1}
                    </span>
                    {secciones.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => removeSeccion(sec.id)}
                        aria-label="Eliminar seccion"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Input
                      placeholder="Titulo de la seccion"
                      value={sec.titulo}
                      onChange={(e) =>
                        updateSeccion(sec.id, "titulo", e.target.value)
                      }
                      required
                    />
                    <Textarea
                      placeholder="Descripcion / instrucciones para esta seccion"
                      value={sec.descripcion}
                      onChange={(e) =>
                        updateSeccion(sec.id, "descripcion", e.target.value)
                      }
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editPlantilla ? "Guardar Cambios" : "Crear Plantilla"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
