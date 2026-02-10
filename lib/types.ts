export type TipoContribuyente =
  | "Natural"
  | "Juridico"
  | "Extranjero"
  | "Agente de Retencion - Exento"
  | "Agente de Retencion - Gravado"

export type EstatusCliente = "Activo" | "Inactivo"

export type TipoPlantilla = "Propuesta" | "Perfil Empresa"

export type EstatusPlantilla = "Activa" | "Inactiva"

export type EstatusPropuesta = "Activa" | "Aprobada" | "Declinada"

export type EstatusUsuario = "Activo" | "Inactivo"

export interface Cliente {
  id: string
  nombre: string
  ruc: string
  dv: string
  telefono: string
  emailContacto: string
  contacto: string
  emailFacturacion: string
  pais: string
  tipoContribuyente: TipoContribuyente
  logoUrl: string
  estatus: EstatusCliente
  creadoEn: string
}

export interface Usuario {
  id: string
  nombre: string
  correo: string
  passwordHash: string
  estatus: EstatusUsuario
  creadoEn: string
}

export interface SeccionPlantilla {
  id: string
  titulo: string
  descripcion: string
  orden: number
}

export interface Plantilla {
  id: string
  nombre: string
  tipo: TipoPlantilla
  secciones: SeccionPlantilla[]
  estatus: EstatusPlantilla
  creadaEn: string
}

export interface PropuestaVersion {
  id: string
  version: number
  etiqueta: string
  contenido: Record<string, string>
  creadaEn: string
  nota: string
}

export interface Propuesta {
  id: string
  idCliente: string
  idPlantilla: string
  contenido: Record<string, string>
  estatus: EstatusPropuesta
  hashToken: string
  fechaExpiracionToken: string
  tokenUsado: boolean
  versionActual: number
  versiones: PropuestaVersion[]
  creadaEn: string
}

export interface KardexDocumento {
  id: string
  idPropuesta: string
  ruc: string
  dv: string
  telefono: string
  emailFacturacion: string
  tipoContribuyente: TipoContribuyente
  logoUrl: string
  avisoOperacionUrl: string
  completado: boolean
  creadoEn: string
}

export interface ConfigSMTP {
  host: string
  puerto: string
  usuario: string
  password: string
}
