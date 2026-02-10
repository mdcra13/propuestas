"use client"

import useSWR from "swr"
import { Users, FileText, FilePlus, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Cliente, Propuesta, Plantilla } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function DashboardPage() {
  const { data: clientes = [] } = useSWR<Cliente[]>("/api/clientes", fetcher)
  const { data: propuestas = [] } = useSWR<Propuesta[]>("/api/propuestas", fetcher)
  const { data: plantillas = [] } = useSWR<Plantilla[]>("/api/plantillas", fetcher)

  const activas = propuestas.filter((p) => p.estatus === "Activa").length
  const aprobadas = propuestas.filter((p) => p.estatus === "Aprobada").length
  const declinadas = propuestas.filter((p) => p.estatus === "Declinada").length

  const stats = [
    {
      label: "Clientes",
      value: clientes.length,
      icon: Users,
      color: "bg-primary text-primary-foreground",
    },
    {
      label: "Plantillas",
      value: plantillas.length,
      icon: FileText,
      color: "bg-accent text-accent-foreground",
    },
    {
      label: "Propuestas Activas",
      value: activas,
      icon: FilePlus,
      color: "bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]",
    },
    {
      label: "Aprobadas",
      value: aprobadas,
      icon: CheckCircle,
      color: "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]",
    },
  ]

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Panel
        </h1>
        <p className="mt-1 text-muted-foreground">
          Resumen general de tu sistema de propuestas
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.color}`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Propuestas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {propuestas.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay propuestas aun</p>
            ) : (
              <div className="space-y-3">
                {propuestas.slice(0, 5).map((p) => {
                  const cliente = clientes.find((c) => c.id === p.idCliente)
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {cliente?.nombre || "Cliente desconocido"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(p.creadaEn).toLocaleDateString("es-PA")}
                        </p>
                      </div>
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
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Clientes Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {clientes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay clientes aun</p>
            ) : (
              <div className="space-y-3">
                {clientes.slice(0, 5).map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{c.nombre}</p>
                      <p className="text-xs text-muted-foreground">
                        RUC: {c.ruc}-{c.dv}
                      </p>
                    </div>
                    <Badge
                      variant={c.estatus === "Activo" ? "default" : "secondary"}
                    >
                      {c.estatus}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
