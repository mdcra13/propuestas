"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  FileText,
  FilePlus,
  Mail,
  Zap,
  Menu,
  X,
  Settings,
  UserCog,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useRef } from "react"

const navItems = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/propuestas", label: "Propuestas", icon: FilePlus },
]

const configSubItems = [
  { href: "/admin/plantillas", label: "Plantillas", icon: FileText },
  { href: "/admin/smtp", label: "SMTP", icon: Mail },
  { href: "/admin/usuarios", label: "Usuarios", icon: UserCog },
]

export function AdminNavbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [configOpen, setConfigOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isConfigActive = configSubItems.some((item) =>
    pathname.startsWith(item.href),
  )

  function handleConfigEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setConfigOpen(true)
  }

  function handleConfigLeave() {
    timeoutRef.current = setTimeout(() => {
      setConfigOpen(false)
    }, 150)
  }

  return (
    <header className="sticky top-0 z-50 bg-[hsl(var(--sidebar-background))]">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Zap className="h-7 w-7 text-primary" strokeWidth={2.5} />
          <div className="flex flex-col">
            <span className="text-sm font-extrabold uppercase leading-tight tracking-wide text-[hsl(var(--sidebar-primary-foreground))]">
              Servidores
            </span>
            <span className="text-sm font-extrabold uppercase leading-tight tracking-wide text-primary">
              Rapidos
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}

          {/* Configuracion dropdown on hover */}
          <div
            className="relative"
            onMouseEnter={handleConfigEnter}
            onMouseLeave={handleConfigLeave}
          >
            <button
              type="button"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isConfigActive
                  ? "bg-primary text-primary-foreground"
                  : "text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]",
              )}
            >
              <Settings className="h-4 w-4" />
              <span>Configuracion</span>
            </button>

            {configOpen && (
              <div className="absolute left-0 top-full mt-1 w-48 rounded-lg border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-background))] py-1 shadow-lg">
                {configSubItems.map((item) => {
                  const isSubActive = pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setConfigOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition-colors",
                        isSubActive
                          ? "bg-primary/15 text-primary"
                          : "text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] md:hidden"
          aria-label="Abrir menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Orange accent line */}
      <div className="h-1 w-full bg-primary" />

      {mobileOpen && (
        <nav className="border-t border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-background))] px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}

            {/* Mobile: Configuracion section */}
            <div className="mt-2 border-t border-[hsl(var(--sidebar-border))] pt-2">
              <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--sidebar-foreground))]">
                Configuracion
              </p>
              {configSubItems.map((item) => {
                const isSubActive = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isSubActive
                        ? "bg-primary text-primary-foreground"
                        : "text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
