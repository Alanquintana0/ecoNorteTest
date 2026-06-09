'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const sections = [
  { id: 's01', num: '01', label: 'Propuesta de Valor' },
  { id: 's02', num: '02', label: 'Métricas Clave' },
  { id: 's03', num: '03', label: 'Misión y Visión' },
  { id: 's04', num: '04', label: 'Economía Circular' },
  { id: 's05', num: '05', label: 'Impacto Ambiental' },
  { id: 's06', num: '06', label: 'Impacto Social' },
  { id: 's07', num: '07', label: 'Guía de Disposición' },
  { id: 's08', num: '08', label: 'Marco Regulatorio' },
  { id: 's09', num: '09', label: 'Proceso Industrial' },
  { id: 's10', num: '10', label: 'EcoPuntos' },
  { id: 's11', num: '11', label: 'Certificados' },
  { id: 's12', num: '12', label: 'Mapa de Valor' },
  { id: 's13', num: '13', label: 'Perfiles de Clientes' },
  { id: 's14', num: '14', label: 'Modelos de Servicio' },
  { id: 's15', num: '15', label: 'Modelo Freemium' },
  { id: 's16', num: '16', label: 'Organización' },
  { id: 's17', num: '17', label: 'Análisis Financiero' },
  { id: 's18', num: '18', label: 'Compromisos ESG' },
];

const envData = [1240, 860, 420, 310, 185, 95];
const envLabels = ['Cobre', 'Aluminio', 'Plástico', 'Baterías', 'Vidrio', 'PCB'];

export default function InvestorsPage() {
  const [activeSection, setActiveSection] = useState('s01');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.round((scrollY / total) * 100) : 0);

      let current = 's01';
      sections.forEach(sec => {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.getBoundingClientRect().top + scrollY;
          if (scrollY + 200 >= top) current = sec.id;
        }
      });
      setActiveSection(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const sec: React.CSSProperties = { maxWidth: 780, marginBottom: 72, paddingTop: 24 };
  const h2s: React.CSSProperties = { fontSize: 28, fontWeight: 700, color: 'var(--dark)', marginBottom: 8 };
  const eyebrow: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--g)', marginBottom: 8 };
  const card: React.CSSProperties = { background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: '22px 20px' };
  const grid3: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginTop: 24 };
  const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 };
  const metaVal: React.CSSProperties = { fontSize: 32, fontWeight: 700, color: 'var(--dark)', lineHeight: 1 };
  const metaLbl: React.CSSProperties = { fontSize: 12, color: 'var(--muted)', marginTop: 4 };
  const metaTrend: React.CSSProperties = { fontSize: 11, color: 'var(--g)', fontWeight: 600, marginTop: 4 };
  const envMax = Math.max(...envData);

  return (
    <div style={{ display: 'flex', background: 'var(--bg)', minHeight: '100vh' }}>
      {/* SIDEBAR */}
      <nav style={{
        width: 240, flexShrink: 0, position: 'sticky', top: 0,
        height: '100vh', overflowY: 'auto', background: 'var(--dark)',
        display: 'flex', flexDirection: 'column', paddingBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 18px 16px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{ width: 32, height: 32, background: '#2A3A30', border: '1.5px solid #3A5A46', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5DBF8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>EcoNorte</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>Portal Inversionistas</div>
          </div>
        </div>

        <div style={{ padding: '12px 16px 10px' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', marginBottom: 5 }}>Progreso de lectura</div>
          <div style={{ height: 3, background: 'rgba(255,255,255,.1)', borderRadius: 2 }}>
            <div style={{ height: '100%', background: 'var(--g)', borderRadius: 2, width: `${progress}%`, transition: 'width .3s' }} />
          </div>
        </div>

        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.25)', letterSpacing: 1, textTransform: 'uppercase', padding: '8px 16px 4px' }}>Secciones</div>

        {sections.map(s => (
          <button key={s.id} onClick={() => scrollTo(s.id)} style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '8px 16px', fontSize: 12, fontWeight: 500,
            color: activeSection === s.id ? '#5DBF8A' : 'rgba(255,255,255,.5)',
            cursor: 'pointer', border: 'none', background: activeSection === s.id ? 'rgba(42,125,82,.15)' : 'transparent',
            borderLeft: `2px solid ${activeSection === s.id ? 'var(--g)' : 'transparent'}`,
            width: '100%', fontFamily: 'inherit', textAlign: 'left', transition: 'all .15s',
          }}>
            <span style={{ fontSize: 10, opacity: 0.5, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{s.num}</span>
            {s.label}
          </button>
        ))}

        <div style={{ marginTop: 'auto', padding: '16px 12px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Link href="/admin" style={{ padding: '8px 12px', borderRadius: 7, fontSize: 12, color: 'rgba(255,255,255,.4)', textDecoration: 'none', display: 'block' }}>Panel Administración</Link>
          <Link href="/" style={{ padding: '8px 12px', borderRadius: 7, fontSize: 12, color: 'rgba(255,255,255,.4)', textDecoration: 'none', display: 'block' }}>← Inicio EcoNorte</Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: '48px 56px', overflowY: 'auto' }}>

        {/* S01 HERO */}
        <div id="s01" data-section style={sec}>
          <div style={eyebrow}>Propuesta de Valor</div>
          <h1 style={{ fontSize: 40, fontWeight: 700, color: 'var(--dark)', lineHeight: 1.1, marginBottom: 16 }}>
            Transformando Chihuahua en un Referente de{' '}
            <em style={{ fontStyle: 'normal', color: 'var(--g)' }}>Economía Circular</em>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 640, marginBottom: 28 }}>
            EcoNorte es la plataforma líder de gestión de residuos electrónicos en Chihuahua, México. Conectamos ciudadanos, empresas y operadores con una solución trazable, certificada y rentable.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['Rentabilidad comprobada', 'NOM-161-SEMARNAT', 'Destrucción NIST SP 800-88', '12 puntos de acopio'].map(p => (
              <span key={p} style={{ padding: '6px 14px', borderRadius: 20, background: 'var(--g10)', color: 'var(--g)', fontSize: 12, fontWeight: 600, border: '1px solid var(--g20)' }}>{p}</span>
            ))}
          </div>
        </div>

        {/* S02 MÉTRICAS */}
        <div id="s02" data-section style={sec}>
          <div style={eyebrow}>Tracción</div>
          <h2 style={h2s}>Métricas Clave</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginTop: 24 }}>
            {[
              { val: '847 t', lbl: 'Toneladas recicladas', trend: '↑ 34% vs 2025' },
              { val: '138', lbl: 'Empresas participantes', trend: '↑ 22% vs 2025' },
              { val: '12,400', lbl: 'Ciudadanos activos', trend: '↑ 41% vs 2025' },
              { val: '94%', lbl: 'Tasa de cumplimiento normativo', trend: 'NOM-161 compliant' },
              { val: '$4.2M', lbl: 'Ingresos anuales 2026E', trend: '↑ 26% vs 2025' },
              { val: '32%', lbl: 'Margen EBITDA 2026E', trend: '↑ 5pp vs 2025' },
            ].map(m => (
              <div key={m.lbl} style={card}>
                <div style={metaVal}>{m.val}</div>
                <div style={metaLbl}>{m.lbl}</div>
                <div style={metaTrend}>{m.trend}</div>
              </div>
            ))}
          </div>
        </div>

        {/* S03 MISIÓN */}
        <div id="s03" data-section style={sec}>
          <div style={eyebrow}>Fundamentos</div>
          <h2 style={h2s}>Misión y Visión</h2>
          <div style={grid2}>
            <div style={card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--g)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: .5 }}>Misión</div>
              <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7 }}>Gestionar residuos electrónicos con responsabilidad ambiental, social y económica, construyendo infraestructura circular trazable para Chihuahua y el norte de México.</p>
            </div>
            <div style={card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--b)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: .5 }}>Visión</div>
              <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7 }}>Ser la plataforma de referencia en economía circular para residuos electrónicos en México para 2030, con presencia en 5 estados y procesamiento de 5,000 toneladas anuales.</p>
            </div>
          </div>
        </div>

        {/* S04 ECONOMÍA CIRCULAR */}
        <div id="s04" data-section style={sec}>
          <div style={eyebrow}>Modelo</div>
          <h2 style={h2s}>Impacto en Economía Circular</h2>
          <div style={grid3}>
            {[
              { t: 'Recuperación', d: 'Recolección de RAEE en 12 puntos estratégicos, con operación B2C ciudadana y B2B empresarial integradas.', c: 'var(--g)' },
              { t: 'Transformación', d: 'Clasificación, desmantelamiento y procesamiento industrial de materiales: cobre, aluminio, plásticos, tierras raras.', c: 'var(--b)' },
              { t: 'Trazabilidad', d: 'Certificación digital de cada flujo. Comprobantes para ciudadanos, certificados de destrucción NIST para empresas.', c: 'var(--g)' },
            ].map(c => (
              <div key={c.t} style={{ ...card, borderTop: `3px solid ${c.c}` }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>{c.t}</h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65 }}>{c.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* S05 IMPACTO AMBIENTAL */}
        <div id="s05" data-section style={sec}>
          <div style={eyebrow}>Sostenibilidad</div>
          <h2 style={h2s}>Impacto Ambiental</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24, alignItems: 'start' }}>
            <div>
              {[
                { n: '2,541 ton', l: 'CO₂eq evitado acumulado' },
                { n: '12.4 M L', l: 'Agua no contaminada' },
                { n: '1,240 kg', l: 'Cobre recuperado (2026)' },
              ].map(s => (
                <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--g)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--dark)' }}>{s.n}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.l}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--g10)', borderRadius: 8, border: '1px solid var(--g20)', fontSize: 12, color: 'var(--g)', fontWeight: 600 }}>
                Certificado ISO 14001 · Auditoría SEMARNAT 2025
              </div>
            </div>
            <div style={card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)', marginBottom: 4 }}>Materiales recuperados (kg)</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 16 }}>Inventario actual en almacén</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 100 }}>
                {envData.map((v, i) => {
                  const h = Math.round((v / envMax) * 80);
                  return (
                    <div key={envLabels[i]} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                      <div style={{ fontSize: 9, color: 'var(--dark)', fontWeight: 600 }}>{v > 100 ? `${Math.round(v / 100) / 10}t` : `${v}kg`}</div>
                      <div style={{ height: h, background: 'var(--g)', borderRadius: '3px 3px 0 0', width: '100%', opacity: 0.5 + i * 0.08 }} />
                      <div style={{ fontSize: 9, color: 'var(--muted)', textAlign: 'center' }}>{envLabels[i]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* S06 IMPACTO SOCIAL */}
        <div id="s06" data-section style={sec}>
          <div style={eyebrow}>Comunidad</div>
          <h2 style={h2s}>Impacto Social</h2>
          <div style={grid3}>
            {[
              { n: '42', l: 'empleos directos', d: 'Técnicos, conductores, operadores y personal administrativo.' },
              { n: '120+', l: 'empleos indirectos', d: 'Transportistas, proveedores de servicios y colaboradores externos.' },
              { n: '8', l: 'colonias beneficiadas', d: 'Puntos de acopio en zonas estratégicas con alta densidad poblacional.' },
            ].map(s => (
              <div key={s.l} style={card}>
                <div style={{ fontSize: 34, fontWeight: 700, color: 'var(--g)', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dark)', marginTop: 2 }}>{s.l}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8, lineHeight: 1.6 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* S07 GUÍA DE DISPOSICIÓN */}
        <div id="s07" data-section style={sec}>
          <div style={eyebrow}>Operaciones</div>
          <h2 style={h2s}>Guía de Disposición</h2>
          <div style={{ ...card, marginTop: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  {['Categoría', 'Ejemplos', 'Tipo de contenedor', 'Restricciones'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .4 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Cómputo', 'Laptops, PCs, servidores', 'Gran Volumen / Quick Box', '—'],
                  ['Telefonía', 'Celulares, tablets, teléfonos', 'Quick Box', 'Sin batería hinchada'],
                  ['Electrodomésticos', 'TV, monitores, impresoras', 'Gran Volumen', 'Max 25 kg/pieza'],
                  ['Baterías', 'Li-ion, NiMH, plomo-ácido', 'Contenedor especial', 'Separadas del dispositivo'],
                  ['Cables y periféricos', 'Cables, cargadores, routers', 'Quick Box', '—'],
                  ['Grandes equipos', 'UPS, equipos médicos', 'Cita previa', 'Requiere programación'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: '10px 12px', color: j === 0 ? 'var(--dark)' : 'var(--muted)', fontWeight: j === 0 ? 600 : 400 }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* S08 MARCO REGULATORIO */}
        <div id="s08" data-section style={sec}>
          <div style={eyebrow}>Cumplimiento</div>
          <h2 style={h2s}>Marco Regulatorio</h2>
          <div style={grid3}>
            {[
              { t: 'NOM-161-SEMARNAT-2011', d: 'Norma oficial para manejo integral de residuos de manejo especial.', c: 'var(--g)' },
              { t: 'NIST SP 800-88', d: 'Estándar internacional para destrucción segura de datos en dispositivos electrónicos.', c: 'var(--b)' },
              { t: 'ISO 14001:2015', d: 'Sistema de gestión ambiental certificado. Auditoría anual por tercero independiente.', c: 'var(--g)' },
            ].map(r => (
              <div key={r.t} style={{ ...card, borderLeft: `3px solid ${r.c}` }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>{r.t}</h3>
                <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.65 }}>{r.d}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: '16px 20px', background: 'var(--g10)', borderRadius: 10, border: '1px solid var(--g20)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--g)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)' }}>Autorización SEMARNAT vigente</div>
              <div style={{ fontSize: 12, color: 'var(--g)' }}>Número de autorización: SEMARNAT-CHI-2024-0047 · Válida hasta diciembre 2027</div>
            </div>
          </div>
        </div>

        {/* S09 PROCESO INDUSTRIAL */}
        <div id="s09" data-section style={sec}>
          <div style={eyebrow}>Operación</div>
          <h2 style={h2s}>Proceso Industrial</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 24 }}>
            {[
              { n: '01', t: 'Recepción y Registro', d: 'Verificación de materiales entrantes. Pesaje, clasificación inicial y asignación de folio de trazabilidad.' },
              { n: '02', t: 'Diagnóstico y Clasificación', d: 'Evaluación técnica de cada unidad. Separación por categoría: reuso, remanufactura, reciclaje, disposición final.' },
              { n: '03', t: 'Destrucción Certificada', d: 'Borrado seguro de datos conforme a NIST SP 800-88. Destrucción física para unidades sin posibilidad de reuso.' },
              { n: '04', t: 'Desmantelamiento', d: 'Separación manual y mecánica de componentes. Recuperación de metales preciosos, cobre, aluminio y plásticos.' },
              { n: '05', t: 'Certificación y Despacho', d: 'Emisión de certificados digitales. Envío de materiales a fundidoras y procesadores certificados.' },
            ].map((step, i) => (
              <div key={step.n} style={{ display: 'flex', gap: 20, paddingBottom: i < 4 ? 24 : 0, position: 'relative' }}>
                {i < 4 && <div style={{ position: 'absolute', left: 20, top: 44, width: 2, height: 'calc(100% - 20px)', background: 'var(--border)' }} />}
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--g)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0, zIndex: 1 }}>{step.n}</div>
                <div style={{ paddingTop: 8 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark)', marginBottom: 4 }}>{step.t}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65 }}>{step.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* S10 ECOPUNTOS */}
        <div id="s10" data-section style={sec}>
          <div style={eyebrow}>Fidelización</div>
          <h2 style={h2s}>Programa EcoPuntos</h2>
          <div style={grid3}>
            {[
              { nivel: 'Verde', pts: '200+', c: '#2A7D52', bg: '#EBF5EF', desc: 'Acceso a historial digital y comprobantes de depósito.' },
              { nivel: 'Azul', pts: '500+', c: '#1A5F7A', bg: '#E5F0F7', desc: 'Descuento predial 2%, vale de transporte mensual.' },
              { nivel: 'Platino', pts: '1,000+', c: '#8B6914', bg: '#FFF3DC', desc: 'Certificado ambiental, prioridad en recolección domiciliaria.' },
            ].map(n => (
              <div key={n.nivel} style={{ ...card, borderTop: `3px solid ${n.c}` }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: n.bg, fontSize: 12, fontWeight: 700, color: n.c, marginBottom: 12 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: n.c }} />
                  Nivel {n.nivel}
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--dark)', marginBottom: 4 }}>{n.pts} pts</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.65 }}>{n.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* S11 CERTIFICADOS */}
        <div id="s11" data-section style={sec}>
          <div style={eyebrow}>Diferenciador</div>
          <h2 style={h2s}>Certificados Empresariales</h2>
          <div style={grid2}>
            {[
              { t: 'Certificado de Disposición de RAEE', d: 'Documento oficial de disposición responsable de residuos electrónicos. Válido para reportes de sustentabilidad y cumplimiento ambiental.', c: 'var(--g)' },
              { t: 'Certificado de Destrucción Segura', d: 'Destrucción conforme a NIST SP 800-88. Ideal para empresas con requisitos de seguridad de datos, cumplimiento LFPDPPP y estándares internacionales.', c: 'var(--b)' },
            ].map(cert => (
              <div key={cert.t} style={{ ...card, borderLeft: `4px solid ${cert.c}` }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark)', marginBottom: 10 }}>{cert.t}</h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65 }}>{cert.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* S12 MAPA DE VALOR */}
        <div id="s12" data-section style={sec}>
          <div style={eyebrow}>Estrategia</div>
          <h2 style={h2s}>Mapa de Valor</h2>
          <div style={{ ...card, marginTop: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  {['Segmento', 'Propuesta de Valor', 'Canal', 'Ingresos'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .4 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['B2C Ciudadanos', 'Reciclaje fácil + EcoPuntos', 'App / Puntos de acopio', 'EcoPuntos, suscripción'],
                  ['B2B Empresas', 'Certificados + destrucción segura', 'Portal empresarial', 'Servicios B2B, certificados'],
                  ['Sector Público', 'Cumplimiento normativo', 'Convenios', 'Contratos municipales'],
                  ['Fundidoras', 'Materiales clasificados', 'Venta directa', 'Venta de commodities'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: '10px 14px', color: j === 0 ? 'var(--dark)' : 'var(--muted)', fontWeight: j === 0 ? 600 : 400 }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* S13 PERFILES */}
        <div id="s13" data-section style={sec}>
          <div style={eyebrow}>Mercado</div>
          <h2 style={h2s}>Perfiles de Clientes</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, marginTop: 24 }}>
            {[
              { t: 'Ciudadano consciente', d: 'Adulto 25-45 años, preocupado por el ambiente. Acumula EcoPuntos para canjear beneficios municipales.', seg: 'B2C · 12,400 usuarios activos' },
              { t: 'PyME en crecimiento', d: 'Empresa de 20-200 empleados que renueva equipo regularmente. Busca certificados para ESG y cumplimiento fiscal.', seg: 'B2B · 96 empresas activas' },
              { t: 'Corporativo industrial', d: 'Empresa manufacturera o maquiladora. Grandes volúmenes, requerimientos de destrucción de datos certificada.', seg: 'B2B Premium · 42 clientes' },
              { t: 'Gobierno municipal', d: 'Dependencias que renuevan equipos cada 3-5 años. Convenios de disposición responsable con trazabilidad total.', seg: 'Sector Público · 3 convenios' },
            ].map(p => (
              <div key={p.t} style={card}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--g)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 8 }}>{p.seg}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>{p.t}</h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65 }}>{p.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* S14 MODELOS DE SERVICIO */}
        <div id="s14" data-section style={sec}>
          <div style={eyebrow}>Portafolio</div>
          <h2 style={h2s}>Modelos de Servicio</h2>
          <div style={grid3}>
            {[
              { t: 'B2C Gratuito', price: 'Gratis', d: 'Depósito en punto de acopio, EcoPuntos y comprobante digital. Sin costo para ciudadanos.', c: 'var(--g)' },
              { t: 'B2C Premium', price: '$299/mes', d: 'Incluye recolección domiciliaria y certificado de disposición para uso personal o pequeño negocio.', c: 'var(--b)' },
              { t: 'B2B Pro', price: '$799/mes', d: 'Servicio completo: destrucción NIST, dashboard ESG, reporte mensual PDF, SLA 24h.', c: 'var(--g)' },
            ].map(m => (
              <div key={m.t} style={{ ...card, borderTop: `3px solid ${m.c}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: m.c, marginBottom: 4 }}>{m.t}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--dark)', marginBottom: 10 }}>{m.price}</div>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65 }}>{m.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* S15 FREEMIUM */}
        <div id="s15" data-section style={sec}>
          <div style={eyebrow}>Comparativa</div>
          <h2 style={h2s}>Modelo Freemium</h2>
          <div style={{ ...card, marginTop: 24, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Característica</th>
                  {['Gratuito', 'Básico ($299/mes)', 'Pro ($799/mes)'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Depósito en punto de acopio', true, true, true],
                  ['EcoPuntos y historial', true, true, true],
                  ['Recolección domiciliaria', false, true, true],
                  ['Certificado de disposición', false, true, true],
                  ['Certificado destrucción NIST', false, false, true],
                  ['Dashboard de sustentabilidad', false, false, true],
                  ['Reporte ESG mensual PDF', false, false, true],
                  ['SLA 24h respuesta', false, false, true],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 16px', color: 'var(--text)' }}>{row[0]}</td>
                    {[1, 2, 3].map(j => (
                      <td key={j} style={{ padding: '10px 16px', textAlign: 'center', fontSize: 15, fontWeight: 600, color: row[j] ? 'var(--g)' : 'var(--border)' }}>
                        {row[j] ? '✓' : '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* S16 ORG CHART */}
        <div id="s16" data-section style={sec}>
          <div style={eyebrow}>Estructura</div>
          <h2 style={h2s}>Estructura Organizacional</h2>
          <div style={{ marginTop: 24 }}>
            {[
              { lbl: 'Dirección General', nodes: [{ t: 'Director General', type: 'ceo' }] },
              { lbl: 'Gerencias', nodes: ['Gerente Operativo', 'Gerente Comercial', 'Gerente de TI', 'Gerente Ambiental'].map(t => ({ t, type: 'mgr' })) },
              { lbl: 'Operaciones (42 personas)', nodes: ['Técnicos Reciclaje (12)', 'Conductores (8)', 'Atención Puntos (10)', 'Adm. y Ventas (8)', 'TI y Plataforma (4)'].map(t => ({ t, type: 'ops' })) },
            ].map(level => (
              <div key={level.lbl} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 10 }}>{level.lbl}</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {level.nodes.map(n => (
                    <div key={n.t} style={{
                      padding: '10px 16px', borderRadius: 9,
                      border: `1.5px solid ${n.type === 'ceo' ? 'var(--dark)' : n.type === 'mgr' ? 'var(--g20)' : 'var(--border)'}`,
                      background: n.type === 'ceo' ? 'var(--dark)' : n.type === 'mgr' ? 'var(--g10)' : 'var(--bg)',
                      fontSize: 13, fontWeight: 600,
                      color: n.type === 'ceo' ? '#fff' : n.type === 'mgr' ? 'var(--g)' : 'var(--text)',
                    }}>{n.t}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* S17 FINANCIERO */}
        <div id="s17" data-section style={sec}>
          <div style={eyebrow}>Finanzas</div>
          <h2 style={h2s}>Análisis Financiero</h2>
          <div style={{ ...card, marginTop: 24, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Concepto</th>
                  {['2024 (Real)', '2025 (Real)', '2026 E', '2027 Proy.', '2028 Proy.'].map(h => (
                    <th key={h} style={{ padding: '12px 14px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Ingresos B2C', vals: ['$480K', '$820K', '$1.1M', '$1.6M', '$2.4M'], total: false },
                  { label: 'Ingresos B2B', vals: ['$1.2M', '$2.1M', '$3.1M', '$4.8M', '$7.2M'], total: false },
                  { label: 'Venta Materiales', vals: ['$280K', '$420K', '$640K', '$960K', '$1.4M'], total: false },
                  { label: 'TOTAL INGRESOS', vals: ['$1.96M', '$3.34M', '$4.84M', '$7.36M', '$11.0M'], total: true },
                  { label: 'Costos Operativos', vals: ['$1.4M', '$2.1M', '$3.0M', '$4.5M', '$6.5M'], total: false },
                  { label: 'EBITDA', vals: ['$560K', '$1.24M', '$1.84M', '$2.86M', '$4.5M'], total: true },
                  { label: 'Margen EBITDA', vals: ['28%', '37%', '38%', '39%', '41%'], total: false, green: true },
                ].map(row => (
                  <tr key={row.label} style={{ borderBottom: '1px solid var(--border)', background: row.total ? 'var(--bg)' : 'transparent' }}>
                    <td style={{ padding: '10px 16px', fontWeight: row.total || row.green ? 700 : 400, color: row.green ? 'var(--g)' : row.total ? 'var(--dark)' : 'var(--text)' }}>{row.label}</td>
                    {row.vals.map((v, i) => (
                      <td key={i} style={{ padding: '10px 14px', textAlign: 'right', fontWeight: row.total || row.green ? 700 : 400, color: row.green ? 'var(--g)' : row.total ? 'var(--dark)' : 'var(--muted)' }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--b10)', borderRadius: 8, border: '1px solid #C5DCE8', fontSize: 12, color: 'var(--b)' }}>
            Semilla: $2.4M USD levantada en 2024. Búsqueda de Serie A: $8M USD en Q3 2026 para expansión a 3 estados.
          </div>
        </div>

        {/* S18 ESG */}
        <div id="s18" data-section style={sec}>
          <div style={eyebrow}>Compromiso</div>
          <h2 style={h2s}>Compromisos ESG</h2>
          <div style={grid2}>
            {[
              { t: 'Medioambiental', items: ['Cero residuos a tiradero ilegal', 'Huella de carbono carbono-neutro 2028', 'Reportes GRI anuales'], c: 'var(--g)' },
              { t: 'Social', items: ['Empleos de calidad con prestaciones superiores a la ley', 'Programas de capacitación continua', 'EcoPuntos vinculados a beneficios municipales'], c: 'var(--b)' },
              { t: 'Gobierno Corporativo', items: ['Consejo independiente con 3 externos', 'Auditoría anual por firma certificada', 'Información financiera trimestral a inversionistas'], c: 'var(--g)' },
              { t: 'Transparencia', items: ['Dashboard público de impacto en tiempo real', 'Verificación blockchain de certificados en roadmap', 'Reporte de sustentabilidad anual público'], c: 'var(--b)' },
            ].map(e => (
              <div key={e.t} style={{ ...card, borderLeft: `3px solid ${e.c}` }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark)', marginBottom: 12 }}>{e.t}</h3>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {e.items.map(item => (
                    <li key={item} style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 48, padding: '28px', background: 'linear-gradient(135deg, var(--g) 0%, #1A5038 100%)', borderRadius: 16, textAlign: 'center' }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Invierte en el futuro de Chihuahua</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.75)', marginBottom: 24 }}>Contáctanos para recibir el deck completo y acceder a la sala de datos.</p>
            <Link href="/auth" style={{ display: 'inline-flex', padding: '13px 28px', borderRadius: 9, background: '#fff', color: 'var(--g)', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
              Acceder al Portal
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
