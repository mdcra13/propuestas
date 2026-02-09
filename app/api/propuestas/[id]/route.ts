import { NextResponse } from "next/server"
import { getPropuesta, actualizarPropuesta } from "@/lib/store"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const propuesta = getPropuesta(id)
  if (!propuesta) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  return NextResponse.json(propuesta)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await request.json()
  const propuesta = actualizarPropuesta(id, data)
  if (!propuesta) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  return NextResponse.json(propuesta)
}
