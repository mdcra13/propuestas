import { NextResponse } from "next/server"
import { getCliente, actualizarCliente, eliminarCliente } from "@/lib/store"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cliente = getCliente(id)
  if (!cliente) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  return NextResponse.json(cliente)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await request.json()
  const cliente = actualizarCliente(id, data)
  if (!cliente) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  return NextResponse.json(cliente)
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ok = eliminarCliente(id)
  if (!ok) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  return NextResponse.json({ ok: true })
}
