import { NextResponse } from "next/server"
import { getPlantillas, getPlantillasActivas } from "@/lib/store"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const activas = searchParams.get("activas")
  if (activas === "true") {
    return NextResponse.json(getPlantillasActivas())
  }
  return NextResponse.json(getPlantillas())
}
