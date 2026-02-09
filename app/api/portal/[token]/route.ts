import { NextResponse } from "next/server"
import { getPropuestaPorToken, getCliente, getPlantilla, actualizarPropuesta } from "@/lib/store"

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const propuesta = getPropuestaPorToken(token)

  if (!propuesta) {
    return NextResponse.json({ error: "Enlace caducado o invalido" }, { status: 404 })
  }

  if (new Date(propuesta.fechaExpiracionToken) < new Date()) {
    return NextResponse.json({ error: "Enlace expirado" }, { status: 410 })
  }

  const cliente = getCliente(propuesta.idCliente)
  const plantilla = getPlantilla(propuesta.idPlantilla)

  return NextResponse.json({ propuesta, cliente, plantilla })
}

export async function PUT(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const propuesta = getPropuestaPorToken(token)

  if (!propuesta) {
    return NextResponse.json({ error: "Enlace caducado o invalido" }, { status: 404 })
  }

  const data = await request.json()
  const { accion } = data

  if (accion === "aprobar") {
    actualizarPropuesta(propuesta.id, { estatus: "Aprobada" })
    return NextResponse.json({ ok: true, paso: "onboarding" })
  }

  if (accion === "declinar") {
    actualizarPropuesta(propuesta.id, { estatus: "Declinada", tokenUsado: true })
    return NextResponse.json({ ok: true, paso: "declinada" })
  }

  if (accion === "finalizar") {
    actualizarPropuesta(propuesta.id, { tokenUsado: true })
    return NextResponse.json({ ok: true, paso: "completado" })
  }

  return NextResponse.json({ error: "Accion invalida" }, { status: 400 })
}
