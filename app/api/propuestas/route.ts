import { NextResponse } from "next/server"
import { getPropuestas, crearPropuesta } from "@/lib/store"

export async function GET() {
  return NextResponse.json(getPropuestas())
}

export async function POST(request: Request) {
  const data = await request.json()
  const propuesta = crearPropuesta(data)
  return NextResponse.json(propuesta, { status: 201 })
}
