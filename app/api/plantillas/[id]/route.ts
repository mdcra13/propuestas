import { NextResponse } from "next/server"
import { getPlantilla, actualizarPlantilla, eliminarPlantilla } from "@/lib/store"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const plantilla = getPlantilla(id)
  if (!plantilla) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  return NextResponse.json(plantilla)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await request.json()
  const plantilla = actualizarPlantilla(id, data)
  if (!plantilla) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  return NextResponse.json(plantilla)
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ok = eliminarPlantilla(id)
  if (!ok) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  return NextResponse.json({ ok: true })
}
