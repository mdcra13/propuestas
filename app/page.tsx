"use client"

import Link from "next/link"
import {
  Globe,
  FileText,
  Users,
  Send,
  CheckCircle,
  Shield,
  Server,
  Zap,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Users,
    title: "Gestion de Clientes",
    description:
      "Administra tu cartera de clientes con RUC, datos de contacto, emails de facturacion y mas. Todo centralizado en un solo lugar.",
  },
  {
    icon: FileText,
    title: "Plantillas Dinamicas",
    description:
      "Crea plantillas con secciones personalizables para propuestas y perfiles de empresa. Reutiliza y adapta rapidamente.",
  },
  {
    icon: Send,
    title: "Propuestas Profesionales",
    description:
      "Genera propuestas comerciales a partir de plantillas, personaliza el contenido y envia un enlace unico a tu cliente.",
  },
  {
    icon: CheckCircle,
    title: "Portal del Cliente",
    description:
      "Tus clientes acceden a un portal elegante donde revisan la propuesta, aprueban o declinan, y completan su onboarding.",
  },
  {
    icon: Shield,
    title: "Onboarding Automatizado",
    description:
      "Tras la aprobacion, el cliente completa su Kardex y sube documentos como el Aviso de Operacion directamente desde el portal.",
  },
  {
    icon: Mail,
    title: "Notificaciones SMTP",
    description:
      "Configura tu servidor SMTP para enviar notificaciones automaticas cuando se crean o actualizan propuestas.",
  },
]

const stats = [
  { value: "99.9%", label: "Uptime garantizado" },
  { value: "24/7", label: "Soporte tecnico" },
  { value: "500+", label: "Clientes satisfechos" },
  { value: "10+", label: "Anos de experiencia" },
]

function SrLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="8" fill="hsl(38, 92%, 50%)" />
      <path
        d="M12 8L20 28L28 8"
        stroke="hsl(215, 28%, 17%)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 20L20 32L29 20"
        stroke="hsl(215, 28%, 17%)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <path
        d="M18 12L22 12"
        stroke="hsl(0, 0%, 100%)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[hsl(var(--sidebar-background))]">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Zap className="h-8 w-8 text-primary" strokeWidth={2.5} />
            <div className="flex flex-col">
              <span className="text-base font-extrabold uppercase leading-tight tracking-wide text-[hsl(var(--sidebar-primary-foreground))]">
                Servidores
              </span>
              <span className="text-base font-extrabold uppercase leading-tight tracking-wide text-primary">
                Rapidos
              </span>
            </div>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#inicio"
              className="text-sm font-medium text-[hsl(var(--sidebar-foreground))] transition-colors hover:text-primary"
            >
              Inicio
            </a>
            <a
              href="#funcionalidades"
              className="text-sm font-medium text-[hsl(var(--sidebar-foreground))] transition-colors hover:text-primary"
            >
              Funcionalidades
            </a>
            <a
              href="#empresa"
              className="text-sm font-medium text-[hsl(var(--sidebar-foreground))] transition-colors hover:text-primary"
            >
              Empresa
            </a>
            <a
              href="#contacto"
              className="text-sm font-medium text-[hsl(var(--sidebar-foreground))] transition-colors hover:text-primary"
            >
              Contacto
            </a>
          </nav>
          <Link href="/admin">
            <Button className="font-semibold">
              Entrar al Sistema
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        {/* Orange accent line */}
        <div className="h-1 w-full bg-primary" />
      </header>

      {/* Hero */}
      <section
        id="inicio"
        className="relative overflow-hidden bg-[hsl(var(--sidebar-background))]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(38_92%_50%_/_0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(38_92%_50%_/_0.05),transparent_60%)]" />
        <div className="relative mx-auto max-w-screen-xl px-4 py-24 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent))] px-4 py-1.5 text-sm text-[hsl(var(--sidebar-accent-foreground))]">
              <Server className="h-4 w-4 text-primary" />
              <span>Desarrollado por servidoresrapidos.net</span>
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-[hsl(var(--sidebar-primary-foreground))] sm:text-5xl lg:text-6xl">
              Gestiona propuestas y onboarding de clientes
              <span className="text-primary">
                {" "}
                de forma profesional
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-[hsl(var(--sidebar-foreground))]">
              Gestor Pro es la plataforma integral para crear propuestas
              comerciales, enviarlas a tus clientes y gestionar todo el proceso
              de onboarding desde un portal elegante y seguro.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/admin">
                <Button size="lg" className="gap-2 text-base font-semibold">
                  Comenzar Ahora
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a href="#funcionalidades">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-[hsl(var(--sidebar-border))] bg-transparent text-base text-[hsl(var(--sidebar-foreground))] hover:border-primary hover:bg-primary/10 hover:text-primary"
                >
                  Ver Funcionalidades
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b-4 border-primary bg-[hsl(var(--sidebar-accent))]">
        <div className="mx-auto grid max-w-screen-xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-primary lg:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-[hsl(var(--sidebar-foreground))]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="funcionalidades" className="scroll-mt-20 bg-background">
        <div className="mx-auto max-w-screen-xl px-4 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Todo lo que necesitas para gestionar tu negocio
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              Desde la creacion de propuestas hasta el onboarding completo del
              cliente, Gestor Pro cubre todo el flujo comercial.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group border-border transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About / Empresa */}
      <section
        id="empresa"
        className="scroll-mt-20 bg-[hsl(var(--sidebar-background))]"
      >
        <div className="mx-auto max-w-screen-xl px-4 py-20 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary">
                <Globe className="h-4 w-4" />
                Sobre Nosotros
              </div>
              <h2 className="text-balance text-3xl font-bold tracking-tight text-[hsl(var(--sidebar-primary-foreground))] sm:text-4xl">
                servidoresrapidos.net
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-[hsl(var(--sidebar-foreground))]">
                Somos una empresa dedicada a brindar soluciones tecnologicas
                integrales para negocios en crecimiento. Con mas de una decada
                de experiencia en el mercado, nos especializamos en desarrollo
                de software a la medida, hosting de alto rendimiento y
                consultoria tecnologica.
              </p>
              <p className="mt-4 text-pretty leading-relaxed text-[hsl(var(--sidebar-foreground))]">
                Gestor Pro nace de la necesidad real de nuestros clientes de
                gestionar su proceso comercial de forma eficiente: desde la
                primera propuesta hasta la integracion completa del cliente a
                sus sistemas internos. Nuestra mision es simplificar procesos
                empresariales con herramientas modernas, seguras y faciles de
                usar.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  {
                    icon: Zap,
                    title: "Desarrollo a la Medida",
                    desc: "Soluciones personalizadas para cada negocio",
                  },
                  {
                    icon: Server,
                    title: "Hosting Empresarial",
                    desc: "Infraestructura robusta y escalable",
                  },
                  {
                    icon: Shield,
                    title: "Seguridad Avanzada",
                    desc: "Proteccion de datos y backups automaticos",
                  },
                  {
                    icon: Users,
                    title: "Soporte Dedicado",
                    desc: "Equipo disponible 24/7 para ayudarte",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent))] p-4"
                  >
                    <item.icon className="mb-2 h-6 w-6 text-primary" />
                    <p className="text-sm font-semibold text-[hsl(var(--sidebar-primary-foreground))]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-[hsl(var(--sidebar-foreground))]">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent))] p-8 lg:p-10">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                    <Zap className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[hsl(var(--sidebar-primary-foreground))]">
                      servidoresrapidos.net
                    </p>
                    <p className="text-sm text-[hsl(var(--sidebar-foreground))]">
                      Tecnologia que impulsa tu negocio
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-xl bg-[hsl(var(--sidebar-background))] p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-[hsl(var(--sidebar-foreground))]">
                      Nuestros Servicios
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {[
                        "Desarrollo Web y Aplicaciones",
                        "Hosting y Servidores Dedicados",
                        "Consultoria en TI",
                        "Sistemas de Gestion Empresarial",
                        "Soporte Tecnico y Mantenimiento",
                      ].map((service) => (
                        <li
                          key={service}
                          className="flex items-center gap-2 text-sm text-[hsl(var(--sidebar-accent-foreground))]"
                        >
                          <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href="/admin"
                    className="flex items-center justify-between rounded-xl bg-primary/15 px-4 py-3 transition-colors hover:bg-primary/25"
                  >
                    <span className="text-sm font-semibold text-primary">
                      Acceder a Gestor Pro
                    </span>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contacto" className="scroll-mt-20 bg-background">
        <div className="mx-auto max-w-screen-xl px-4 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Contactanos
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              Estamos listos para ayudarte a optimizar tu proceso comercial.
            </p>
          </div>
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
            {[
              {
                icon: Mail,
                label: "Email",
                value: "info@servidoresrapidos.net",
              },
              {
                icon: Phone,
                label: "Telefono",
                value: "+507 6000-0000",
              },
              {
                icon: MapPin,
                label: "Ubicacion",
                value: "Panama, Panama",
              },
            ].map((contact) => (
              <Card
                key={contact.label}
                className="border-border text-center transition-all hover:border-primary/30 hover:shadow-md"
              >
                <CardContent className="flex flex-col items-center p-6">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <contact.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {contact.label}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {contact.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[hsl(var(--sidebar-background))]">
        <div className="h-1 w-full bg-primary" />
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row lg:px-8">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" strokeWidth={2.5} />
            <span className="text-sm font-bold text-[hsl(var(--sidebar-primary-foreground))]">
              Gestor Pro
            </span>
            <span className="text-xs text-[hsl(var(--sidebar-foreground))]">
              por servidoresrapidos.net
            </span>
          </div>
          <p className="text-center text-xs text-[hsl(var(--sidebar-foreground))]">
            {"2026 servidoresrapidos.net. Todos los derechos reservados."}
          </p>
          <a
            href="https://servidoresrapidos.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[hsl(var(--sidebar-foreground))] transition-colors hover:text-primary"
          >
            servidoresrapidos.net
          </a>
        </div>
      </footer>
    </div>
  )
}
