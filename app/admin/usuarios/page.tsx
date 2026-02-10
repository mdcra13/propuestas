"use client"

import { useState } from "react"
import useSWR from "swr"
import { Plus, Pencil, Trash2, Search, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Usuario, EstatusUsuario } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function UsuarioFormDialog({
  open,
  onOpenChange,
  usuario,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario?: Usuario | null
  onSubmit: (data: {
    nombre: string
    correo: string
    password: string
    estatus: EstatusUsuario
  }) => void
}) {
  const [nombre, setNombre] = useState(usuario?.nombre || "")
  const [correo, setCorreo] = useState(usuario?.correo || "")
  const [password, setPassword] = useState("")
  const [estatus, setEstatus] = useState<EstatusUsuario>(
    usuario?.estatus || "Activo",
  )
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!usuario && !password) {
      toast.error("La contrasena es requerida para nuevos usuarios")
      return
    }
    onSubmit({ nombre, correo, password, estatus })
    onOpenChange(false)
    setNombre("")
    setCorreo("")
    setPassword("")
    setEstatus("Activo")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {usuario ? "Editar Usuario" : "Nuevo Usuario"}
          </DialogTitle>
          <DialogDescription>
            {usuario
              ? "Modifica los datos del usuario. Deja la contrasena vacia para mantener la actual."
              : "Completa los datos para crear un nuevo usuario del sistema."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="usr-nombre">Nombre</Label>
            <Input
              id="usr-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre completo"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="usr-correo">Correo electronico</Label>
            <Input
              id="usr-correo"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="usuario@empresa.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="usr-password">
              Contrasena{usuario ? " (dejar vacio para mantener)" : ""}
            </Label>
            <div className="relative">
              <Input
                id="usr-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={usuario ? "Nueva contrasena (opcional)" : "Contrasena"}
                required={!usuario}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Ocultar" : "Mostrar"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Estatus</Label>
            <Select
              value={estatus}
              onValueChange={(v) => setEstatus(v as EstatusUsuario)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {usuario ? "Guardar Cambios" : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function UsuariosPage() {
  const { data: usuarios = [], mutate } = useSWR<Usuario[]>(
    "/api/usuarios",
    fetcher,
  )
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editUsuario, setEditUsuario] = useState<Usuario | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.correo.toLowerCase().includes(search.toLowerCase()),
  )

  async function handleCreate(data: {
    nombre: string
    correo: string
    password: string
    estatus: EstatusUsuario
  }) {
    await fetch("/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    mutate()
    toast.success("Usuario creado exitosamente")
  }

  async function handleUpdate(data: {
    nombre: string
    correo: string
    password: string
    estatus: EstatusUsuario
  }) {
    if (!editUsuario) return
    const body: Record<string, string> = {
      nombre: data.nombre,
      correo: data.correo,
      estatus: data.estatus,
    }
    if (data.password) {
      body.password = data.password
    }
    await fetch(`/api/usuarios/${editUsuario.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    mutate()
    setEditUsuario(null)
    toast.success("Usuario actualizado exitosamente")
  }

  async function handleDelete() {
    if (!deleteId) return
    await fetch(`/api/usuarios/${deleteId}`, {
      method: "DELETE",
    })
    mutate()
    setDeleteId(null)
    toast.success("Usuario eliminado")
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Usuarios
          </h1>
          <p className="mt-1 text-muted-foreground">
            Administra los usuarios del sistema
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o correo..."
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
              <TableHead>Correo</TableHead>
              <TableHead className="hidden md:table-cell">Creado</TableHead>
              <TableHead>Estatus</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  No se encontraron usuarios
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium text-foreground">
                    {usuario.nombre}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {usuario.correo}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {new Date(usuario.creadoEn).toLocaleDateString("es-PA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        usuario.estatus === "Activo" ? "default" : "secondary"
                      }
                    >
                      {usuario.estatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditUsuario(usuario)}
                        aria-label="Editar usuario"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(usuario.id)}
                        aria-label="Eliminar usuario"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UsuarioFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCreate}
      />

      {editUsuario && (
        <UsuarioFormDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditUsuario(null)
          }}
          usuario={editUsuario}
          onSubmit={handleUpdate}
        />
      )}

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Usuario</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion eliminara permanentemente al usuario del sistema. Esta
              accion no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
