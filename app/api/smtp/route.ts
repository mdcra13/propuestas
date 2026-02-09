import { NextResponse } from "next/server"
import { getConfigSMTP, actualizarConfigSMTP } from "@/lib/store"

export async function GET() {
  return NextResponse.json(getConfigSMTP())
}

export async function PUT(request: Request) {
  const data = await request.json()
  const config = actualizarConfigSMTP(data)
  return NextResponse.json(config)
}
