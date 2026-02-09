"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import type { Cliente, TipoContribuyente, EstatusCliente } from "@/lib/types"

interface ClienteFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cliente?: Cliente | null
  onSubmit: (data: Omit<Cliente, "id" | "creadoEn">) => void
  modo?: "completo" | "rapido"
}

export function ClienteForm({
  open,
  onOpenChange,
  cliente,
  onSubmit,
  modo = "completo",
}: ClienteFormProps) {
  const [nombre, setNombre] = useState(cliente?.nombre || "")
  const [ruc, setRuc] = useState(cliente?.ruc || "")
  const [dv, setDv] = useState(cliente?.dv || "")
  const [telefono, setTelefono] = useState(cliente?.telefono || "")
  const [emailContacto, setEmailContacto] = useState(
    cliente?.emailContacto || "",
  )
  const [emailFacturacion, setEmailFacturacion] = useState(
    cliente?.emailFacturacion || "",
  )
  const [pais, setPais] = useState(cliente?.pais || "Panama")
  const [tipoContribuyente, setTipoContribuyente] =
    useState<TipoContribuyente>(cliente?.tipoContribuyente || "Juridico")
  const [estatus, setEstatus] = useState<EstatusCliente>(
    cliente?.estatus || "Activo",
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      nombre,
      ruc,
      dv,
      telefono,
      emailContacto,
      emailFacturacion,
      pais,
      tipoContribuyente,
      logoUrl: cliente?.logoUrl || "",
      estatus,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {cliente ? "Editar Cliente" : modo === "rapido" ? "Cliente Rapido" : "Nuevo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {modo === "rapido"
              ? "Ingresa los datos basicos del cliente"
              : "Completa todos los campos del cliente"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre / Razon Social</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre de la empresa"
              required
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="ruc">RUC</Label>
              <Input
                id="ruc"
                value={ruc}
                onChange={(e) => setRuc(e.target.value)}
                placeholder="155123456"
                required={modo === "completo"}
              />
            </div>
            <div className="w-20 space-y-2">
              <Label htmlFor="dv">DV</Label>
              <Input
                id="dv"
                value={dv}
                onChange={(e) => setDv(e.target.value)}
                placeholder="78"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailContacto">Email de Contacto</Label>
            <Input
              id="emailContacto"
              type="email"
              value={emailContacto}
              onChange={(e) => setEmailContacto(e.target.value)}
              placeholder="contacto@empresa.com"
              required
            />
          </div>

          {modo === "completo" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="telefono">Telefono</Label>
                <Input
                  id="telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="+507 6000-1234"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailFacturacion">
                  Email de Facturacion
                </Label>
                <Input
                  id="emailFacturacion"
                  type="email"
                  value={emailFacturacion}
                  onChange={(e) => setEmailFacturacion(e.target.value)}
                  placeholder="facturacion@empresa.com"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="pais">Pais</Label>
                  <Input
                    id="pais"
                    value={pais}
                    onChange={(e) => setPais(e.target.value)}
                    placeholder="Panama"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Tipo de Contribuyente</Label>
                  <Select
                    value={tipoContribuyente}
                    onValueChange={(v) =>
                      setTipoContribuyente(v as TipoContribuyente)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Natural">Natural</SelectItem>
                      <SelectItem value="Juridico">Juridico</SelectItem>
                      <SelectItem value="Extranjero">Extranjero</SelectItem>
                      <SelectItem value="Agente Retencion">
                        Agente Retencion
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Estatus</Label>
                <Select
                  value={estatus}
                  onValueChange={(v) => setEstatus(v as EstatusCliente)}
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
            </>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {cliente ? "Guardar Cambios" : "Crear Cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
