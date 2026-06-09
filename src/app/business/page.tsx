'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type View = 'dashboard' | 'nueva' | 'solicitudes' | 'certificados';
type CertTab = 'disp' | 'dest';

const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
const barVals = [820, 940, 1080, 760, 1320, 1140];
const barMax = Math.max(...barVals);

const kpis = [
  { lbl: 'Toneladas Recicladas', val: '12.8', suf: 't', trend: '↑ 34% vs año anterior', color: 'var(--g)', bg: 'var(--g10)' },
  { lbl: 'CO₂ Evitado', val: '38.4', suf: ' ton CO₂', trend: '↑ 28% vs año anterior', color: 'var(--b)', bg: 'var(--b10)' },
  { lbl: 'Solicitudes Totales', val: '24', suf: '', trend: '8 completadas', color: 'var(--g)', bg: 'var(--g10)' },
  { lbl: 'Certificados Emitidos', val: '18', suf: '', trend: '6 disposición · 12 destrucción', color: 'var(--amber)', bg: '#FFF7E6' },
];

type ReqStatus = 'done' | 'prog' | 'pend';
interface Request { folio: string; fecha: string; activos: string; vol: string; status: ReqStatus }
const requests: Request[] = [
  { folio: '#EMP-2026-0142', fecha: '3 Jun 2026', activos: 'Laptops, Monitores', vol: 'Grande', status: 'done' },
  { folio: '#EMP-2026-0138', fecha: '28 May 2026', activos: 'PCs, Servidores', vol: 'Extra Grande', status: 'prog' },
  { folio: '#EMP-2026-0131', fecha: '20 May 2026', activos: 'Celulares, Tablets', vol: 'Mediano', status: 'done' },
  { folio: '#EMP-2026-0129', fecha: '14 May 2026', activos: 'Baterías', vol: 'Pequeño', status: 'pend' },
];

const statusMap: Record<ReqStatus, { label: string; bg: string; color: string }> = {
  done: { label: 'Completado', bg: 'var(--g10)', color: 'var(--g)' },
  prog: { label: 'En Proceso', bg: 'var(--b10)', color: 'var(--b)' },
  pend: { label: 'Pendiente', bg: '#FEF9C3', color: '#854D0E' },
};

interface Cert { folio: string; tipo: string; fecha: string; activos: string; peso: string; locked?: boolean; dest?: boolean }
const certs: Cert[] = [
  { folio: '#EMP-2026-0142', tipo: 'Disposición de RAEE', fecha: '3 Jun 2026', activos: 'Laptops, Monitores', peso: '124 kg' },
  { folio: '#EMP-2026-0131', tipo: 'Disposición de RAEE', fecha: '20 May 2026', activos: 'Celulares, Tablets', peso: '38 kg' },
  { folio: '#EMP-2026-0138', tipo: 'Disposición de RAEE', fecha: '28 May 2026', activos: 'PCs, Servidores', peso: '—', locked: true },
];
const certsDest: Cert[] = [
  { folio: '#DEST-2026-0042', tipo: 'Destrucción Segura · NIST SP 800-88', fecha: '3 Jun 2026', activos: '48 laptops, 12 PCs', peso: '184 kg', dest: true },
];

export default function BusinessPage() {
  const [view, setView] = useState<View>('dashboard');
  const [certTab, setCertTab] = useState<CertTab>('disp');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDest, setModalDest] = useState(false);
  const router = useRouter();

  const card: React.CSSProperties = { background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 14, color: 'var(--text)', fontFamily: 'inherit', background: 'var(--white)', boxSizing: 'border-box' as const };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--dark)', marginBottom: 6 };
  const fGroup: React.CSSProperties = { marginBottom: 16 };

  const navItems: { id: View; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'nueva', label: 'Nueva Solicitud' },
    { id: 'solicitudes', label: 'Mis Solicitudes' },
    { id: 'certificados', label: 'Certificados' },
  ];

  const breadcrumbs: Record<View, string> = {
    dashboard: 'Dashboard',
    nueva: 'Nueva Solicitud',
    solicitudes: 'Mis Solicitudes',
    certificados: 'Certificados',
  };

  const Badge = ({ status }: { status: ReqStatus }) => {
    const s = statusMap[status];
    return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color }}>{s.label}</span>;
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)' }}>
      {/* SIDEBAR */}
      <aside style={{ width: 240, flexShrink: 0, background: 'var(--dark)', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 18px 16px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{ width: 34, height: 34, background: '#2A3A30', border: '1.5px solid #3A5A46', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5DBF8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>EcoNorte</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>Portal Empresarial</div>
          </div>
        </div>
        <div style={{ padding: '12px 10px 0' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 20, background: 'rgba(42,125,82,.15)', border: '1px solid rgba(42,125,82,.25)', fontSize: 11, color: '#5DBF8A', fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5DBF8A' }} />
            Empresa Activa
          </div>
        </div>
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.25)', letterSpacing: 1, textTransform: 'uppercase', padding: '8px 8px 4px' }}>Gestión</div>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setView(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 7,
              cursor: 'pointer', border: 'none', background: view === item.id ? 'rgba(42,125,82,.2)' : 'transparent',
              fontFamily: 'inherit', width: '100%', textAlign: 'left', fontSize: 13, fontWeight: 500,
              color: view === item.id ? '#5DBF8A' : 'rgba(255,255,255,.5)',
              borderLeft: view === item.id ? '2px solid var(--g)' : '2px solid transparent',
              marginLeft: view === item.id ? 0 : 0,
            }}>
              {item.label}
            </button>
          ))}
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.25)', letterSpacing: 1, textTransform: 'uppercase', padding: '16px 8px 4px' }}>Portales</div>
          <Link href="/investors" style={{ display: 'flex', padding: '9px 10px', borderRadius: 7, fontSize: 13, color: 'rgba(255,255,255,.4)', textDecoration: 'none' }}>Inversionistas</Link>
          <Link href="/" style={{ display: 'flex', padding: '9px 10px', borderRadius: 7, fontSize: 13, color: 'rgba(255,255,255,.4)', textDecoration: 'none' }}>Inicio EcoNorte</Link>
        </nav>
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>MN</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Manufacturas Norteñas</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>RFC: MNO-960315-AB2</div>
            </div>
          </div>
          <button onClick={() => router.push('/auth')} style={{ width: '100%', padding: '7px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(255,255,255,.15)', background: 'transparent', color: 'rgba(255,255,255,.5)', fontFamily: 'inherit' }}>Cerrar Sesión</button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* TOPBAR */}
        <div style={{ height: 56, background: 'var(--white)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Portal Empresarial</span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--dark)' }}>{breadcrumbs[view]}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <button onClick={() => setView('nueva')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, background: 'var(--g)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}>
              + Nueva Solicitud
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>

          {/* DASHBOARD VIEW */}
          {view === 'dashboard' && (
            <div>
              {/* KPI Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
                {kpis.map(k => (
                  <div key={k.lbl} style={card}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}>{k.lbl}</div>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={k.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>
                      </div>
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--dark)', lineHeight: 1 }}>
                      {k.val}<span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 400 }}>{k.suf}</span>
                    </div>
                    <div style={{ fontSize: 11, marginTop: 6, fontWeight: 600, color: 'var(--g)' }}>{k.trend}</div>
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20, marginBottom: 24 }}>
                {/* Bar chart */}
                <div style={card}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark)', marginBottom: 3 }}>Residuos Recolectados por Mes</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>kg acumulados en 2026</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120 }}>
                    {barVals.map((v, i) => {
                      const h = Math.round((v / barMax) * 100);
                      return (
                        <div key={months[i]} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                          <div style={{ fontSize: 9, color: 'var(--dark)', fontWeight: 600 }}>{(v / 1000).toFixed(1)}t</div>
                          <div style={{ height: h, background: 'var(--g)', borderRadius: '4px 4px 0 0', width: '100%', opacity: i === 4 ? 1 : 0.65 }} />
                          <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 500 }}>{months[i]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Donut chart */}
                <div style={card}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark)', marginBottom: 3 }}>Tipos de Activos</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>Distribución 2026</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexDirection: 'column' }}>
                    <svg width="100" height="100" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="36" fill="none" stroke="var(--border)" strokeWidth="14" />
                      <circle cx="50" cy="50" r="36" fill="none" stroke="var(--g)" strokeWidth="14" strokeDasharray="81 145" strokeDashoffset="0" transform="rotate(-90 50 50)" />
                      <circle cx="50" cy="50" r="36" fill="none" stroke="var(--b)" strokeWidth="14" strokeDasharray="40 145" strokeDashoffset="-81" transform="rotate(-90 50 50)" />
                      <circle cx="50" cy="50" r="36" fill="none" stroke="var(--amber)" strokeWidth="14" strokeDasharray="24 145" strokeDashoffset="-121" transform="rotate(-90 50 50)" />
                    </svg>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
                      {[
                        { color: 'var(--g)', label: 'Cómputo', pct: '35%' },
                        { color: 'var(--b)', label: 'Monitores / TV', pct: '27%' },
                        { color: 'var(--amber)', label: 'Telefonía', pct: '17%' },
                        { color: 'var(--g20)', label: 'Periféricos', pct: '21%' },
                      ].map(l => (
                        <div key={l.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
                            <span style={{ color: 'var(--muted)' }}>{l.label}</span>
                          </div>
                          <span style={{ fontWeight: 700, color: 'var(--dark)' }}>{l.pct}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent requests table */}
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark)' }}>Solicitudes Recientes</span>
                  <button onClick={() => setView('solicitudes')} style={{ fontSize: 12, color: 'var(--g)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Ver todas →</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Folio', 'Fecha', 'Activos', 'Volumen', 'Estado', 'Acción'].map(h => (
                        <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .4 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map(r => (
                      <tr key={r.folio} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--dark)' }}>{r.folio}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>{r.fecha}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text)' }}>{r.activos}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>{r.vol}</td>
                        <td style={{ padding: '10px 12px' }}><Badge status={r.status} /></td>
                        <td style={{ padding: '10px 12px' }}>
                          {r.status === 'done' ? (
                            <button onClick={() => { setModalDest(false); setModalOpen(true); }} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: 'var(--g10)', color: 'var(--g)', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Ver certificado</button>
                          ) : (
                            <span style={{ fontSize: 12, color: 'var(--muted)' }}>—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* NUEVA SOLICITUD VIEW */}
          {view === 'nueva' && (
            <div style={{ maxWidth: 680 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--dark)', marginBottom: 6 }}>Nueva Solicitud de Recolección</h2>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 28 }}>Complete los datos para programar la recolección de residuos electrónicos.</p>
              <div style={card}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>Datos de la Empresa</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={fGroup}><label style={labelStyle}>Razón Social</label><input style={inputStyle} type="text" defaultValue="Manufacturas Norteñas SA de CV" /></div>
                  <div style={fGroup}><label style={labelStyle}>RFC</label><input style={inputStyle} type="text" maxLength={13} defaultValue="MNO960315AB2" /></div>
                </div>
                <div style={fGroup}>
                  <label style={labelStyle}>Zona Industrial</label>
                  <select style={inputStyle}>
                    {['FINSA', 'Nombre de Dios', 'Complejo Industrial Chihuahua', 'Parque Industrial del Norte'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div style={fGroup}><label style={labelStyle}>Dirección Completa</label><input style={inputStyle} type="text" placeholder="Calle, número, colonia" /></div>
              </div>
              <div style={{ ...card, marginTop: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>Detalles del Residuo</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={fGroup}>
                    <label style={labelStyle}>Tipos de Activos</label>
                    <select style={inputStyle}>
                      {['Equipo de cómputo', 'Servidores y networking', 'Telefonía corporativa', 'Electrodomésticos industriales'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div style={fGroup}>
                    <label style={labelStyle}>Volumen Estimado</label>
                    <select style={inputStyle} defaultValue="Grande">
                      {['Pequeño', 'Mediano', 'Grande', 'Extra Grande'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div style={{ ...card, marginTop: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>Contacto</div>
                <div style={fGroup}><label style={labelStyle}>Nombre del Responsable</label><input style={inputStyle} type="text" placeholder="Nombre completo" /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={fGroup}><label style={labelStyle}>Teléfono</label><input style={inputStyle} type="tel" placeholder="614-000-0000" /></div>
                  <div style={fGroup}><label style={labelStyle}>Correo Electrónico</label><input style={inputStyle} type="email" placeholder="contacto@empresa.mx" /></div>
                </div>
                <div style={fGroup}><label style={labelStyle}>Fecha Deseada</label><input style={inputStyle} type="date" defaultValue="2026-06-20" /></div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button onClick={() => setView('solicitudes')} style={{ flex: 1, padding: '12px', borderRadius: 9, background: 'var(--g)', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Enviar Solicitud</button>
                <button onClick={() => setView('dashboard')} style={{ padding: '12px 20px', borderRadius: 9, border: '1.5px solid var(--border)', background: 'var(--white)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--muted)' }}>Cancelar</button>
              </div>
            </div>
          )}

          {/* SOLICITUDES VIEW */}
          {view === 'solicitudes' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--dark)', margin: 0 }}>Mis Solicitudes</h2>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input style={{ padding: '8px 14px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit', background: 'var(--white)', color: 'var(--text)', width: 240 }} type="search" placeholder="Buscar por folio..." />
                  <select style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit', background: 'var(--white)', color: 'var(--text)' }}>
                    <option>Todos los estados</option>
                    {['Pendiente', 'En Proceso', 'Completado'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div style={card}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Folio', 'Fecha', 'Activos', 'Volumen', 'Estado', 'Acción'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .4 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map(r => (
                      <tr key={r.folio} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '11px 14px', fontWeight: 700, color: 'var(--dark)' }}>{r.folio}</td>
                        <td style={{ padding: '11px 14px', color: 'var(--muted)' }}>{r.fecha}</td>
                        <td style={{ padding: '11px 14px', color: 'var(--text)' }}>{r.activos}</td>
                        <td style={{ padding: '11px 14px', color: 'var(--muted)' }}>{r.vol}</td>
                        <td style={{ padding: '11px 14px' }}><Badge status={r.status} /></td>
                        <td style={{ padding: '11px 14px' }}>
                          {r.status === 'done' ? (
                            <button onClick={() => { setModalDest(false); setModalOpen(true); }} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: 'var(--g10)', color: 'var(--g)', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Ver certificado</button>
                          ) : <span style={{ fontSize: 12, color: 'var(--muted)' }}>No disponible</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CERTIFICADOS VIEW */}
          {view === 'certificados' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--dark)', marginBottom: 20 }}>Certificados</h2>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
                {[{ id: 'disp' as CertTab, label: 'Certificados de Disposición' }, { id: 'dest' as CertTab, label: 'Certificados de Destrucción' }].map(t => (
                  <button key={t.id} onClick={() => setCertTab(t.id)} style={{
                    padding: '11px 18px', fontSize: 14, fontWeight: 600,
                    cursor: 'pointer', border: 'none', background: 'transparent',
                    fontFamily: 'inherit', color: certTab === t.id ? 'var(--b)' : 'var(--muted)',
                    borderBottom: `2px solid ${certTab === t.id ? 'var(--b)' : 'transparent'}`, marginBottom: -1,
                  }}>{t.label}</button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                {(certTab === 'disp' ? certs : certsDest).map(c => (
                  <div key={c.folio} style={{ ...card, borderTop: `3px solid ${c.dest ? 'var(--b)' : 'var(--g)'}`, position: 'relative', opacity: c.locked ? 0.55 : 1 }}>
                    {c.locked && (
                      <div style={{ position: 'absolute', top: 12, right: 12, padding: '3px 8px', borderRadius: 20, background: '#FEF9C3', color: '#854D0E', fontSize: 10, fontWeight: 700 }}>🔒 En Proceso</div>
                    )}
                    <div style={{ fontSize: 11, fontWeight: 700, color: c.dest ? 'var(--b)' : 'var(--g)', textTransform: 'uppercase', letterSpacing: .4, marginBottom: 4 }}>{c.tipo}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark)', marginBottom: 2 }}>{c.folio}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>Manufacturas Norteñas SA</div>
                    {[{ k: 'Fecha', v: c.fecha }, { k: 'Activos', v: c.activos }, { k: 'Peso', v: c.peso }].map(m => (
                      <div key={m.k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                        <span style={{ color: 'var(--muted)' }}>{m.k}</span>
                        <span style={{ fontWeight: 600, color: 'var(--text)' }}>{m.v}</span>
                      </div>
                    ))}
                    {!c.locked && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                        <button onClick={() => { setModalDest(!!c.dest); setModalOpen(true); }} style={{ flex: 1, padding: '8px 0', borderRadius: 7, fontSize: 12, fontWeight: 700, border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontFamily: 'inherit' }}>Vista previa</button>
                        <button style={{ flex: 1, padding: '8px 0', borderRadius: 7, fontSize: 12, fontWeight: 700, border: 'none', background: 'var(--g)', color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>Descargar PDF</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CERTIFICATE MODAL */}
      {modalOpen && (
        <div onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: 'var(--white)', borderRadius: 14, width: '100%', maxWidth: 560, display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark)' }}>
                {modalDest ? 'Certificado de Destrucción Segura · NIST SP 800-88' : 'Certificado de Disposición de RAEE'}
              </span>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--muted)' }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 22 }}>
              <div style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, background: 'var(--g)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--dark)', fontSize: 15 }}>EcoNorte</span>
                  </div>
                  <div style={{ padding: '4px 10px', border: '2px solid var(--g)', borderRadius: 6, fontSize: 11, fontWeight: 800, color: 'var(--g)', letterSpacing: 1 }}>CERT. OFICIAL</div>
                </div>
                <div style={{ textAlign: 'center', marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--dark)', lineHeight: 1.3 }}>
                    {modalDest ? 'Certificado de Destrucción Segura de Datos' : 'Certificado de Disposición de Residuos de Aparatos Eléctricos y Electrónicos'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>EcoNorte Centro de Acopio · Chihuahua, México</div>
                </div>
                {[
                  ['Razón Social', 'Manufacturas Norteñas SA de CV'],
                  ['RFC', 'MNO-960315-AB2'],
                  ['Folio', modalDest ? '#DEST-2026-0042' : '#EMP-2026-0142'],
                  ['Fecha de Disposición', '3 de Junio de 2026'],
                  ['Descripción', modalDest ? '48 laptops, 12 PCs — Destrucción conforme NIST SP 800-88' : '24 unidades Laptop, 18 Monitores LCD — Zona Industrial FINSA'],
                  ['Peso Total', modalDest ? '184 kg' : '124 kg'],
                  ['Método', modalDest ? 'Destrucción física + borrado certificado' : 'Desmantelamiento y separación — NOM-161-SEMARNAT-2011'],
                  ['CO₂ Evitado', modalDest ? '552 kg CO₂eq' : '372 kg CO₂eq'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                    <span style={{ color: 'var(--muted)', fontWeight: 500 }}>{k}</span>
                    <span style={{ color: 'var(--text)', fontWeight: 600, maxWidth: '55%', textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
                <div style={{ marginTop: 16, fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>
                  Documento oficial emitido por EcoNorte · Folio verificable en portal.econorte.mx/verificar
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, padding: '14px 22px', borderTop: '1px solid var(--border)' }}>
              <button onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'transparent', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--muted)' }}>Cerrar</button>
              <button style={{ flex: 1, padding: '10px', borderRadius: 8, background: 'var(--g)', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Descargar PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
