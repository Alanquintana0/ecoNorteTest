import Link from "next/link";
import { Navbar } from "@/components/navigation/Navbar";
import { AnimatedCounter } from "@/components/landing/AnimatedCounter";

export default function LandingPage() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 40px 64px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 480px",
          gap: 64,
          alignItems: "center",
        }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 12px", borderRadius: 20,
              fontSize: 11, fontWeight: 700, letterSpacing: ".6px", textTransform: "uppercase" as const,
              background: "var(--g10)", color: "var(--g)", border: "1px solid var(--g20)",
              marginBottom: 22,
            }}>
              <span style={{ width: 6, height: 6, background: "var(--g)", borderRadius: "50%" }} />
              Chihuahua, México · Activo 2026
            </div>

            <h1 style={{
              fontSize: 54, fontWeight: 700, lineHeight: 1.08,
              color: "var(--dark)", marginBottom: 22,
            }}>
              <em style={{ fontStyle: "normal", color: "var(--g)" }}>EcoNorte</em>
              <br />Centro de Acopio
              <br />Electrónico
            </h1>

            <p style={{
              fontSize: 17, color: "var(--muted)", marginBottom: 38,
              maxWidth: 500, lineHeight: 1.7,
            }}>
              Recicla tus residuos electrónicos responsablemente. Contribuye a un Chihuahua más verde y gana EcoPuntos con cada depósito.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/citizen" style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "14px 30px", borderRadius: 10,
                fontSize: 16, fontWeight: 600,
                background: "var(--g)", color: "#fff",
                textDecoration: "none",
              }}>
                Soy Ciudadano
              </Link>
              <Link href="/business" style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "14px 30px", borderRadius: 10,
                fontSize: 16, fontWeight: 600,
                background: "var(--b)", color: "#fff",
                textDecoration: "none",
              }}>
                Soy Empresa
              </Link>
            </div>
          </div>

          {/* Hero visual — map placeholder */}
          <div style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            height: 400,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 7px, var(--border) 7px, var(--border) 8px)",
              opacity: 0.3,
            }} />
            <div style={{
              position: "relative", textAlign: "center",
              background: "rgba(255,255,255,0.88)",
              border: "1px solid var(--border)",
              borderRadius: 8, padding: "12px 20px",
              fontSize: 11, fontFamily: "monospace", color: "var(--muted)",
            }}>
              [ mapa interactivo de<br />puntos de acopio ]
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <section style={{ background: "var(--dark)", padding: "48px 40px" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 32,
        }}>
          <AnimatedCounter value={847} suffix=".2 t" label="Toneladas Recicladas" />
          <AnimatedCounter value={12} label="Puntos de Recolección" />
          <AnimatedCounter value={138} label="Empresas Participantes" />
          <AnimatedCounter value={94} suffix="%" label="Tasa de Cumplimiento" />
        </div>
      </section>

      {/* MISSION */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 40px" }}>
        <SectionHeader eyebrow="Nuestra Misión" title="Economía Circular para Chihuahua">
          Gestionamos residuos electrónicos con responsabilidad ambiental, social y económica para construir un futuro sostenible.
        </SectionHeader>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          <Card iconBg="var(--g10)" icon={<IconRecycle color="#2A7D52" />} title="Recolección Responsable">
            Red de 12 puntos estratégicos en toda la ciudad para depositar residuos electrónicos de forma segura y trazable.
          </Card>
          <Card iconBg="var(--b10)" icon={<IconLock color="#1A5F7A" />} title="Destrucción Certificada">
            Destrucción segura de datos conforme a NIST SP 800-88. Certificado oficial para empresas que requieren cumplimiento normativo.
          </Card>
          <Card iconBg="var(--g10)" icon={<IconShield color="#2A7D52" />} title="Impacto Verificado">
            Evitamos contaminación de suelos y acuíferos. Cada kilogramo reciclado queda documentado con métricas de impacto ambiental.
          </Card>
        </div>
      </section>

      {/* PROCESS */}
      <div style={{ background: "var(--bg)" }}>
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 40px" }}>
          <SectionHeader eyebrow="Proceso" title="¿Cómo Funciona?" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)" }}>
            {processSteps.map((step, i) => (
              <ProcessStep key={step.n} {...step} isFirst={i === 0} isLast={i === processSteps.length - 1} />
            ))}
          </div>
        </section>
      </div>

      {/* BENEFITS */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 40px" }}>
        <SectionHeader eyebrow="Beneficios" title="¿Por qué elegir EcoNorte?" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          <Card iconBg="var(--g10)" icon={<IconUsers color="#2A7D52" />} title="Para Ciudadanos">
            Gana EcoPuntos, obtén comprobantes digitales y contribuye directamente a un Chihuahua más verde con cada dispositivo que recicles.
          </Card>
          <Card iconBg="var(--b10)" icon={<IconBriefcase color="#1A5F7A" />} title="Para Empresas">
            Certificados de disposición y destrucción segura de datos para cumplimiento normativo. Reportes de sustentabilidad en PDF.
          </Card>
          <Card iconBg="var(--g10)" icon={<IconBarChart color="#2A7D52" />} title="Transparencia Total">
            Dashboard de impacto en tiempo real con métricas verificables de reciclaje, minería urbana y reducción de CO₂.
          </Card>
        </div>
      </section>

      {/* CTA BAND */}
      <section style={{
        background: "linear-gradient(135deg, var(--g) 0%, #1A5038 100%)",
        padding: "64px 40px", textAlign: "center",
      }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: "#fff", marginBottom: 14 }}>
          Empieza a Reciclar Hoy
        </h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.72)", margin: "0 auto 32px", maxWidth: 480 }}>
          Únete a los más de 12,000 ciudadanos y 138 empresas que ya contribuyen al futuro de Chihuahua.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/citizen" style={{
            display: "inline-flex", alignItems: "center",
            padding: "14px 30px", borderRadius: 10,
            fontSize: 16, fontWeight: 600,
            background: "#fff", color: "var(--g)",
            textDecoration: "none",
          }}>
            Ver Puntos de Acopio
          </Link>
          <Link href="/business" style={{
            display: "inline-flex", alignItems: "center",
            padding: "14px 30px", borderRadius: 10,
            fontSize: 16, fontWeight: 600,
            background: "transparent", border: "1.5px solid rgba(255,255,255,0.4)",
            color: "#fff",
            textDecoration: "none",
          }}>
            Portal Empresarial
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: "var(--dark)",
        color: "rgba(255,255,255,0.4)",
        padding: "28px 40px",
        textAlign: "center",
        fontSize: 13,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
          <strong style={{ color: "rgba(255,255,255,0.75)" }}>EcoNorte</strong>
          <span>Centro de Acopio de Residuos Electrónicos · Chihuahua, México · 2026</span>
          <span>
            <Link href="/citizen" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Ciudadano</Link>
            {" · "}
            <Link href="/business" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Empresa</Link>
            {" · "}
            <Link href="/admin" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Admin</Link>
            {" · "}
            <Link href="/investors" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Inversionistas</Link>
          </span>
        </div>
      </footer>
    </>
  );
}

// ─── Data ───────────────────────────────────────────────────────────────────────

const processSteps = [
  { n: "1", title: "Deposita", desc: "Lleva tu dispositivo al punto de acopio más cercano" },
  { n: "2", title: "Registra", desc: "Usa la app para registrar el dispositivo y subir evidencia" },
  { n: "3", title: "Gana Puntos", desc: "Acumula EcoPuntos automáticamente por cada depósito" },
  { n: "4", title: "Reciclaje", desc: "Procesamos y clasificamos los materiales recuperados" },
  { n: "5", title: "Certificado", desc: "Recibe tu comprobante digital o certificado empresarial" },
];

// ─── Sub-components ─────────────────────────────────────────────────────────────

function SectionHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div style={{ textAlign: "center", marginBottom: 56 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" as const, color: "var(--g)", marginBottom: 12 }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 36, fontWeight: 700, color: "var(--dark)", marginBottom: children ? 14 : 0 }}>{title}</h2>
      {children && (
        <p style={{ fontSize: 16, color: "var(--muted)", maxWidth: 540, margin: "0 auto", lineHeight: 1.65 }}>
          {children}
        </p>
      )}
    </div>
  );
}

function Card({
  icon,
  iconBg,
  title,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      background: "var(--white)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      padding: "28px 24px",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 16,
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--dark)", marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65 }}>{children}</p>
    </div>
  );
}

function ProcessStep({
  n, title, desc, isFirst, isLast,
}: {
  n: string; title: string; desc: string; isFirst: boolean; isLast: boolean;
}) {
  return (
    <div style={{ textAlign: "center", padding: "0 12px", position: "relative" }}>
      {/* left connector */}
      {!isFirst && (
        <div style={{
          position: "absolute", left: 0, top: 22,
          width: "calc(50% - 22px)", height: 2, background: "var(--border)",
        }} />
      )}
      {/* right connector */}
      {!isLast && (
        <div style={{
          position: "absolute", right: 0, top: 22,
          width: "calc(50% - 22px)", height: 2, background: "var(--border)",
        }} />
      )}
      <div style={{
        position: "relative", zIndex: 1,
        width: 44, height: 44, borderRadius: "50%",
        background: "var(--g)", color: "#fff",
        fontWeight: 700, fontSize: 16,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 14px",
      }}>
        {n}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--dark)", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{desc}</div>
    </div>
  );
}

// ─── SVG Icons ──────────────────────────────────────────────────────────────────

function IconRecycle({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
  );
}

function IconLock({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function IconShield({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconUsers({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function IconBriefcase({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
    </svg>
  );
}

function IconBarChart({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
