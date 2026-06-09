"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/citizen", label: "Ciudadano" },
  { href: "/business", label: "Empresa" },
  { href: "/admin", label: "Administración" },
  { href: "/investors", label: "Inversionistas" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--border)",
        height: 64,
        display: "flex",
        alignItems: "center",
        padding: "0 40px",
        gap: 28,
      }}
    >
      <Link href="/" style={{ fontSize: 17, fontWeight: 700, color: "var(--g)", display: "flex", alignItems: "center", gap: 8, flexShrink: 0, textDecoration: "none" }}>
        <span style={{
          width: 30, height: 30,
          background: "var(--g10)",
          border: "1.5px solid var(--g20)",
          borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2C7 2 4.5 3.2 4 6C3.5 8.6 5.2 11.2 9 14C12.8 11.2 14.5 8.6 14 6C13.5 3.2 11 2 9 2Z" fill="#2A7D52" />
            <path d="M6.5 8.5C7 7 8.5 6.2 10.5 7" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </span>
        EcoNorte
      </Link>

      <div style={{ display: "flex", gap: 2, flex: 1 }}>
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "6px 13px",
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 500,
                color: isActive ? "var(--g)" : "var(--muted)",
                background: isActive ? "var(--g10)" : "transparent",
                textDecoration: "none",
                transition: "all .15s",
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <Link href="/auth" style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          padding: "7px 16px", borderRadius: "var(--r)",
          fontSize: 13, fontWeight: 600, cursor: "pointer",
          background: "transparent", border: "1.5px solid var(--border)",
          color: "var(--text)", textDecoration: "none", transition: "all .15s",
        }}>
          Iniciar Sesión
        </Link>
        <Link href="/citizen" style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          padding: "7px 16px", borderRadius: "var(--r)",
          fontSize: 13, fontWeight: 600,
          background: "var(--g)", color: "#fff",
          textDecoration: "none", transition: "all .15s",
        }}>
          Registrar Depósito
        </Link>
      </div>
    </nav>
  );
}
