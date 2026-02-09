import { NextResponse } from "next/server"
import { getPlantillas, getPlantillasActivas, crearPlantilla } from "@/lib/store"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const activas = searchParams.get("activas")
  if (activas === "true") {
    return NextResponse.json(getPlantillasActivas())
  }
  return NextResponse.json(getPlantillas())
}

export async function POST(request: Request) {
  const data = await request.json()
  const plantilla = crearPlantilla(data)
  return NextResponse.json(plantilla, { status: 201 })
}
