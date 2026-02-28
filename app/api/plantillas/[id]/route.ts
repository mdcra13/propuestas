import { NextResponse } from "next/server"
import { getPlantilla } from "@/lib/store"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const plantilla = getPlantilla(id)
  if (!plantilla) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  return NextResponse.json(plantilla)
}
