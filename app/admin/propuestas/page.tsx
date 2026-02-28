"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import {
  Plus,
  Eye,
  Send,
  Copy,
  ExternalLink,
  History,
  FileText,
  Building2,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import type { Cliente, Plantilla, Propuesta } from "@/lib/types"
import { PropuestaPreview } from "@/components/propuesta-preview"
import { PropuestaVersiones } from "@/components/propuesta-versiones"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function PropuestasPage() {
  const router = useRouter()
  const { data: propuestas = [], mutate } = useSWR<Propuesta[]>(
    "/api/propuestas",
    fetcher,
  )
  const { data: clientes = [] } = useSWR<Cliente[]>("/api/clientes", fetcher)
  const { data: plantillas = [] } = useSWR<Plantilla[]>(
    "/api/plantillas?activas=true",
    fetcher,
  )

  const [selectorOpen, setSelectorOpen] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState("")
  const [selectedPlantilla, setSelectedPlantilla] = useState("")
  const [previewPropuesta, setPreviewPropuesta] = useState<Propuesta | null>(
    null,
  )
  const [versionesPropuesta, setVersionesPropuesta] =
    useState<Propuesta | null>(null)

  function getClienteNombre(id: string) {
    return clientes.find((c) => c.id === id)?.nombre || "Desconocido"
  }

  function getPlantillaNombre(id: string) {
    return plantillas.find((p) => p.id === id)?.nombre || "—"
  }

  function copyPortalLink(token: string) {
    const url = `${window.location.origin}/portal/${token}`
    navigator.clipboard.writeText(url)
    toast.success("Enlace copiado al portapapeles")
  }

  function handleIrAEditor() {
    if (!selectedCliente || !selectedPlantilla) {
      toast.error("Selecciona un cliente y una plantilla")
      return
    }
    router.push(
      `/admin/propuestas/nueva?cliente=${selectedCliente}&plantilla=${selectedPlantilla}`,
    )
    setSelectorOpen(false)
  }

  function openSelector() {
    setSelectedCliente("")
    setSelectedPlantilla("")
    setSelectorOpen(true)
  }

  const stats = {
    total: propuestas.length,
    activas: propuestas.filter((p) => p.estatus === "Activa").length,
    aprobadas: propuestas.filter((p) => p.estatus === "Aprobada").length,
    declinadas: propuestas.filter((p) => p.estatus === "Declinada").length,
  }

  const clientesActivos = clientes.filter((c) => c.estatus === "Activo")

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Propuestas
          </h1>
          <p className="mt-1 text-muted-foreground">
            Crea y gestiona propuestas comerciales
          </p>
        </div>
        <Button onClick={openSelector}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Propuesta
        </Button>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Activas</p>
            <p className="text-2xl font-bold text-primary">{stats.activas}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Aprobadas</p>
            <p className="text-2xl font-bold text-[hsl(var(--success))]">
              {stats.aprobadas}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Declinadas</p>
            <p className="text-2xl font-bold text-destructive">
              {stats.declinadas}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden md:table-cell">Plantilla</TableHead>
              <TableHead>Estatus</TableHead>
              <TableHead className="hidden md:table-cell">Version</TableHead>
              <TableHead className="hidden lg:table-cell">Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {propuestas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  No hay propuestas. Crea una nueva para empezar.
                </TableCell>
              </TableRow>
            ) : (
              propuestas.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-foreground">
                    {getClienteNombre(p.idCliente)}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {getPlantillaNombre(p.idPlantilla)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        p.estatus === "Aprobada"
                          ? "default"
                          : p.estatus === "Declinada"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {p.estatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <button
                      type="button"
                      onClick={() => setVersionesPropuesta(p)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      <History className="h-3 w-3" />
                      v{p.versionActual}
                      <span className="text-muted-foreground">
                        ({p.versiones.length})
                      </span>
                    </button>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">
                    {new Date(p.creadaEn).toLocaleDateString("es-PA")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setVersionesPropuesta(p)}
                        aria-label="Historial de versiones"
                      >
                        <History className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setPreviewPropuesta(p)}
                        aria-label="Vista previa"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyPortalLink(p.hashToken)}
                        aria-label="Copiar enlace"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {p.estatus === "Activa" && !p.tokenUsado && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            copyPortalLink(p.hashToken)
                            toast.info(
                              "Enlace del portal copiado. En produccion, se enviaria por correo SMTP.",
                            )
                          }}
                          aria-label="Enviar propuesta"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      {p.estatus === "Activa" && !p.tokenUsado && (
                        <Button variant="ghost" size="icon" asChild>
                          <a
                            href={`/portal/${p.hashToken}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Abrir portal del cliente"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Selector Dialog */}
      <Dialog open={selectorOpen} onOpenChange={setSelectorOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Nueva Propuesta
            </DialogTitle>
            <DialogDescription>
              Selecciona un cliente y una plantilla para comenzar a editar
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select
                value={selectedCliente}
                onValueChange={setSelectedCliente}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientesActivos.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Plantilla</Label>
              <div className="grid gap-2">
                {plantillas.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlantilla(p.id)}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                      selectedPlantilla === p.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        selectedPlantilla === p.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {p.tipo === "Propuesta" ? (
                        <FileText className="h-5 w-5" />
                      ) : (
                        <Building2 className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {p.nombre}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.secciones.length} secciones
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectorOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleIrAEditor}
              disabled={!selectedCliente || !selectedPlantilla}
            >
              Continuar al Editor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {previewPropuesta && (
        <PropuestaPreview
          open={!!previewPropuesta}
          onOpenChange={(open) => {
            if (!open) setPreviewPropuesta(null)
          }}
          propuesta={previewPropuesta}
          cliente={clientes.find((c) => c.id === previewPropuesta.idCliente)}
          plantilla={plantillas.find(
            (p) => p.id === previewPropuesta.idPlantilla,
          )}
        />
      )}

      {versionesPropuesta && (
        <PropuestaVersiones
          open={!!versionesPropuesta}
          onOpenChange={(open) => {
            if (!open) setVersionesPropuesta(null)
          }}
          propuesta={versionesPropuesta}
          plantilla={plantillas.find(
            (p) => p.id === versionesPropuesta.idPlantilla,
          )}
          onUpdated={() => mutate()}
        />
      )}
    </div>
  )
}
