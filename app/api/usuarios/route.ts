import { NextResponse } from "next/server"
import { getUsuarios, crearUsuario } from "@/lib/store"

export async function GET() {
  return NextResponse.json(getUsuarios())
}

export async function POST(request: Request) {
  const body = await request.json()
  const usuario = crearUsuario(body)
  return NextResponse.json(usuario, { status: 201 })
}
