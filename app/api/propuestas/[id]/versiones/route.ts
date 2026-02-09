import { NextResponse } from "next/server"
import {
  getPropuesta,
  crearVersionPropuesta,
  restaurarVersionPropuesta,
} from "@/lib/store"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const propuesta = getPropuesta(id)
  if (!propuesta) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 })
  }
  return NextResponse.json({
    versiones: propuesta.versiones,
    versionActual: propuesta.versionActual,
  })
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = await req.json()
  const { accion, contenido, nota, version } = body

  if (accion === "crear") {
    const resultado = crearVersionPropuesta(id, contenido, nota || "")
    if (!resultado) {
      return NextResponse.json({ error: "No encontrada" }, { status: 404 })
    }
    return NextResponse.json(resultado)
  }

  if (accion === "restaurar") {
    const resultado = restaurarVersionPropuesta(id, version)
    if (!resultado) {
      return NextResponse.json({ error: "Version no encontrada" }, { status: 404 })
    }
    return NextResponse.json(resultado)
  }

  return NextResponse.json({ error: "Accion no valida" }, { status: 400 })
}
