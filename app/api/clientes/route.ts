import { NextResponse } from "next/server"
import { getClientes, crearCliente } from "@/lib/store"

export async function GET() {
  return NextResponse.json(getClientes())
}

export async function POST(request: Request) {
  const data = await request.json()
  const cliente = crearCliente(data)
  return NextResponse.json(cliente, { status: 201 })
}
