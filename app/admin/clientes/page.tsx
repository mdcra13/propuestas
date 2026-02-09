"use client"

import { useState } from "react"
import useSWR from "swr"
import { Plus, Pencil, UserX, Search } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ClienteForm } from "@/components/cliente-form"
import type { Cliente } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ClientesPage() {
  const { data: clientes = [], mutate } = useSWR<Cliente[]>(
    "/api/clientes",
    fetcher,
  )
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editCliente, setEditCliente] = useState<Cliente | null>(null)
  const [inactivarId, setInactivarId] = useState<string | null>(null)

  const filtered = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.ruc.includes(search) ||
      c.emailContacto.toLowerCase().includes(search.toLowerCase()),
  )

  async function handleCreate(
    data: Omit<Cliente, "id" | "creadoEn">,
  ) {
    await fetch("/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    mutate()
    toast.success("Cliente creado exitosamente")
  }

  async function handleUpdate(
    data: Omit<Cliente, "id" | "creadoEn">,
  ) {
    if (!editCliente) return
    await fetch(`/api/clientes/${editCliente.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    mutate()
    setEditCliente(null)
    toast.success("Cliente actualizado exitosamente")
  }

  async function handleInactivar() {
    if (!inactivarId) return
    await fetch(`/api/clientes/${inactivarId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estatus: "Inactivo" }),
    })
    mutate()
    setInactivarId(null)
    toast.success("Cliente inactivado")
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Clientes
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gestiona tus clientes y sus datos
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, RUC o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>RUC-DV</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Tipo</TableHead>
              <TableHead>Estatus</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  No se encontraron clientes
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium text-foreground">
                    {cliente.nombre}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {cliente.ruc}-{cliente.dv}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {cliente.emailContacto}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant="outline">{cliente.tipoContribuyente}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        cliente.estatus === "Activo" ? "default" : "secondary"
                      }
                    >
                      {cliente.estatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditCliente(cliente)
                        }}
                        aria-label="Editar cliente"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {cliente.estatus === "Activo" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setInactivarId(cliente.id)}
                          aria-label="Inactivar cliente"
                        >
                          <UserX className="h-4 w-4" />
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

      <ClienteForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCreate}
      />

      {editCliente && (
        <ClienteForm
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditCliente(null)
          }}
          cliente={editCliente}
          onSubmit={handleUpdate}
        />
      )}

      <AlertDialog
        open={!!inactivarId}
        onOpenChange={(open) => {
          if (!open) setInactivarId(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inactivar Cliente</AlertDialogTitle>
            <AlertDialogDescription>
              Este cliente sera marcado como inactivo y no aparecera en las
              listas de seleccion. Puedes reactivarlo mas adelante.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleInactivar}>
              Inactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
