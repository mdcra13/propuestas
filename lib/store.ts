import type {
  Cliente,
  Plantilla,
  Propuesta,
  PropuestaVersion,
  KardexDocumento,
  ConfigSMTP,
  Usuario,
} from "./types"

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}

function generateToken(): string {
  return (
    Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2)
  )
}

// Simple hash function for demo purposes
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return "hash_" + Math.abs(hash).toString(36) + "_" + Date.now().toString(36)
}

// In-memory store
let clientes: Cliente[] = [
  {
    id: "demo-1",
    nombre: "Servidores Rapidos S.A.",
    ruc: "155123456",
    dv: "78",
    telefono: "+507 6000-1234",
    emailContacto: "contacto@servidoresrapidos.net",
    contacto: "Juan Perez",
    emailFacturacion: "facturacion@servidoresrapidos.net",
    pais: "Panama",
    tipoContribuyente: "Juridico",
    logoUrl: "",
    estatus: "Activo",
    creadoEn: new Date().toISOString(),
  },
  {
    id: "demo-2",
    nombre: "Tech Solutions Corp",
    ruc: "800234567",
    dv: "12",
    telefono: "+507 6111-5678",
    emailContacto: "info@techsolutions.com",
    contacto: "Maria Lopez",
    emailFacturacion: "billing@techsolutions.com",
    pais: "Panama",
    tipoContribuyente: "Juridico",
    logoUrl: "",
    estatus: "Activo",
    creadoEn: new Date().toISOString(),
  },
]

let plantillas: Plantilla[] = [
  {
    id: "tpl-propuesta",
    nombre: "Propuesta Comercial",
    tipo: "Propuesta",
    secciones: [
      { id: "sp1", titulo: "Quienes Somos", descripcion: "Presentacion de la empresa, trayectoria y valores.", orden: 1 },
      { id: "sp2", titulo: "Proyectos y Clientes", descripcion: "Principales proyectos realizados y clientes atendidos.", orden: 2 },
      { id: "sp3", titulo: "Descripcion General de la Solucion", descripcion: "Resumen ejecutivo de la solucion propuesta al cliente.", orden: 3 },
      { id: "sp4", titulo: "Etapas", descripcion: "Fases del proyecto con descripcion y entregables. Se pueden agregar varias etapas.", orden: 4 },
      { id: "sp5", titulo: "Responsabilidades", descripcion: "Responsabilidades del proveedor y del cliente.", orden: 5 },
      { id: "sp6", titulo: "Costos Asociados a la Solucion", descripcion: "Desglose de costos, precios unitarios y totales.", orden: 6 },
      { id: "sp7", titulo: "Forma de Pago", descripcion: "Condiciones y metodos de pago aceptados.", orden: 7 },
    ],
    estatus: "Activa",
    creadaEn: new Date().toISOString(),
  },
  {
    id: "tpl-perfil",
    nombre: "Perfil de Empresa",
    tipo: "Perfil Empresa",
    secciones: [
      { id: "se1", titulo: "Perfil de la Empresa", descripcion: "Sobre nosotros: historia, mision, vision y valores corporativos.", orden: 1 },
      { id: "se2", titulo: "Principales Clientes", descripcion: "Listado y descripcion de los clientes mas importantes.", orden: 2 },
      { id: "se3", titulo: "Nuestros Aliados", descripcion: "Socios estrategicos y alianzas comerciales.", orden: 3 },
      { id: "se4", titulo: "Principales Productos o Servicios", descripcion: "Catalogo de productos y servicios ofrecidos.", orden: 4 },
    ],
    estatus: "Activa",
    creadaEn: new Date().toISOString(),
  },
]

let propuestas: Propuesta[] = [
  {
    id: "prop-1",
    idCliente: "demo-1",
    idPlantilla: "tpl-propuesta",
    contenido: {
      "Quienes Somos": "Somos una empresa lider en tecnologia con mas de 10 anos de experiencia en el mercado panameno, especializada en soluciones de infraestructura y servicios en la nube.",
      "Proyectos y Clientes": "Hemos trabajado con mas de 50 empresas en Panama, incluyendo instituciones financieras, empresas de retail y organizaciones gubernamentales.",
      "Descripcion General de la Solucion": "Proponemos una solucion integral de hospedaje en la nube con alta disponibilidad, respaldos automaticos y soporte tecnico 24/7.",
      "Etapas": JSON.stringify([
        { nombre: "Fase 1 - Analisis", descripcion: "Levantamiento de requerimientos y analisis de la infraestructura actual.", entregable: "Documento de requerimientos" },
        { nombre: "Fase 2 - Implementacion", descripcion: "Migracion de servidores y configuracion del entorno en la nube.", entregable: "Entorno productivo configurado" },
        { nombre: "Fase 3 - Pruebas y Entrega", descripcion: "Pruebas de rendimiento, seguridad y entrega formal al cliente.", entregable: "Informe de pruebas y acta de entrega" },
      ]),
      "Responsabilidades": "Proveedor: Implementacion, soporte y mantenimiento.\nCliente: Proveer accesos, aprobar entregables y designar contraparte tecnica.",
      "Costos Asociados a la Solucion": "Plan Basico: $99/mes | Plan Profesional: $249/mes | Plan Empresarial: $499/mes. Incluye soporte y respaldos.",
      "Forma de Pago": "50% al inicio del proyecto, 25% en la entrega de la Fase 2 y 25% al cierre. Transferencia bancaria o ACH.",
    },
    estatus: "Activa",
    hashToken: "demo-token-abc123xyz",
    fechaExpiracionToken: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    tokenUsado: false,
    versionActual: 0,
    versiones: [
      {
        id: "ver-0",
        version: 0,
        etiqueta: "v0",
        contenido: {
          "Quienes Somos": "Somos una empresa lider en tecnologia con mas de 10 anos de experiencia en el mercado panameno.",
          "Proyectos y Clientes": "Hemos trabajado con mas de 50 empresas en Panama.",
          "Descripcion General de la Solucion": "Solucion integral de hospedaje en la nube.",
          "Etapas": "[]",
          "Responsabilidades": "Proveedor: Implementacion y soporte. Cliente: Proveer accesos.",
          "Costos Asociados a la Solucion": "Plan Basico: $99/mes",
          "Forma de Pago": "50% al inicio, 50% al cierre.",
        },
        creadaEn: new Date().toISOString(),
        nota: "Version inicial",
      },
    ],
    creadaEn: new Date().toISOString(),
  },
]

let kardexDocumentos: KardexDocumento[] = []

let configSMTP: ConfigSMTP = {
  host: "",
  puerto: "587",
  usuario: "",
  password: "",
}

let usuarios: Usuario[] = [
  {
    id: "usr-1",
    nombre: "Administrador",
    correo: "admin@servidoresrapidos.net",
    passwordHash: simpleHash("admin123"),
    estatus: "Activo",
    creadoEn: new Date().toISOString(),
  },
]

// --- Clientes ---
export function getClientes(): Cliente[] {
  return [...clientes]
}

export function getCliente(id: string): Cliente | undefined {
  return clientes.find((c) => c.id === id)
}

export function crearCliente(data: Omit<Cliente, "id" | "creadoEn">): Cliente {
  const nuevo: Cliente = {
    ...data,
    id: generateId(),
    creadoEn: new Date().toISOString(),
  }
  clientes = [...clientes, nuevo]
  return nuevo
}

export function actualizarCliente(id: string, data: Partial<Cliente>): Cliente | undefined {
  const idx = clientes.findIndex((c) => c.id === id)
  if (idx === -1) return undefined
  clientes[idx] = { ...clientes[idx], ...data }
  clientes = [...clientes]
  return clientes[idx]
}

export function eliminarCliente(id: string): boolean {
  const len = clientes.length
  clientes = clientes.filter((c) => c.id !== id)
  return clientes.length < len
}

// --- Plantillas (static, read-only) ---
export function getPlantillas(): Plantilla[] {
  return [...plantillas]
}

export function getPlantilla(id: string): Plantilla | undefined {
  return plantillas.find((p) => p.id === id)
}

export function getPlantillasActivas(): Plantilla[] {
  return plantillas.filter((p) => p.estatus === "Activa")
}

// --- Propuestas ---
export function getPropuestas(): Propuesta[] {
  return [...propuestas]
}

export function getPropuesta(id: string): Propuesta | undefined {
  return propuestas.find((p) => p.id === id)
}

export function getPropuestaPorToken(token: string): Propuesta | undefined {
  return propuestas.find((p) => p.hashToken === token && !p.tokenUsado)
}

export function crearPropuesta(data: Omit<Propuesta, "id" | "hashToken" | "fechaExpiracionToken" | "tokenUsado" | "versionActual" | "versiones" | "creadaEn">): Propuesta {
  const ahora = new Date().toISOString()
  const versionInicial: PropuestaVersion = {
    id: generateId(),
    version: 0,
    etiqueta: "v0",
    contenido: { ...data.contenido },
    creadaEn: ahora,
    nota: "Version inicial",
  }
  const nueva: Propuesta = {
    ...data,
    id: generateId(),
    hashToken: generateToken(),
    fechaExpiracionToken: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    tokenUsado: false,
    versionActual: 0,
    versiones: [versionInicial],
    creadaEn: ahora,
  }
  propuestas = [...propuestas, nueva]
  return nueva
}

export function crearVersionPropuesta(
  idPropuesta: string,
  contenido: Record<string, string>,
  nota: string,
): Propuesta | undefined {
  const idx = propuestas.findIndex((p) => p.id === idPropuesta)
  if (idx === -1) return undefined

  const propuesta = propuestas[idx]
  const nuevoNumero = propuesta.versiones.length
  const nuevaVersion: PropuestaVersion = {
    id: generateId(),
    version: nuevoNumero,
    etiqueta: `v${nuevoNumero}`,
    contenido: { ...contenido },
    creadaEn: new Date().toISOString(),
    nota,
  }

  propuestas[idx] = {
    ...propuesta,
    contenido: { ...contenido },
    versionActual: nuevoNumero,
    versiones: [...propuesta.versiones, nuevaVersion],
  }
  propuestas = [...propuestas]
  return propuestas[idx]
}

export function restaurarVersionPropuesta(
  idPropuesta: string,
  versionNumber: number,
): Propuesta | undefined {
  const idx = propuestas.findIndex((p) => p.id === idPropuesta)
  if (idx === -1) return undefined

  const propuesta = propuestas[idx]
  const version = propuesta.versiones.find((v) => v.version === versionNumber)
  if (!version) return undefined

  propuestas[idx] = {
    ...propuesta,
    contenido: { ...version.contenido },
    versionActual: versionNumber,
  }
  propuestas = [...propuestas]
  return propuestas[idx]
}

export function actualizarPropuesta(id: string, data: Partial<Propuesta>): Propuesta | undefined {
  const idx = propuestas.findIndex((p) => p.id === id)
  if (idx === -1) return undefined
  propuestas[idx] = { ...propuestas[idx], ...data }
  propuestas = [...propuestas]
  return propuestas[idx]
}

// --- Kardex ---
export function getKardexPorPropuesta(idPropuesta: string): KardexDocumento | undefined {
  return kardexDocumentos.find((k) => k.idPropuesta === idPropuesta)
}

export function crearKardex(data: Omit<KardexDocumento, "id" | "creadoEn">): KardexDocumento {
  const nuevo: KardexDocumento = {
    ...data,
    id: generateId(),
    creadoEn: new Date().toISOString(),
  }
  kardexDocumentos = [...kardexDocumentos, nuevo]
  return nuevo
}

export function actualizarKardex(id: string, data: Partial<KardexDocumento>): KardexDocumento | undefined {
  const idx = kardexDocumentos.findIndex((k) => k.id === id)
  if (idx === -1) return undefined
  kardexDocumentos[idx] = { ...kardexDocumentos[idx], ...data }
  kardexDocumentos = [...kardexDocumentos]
  return kardexDocumentos[idx]
}

// --- SMTP ---
export function getConfigSMTP(): ConfigSMTP {
  return { ...configSMTP }
}

export function actualizarConfigSMTP(data: Partial<ConfigSMTP>): ConfigSMTP {
  configSMTP = { ...configSMTP, ...data }
  return { ...configSMTP }
}

// --- Usuarios ---
export function getUsuarios(): Usuario[] {
  return usuarios.map((u) => ({ ...u }))
}

export function getUsuario(id: string): Usuario | undefined {
  const u = usuarios.find((u) => u.id === id)
  return u ? { ...u } : undefined
}

export function crearUsuario(data: Omit<Usuario, "id" | "creadoEn" | "passwordHash"> & { password: string }): Usuario {
  const nuevo: Usuario = {
    id: generateId(),
    nombre: data.nombre,
    correo: data.correo,
    passwordHash: simpleHash(data.password),
    estatus: data.estatus,
    creadoEn: new Date().toISOString(),
  }
  usuarios = [...usuarios, nuevo]
  return nuevo
}

export function actualizarUsuario(id: string, data: Partial<Omit<Usuario, "passwordHash">> & { password?: string }): Usuario | undefined {
  const idx = usuarios.findIndex((u) => u.id === id)
  if (idx === -1) return undefined
  const { password, ...rest } = data
  usuarios[idx] = {
    ...usuarios[idx],
    ...rest,
    ...(password ? { passwordHash: simpleHash(password) } : {}),
  }
  usuarios = [...usuarios]
  return usuarios[idx]
}

export function eliminarUsuario(id: string): boolean {
  const len = usuarios.length
  usuarios = usuarios.filter((u) => u.id !== id)
  return usuarios.length < len
}
