import { NextResponse } from "next/server"
import { getUsuario, actualizarUsuario, eliminarUsuario } from "@/lib/store"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const usuario = getUsuario(id)
  if (!usuario) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
  }
  return NextResponse.json(usuario)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = await request.json()
  const usuario = actualizarUsuario(id, body)
  if (!usuario) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
  }
  return NextResponse.json(usuario)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const deleted = eliminarUsuario(id)
  if (!deleted) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
