'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type View = 'metricas' | 'contenedores' | 'solicitudes' | 'mineria' | 'analitica';
type SolTab = 'b2c' | 'b2b';

interface Container { n: string; tipo: string; c: number; lc: string }
const CONTS_INITIAL: Container[] = [
  { n: 'Centro Histórico', tipo: 'Quick Box', c: 45, lc: '2 Jun 2026' },
  { n: 'Colonia Obrera', tipo: 'Gran Volumen', c: 72, lc: '28 May 2026' },
  { n: 'Colonia Mirador', tipo: 'Quick Box', c: 28, lc: '5 Jun 2026' },
  { n: 'Nombre de Dios', tipo: 'Gran Volumen', c: 89, lc: '25 May 2026' },
  { n: 'Santa Rosa', tipo: 'Quick Box', c: 34, lc: '4 Jun 2026' },
  { n: 'San Felipe', tipo: 'Quick Box', c: 56, lc: '30 May 2026' },
  { n: 'Desarrollo Urbano', tipo: 'Gran Volumen', c: 15, lc: '6 Jun 2026' },
  { n: 'Campestre', tipo: 'Quick Box', c: 67, lc: '29 May 2026' },
  { n: 'Parque Industrial', tipo: 'Gran Volumen', c: 91, lc: '22 May 2026' },
  { n: 'Centro Sur', tipo: 'Quick Box', c: 42, lc: '3 Jun 2026' },
  { n: 'Montecillo', tipo: 'Quick Box', c: 78, lc: '27 May 2026' },
  { n: 'Zona Industrial Norte', tipo: 'Gran Volumen', c: 53, lc: '31 May 2026' },
];

const FEED_BASE = [
  ['Centro Histórico', 'Celular', '09:42'],
  ['Colonia Obrera', 'Laptop', '09:38'],
  ['Nombre de Dios', 'Monitor', '09:31'],
  ['Santa Rosa', 'Batería x3', '09:28'],
  ['Parque Ind.', 'PC escritorio', '09:22'],
];

const MATS = [
  { cat: 'Cobre', w: '1,240', u: '848 unidades', c: 'var(--g)', bg: 'var(--g10)' },
  { cat: 'Aluminio', w: '860', u: '612 unidades', c: 'var(--muted)', bg: 'var(--bg)' },
  { cat: 'Plásticos', w: '420', u: '3,200 unidades', c: 'var(--b)', bg: 'var(--b10)' },
  { cat: 'Vidrio / LCD', w: '185', u: '124 pantallas', c: 'var(--amber)', bg: '#FFF3DC' },
  { cat: 'Baterías Li', w: '310', u: '2,840 celdas', c: 'var(--red)', bg: '#FEE8E8' },
  { cat: 'Tarjetas PCB', w: '95', u: '640 tarjetas', c: 'var(--g)', bg: 'var(--g10)' },
  { cat: 'Cables', w: '76', u: '4,100 m', c: 'var(--b)', bg: 'var(--b10)' },
  { cat: 'Metales mixtos', w: '440', u: 'Varios', c: 'var(--muted)', bg: 'var(--bg)' },
];

const trendData = [2100, 2340, 2820, 2480, 3100, 2841];
const trendMax = Math.max(...trendData);
const devData = [{ l: 'Celulares', p: 82 }, { l: 'Laptops', p: 64 }, { l: 'Monitores', p: 51 }, { l: 'Baterías', p: 43 }, { l: 'Cables', p: 36 }, { l: 'Cargadores', p: 28 }];
const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];

type B2CStatus = 'done' | 'prog' | 'pend';
interface B2CRow { folio: string; punto: string; devs: string; fecha: string; status: B2CStatus }
const B2C_INITIAL: B2CRow[] = [
  { folio: '#ECO-2026-04821', punto: 'Centro Histórico', devs: 'Celular, Cargador', fecha: '7 Jun 2026', status: 'done' },
  { folio: '#ECO-2026-04820', punto: 'Santa Rosa', devs: 'Laptop', fecha: '7 Jun 2026', status: 'prog' },
  { folio: '#ECO-2026-04815', punto: 'Nombre de Dios', devs: 'TV, Monitor', fecha: '6 Jun 2026', status: 'pend' },
  { folio: '#ECO-2026-04809', punto: 'Parque Industrial', devs: '3× Batería', fecha: '6 Jun 2026', status: 'pend' },
  { folio: '#ECO-2026-04803', punto: 'Colonia Obrera', devs: 'PC, Router', fecha: '5 Jun 2026', status: 'done' },
];

type B2BStatus = 'done' | 'prog' | 'pend';
interface B2BRow { folio: string; empresa: string; rfc: string; activos: string; vol: string; status: B2BStatus }
const B2B_INITIAL: B2BRow[] = [
  { folio: '#EMP-2026-0148', empresa: 'Maquilas Del Norte SA', rfc: 'MDN910205MX3', activos: 'PCs, Servidores', vol: 'Extra Grande', status: 'pend' },
  { folio: '#EMP-2026-0147', empresa: 'TechCorp SA de CV', rfc: 'TCO030618AB5', activos: 'Laptops', vol: 'Grande', status: 'prog' },
  { folio: '#EMP-2026-0144', empresa: 'Textiles Juárez', rfc: 'TJU881104HX2', activos: 'Celulares', vol: 'Mediano', status: 'pend' },
];

const statusMap = {
  done: { label: 'Completado', bg: 'var(--g10)', color: 'var(--g)' },
  prog: { label: 'En Proceso', bg: 'var(--b10)', color: 'var(--b)' },
  pend: { label: 'Pendiente', bg: '#FEF9C3', color: '#854D0E' },
};

function capColor(c: number) { return c < 50 ? 'var(--g)' : c < 80 ? 'var(--amber)' : 'var(--red)'; }
function capLabel(c: number) { return c < 50 ? 'Disponible' : c < 80 ? 'Llenando' : 'Crítico'; }
function capBadge(c: number) { return c < 50 ? { bg: 'var(--g10)', color: 'var(--g)' } : c < 80 ? { bg: '#FFF3DC', color: 'var(--amber)' } : { bg: '#FEE8E8', color: 'var(--red)' }; }

export default function AdminPage() {
  const [view, setView] = useState<View>('metricas');
  const [solTab, setSolTab] = useState<SolTab>('b2c');
  const [conts, setConts] = useState<Container[]>(CONTS_INITIAL);
  const [feed, setFeed] = useState(FEED_BASE);
  const [sec, setSec] = useState(0);
  const [kv1, setKv1] = useState(2841);
  const [kv2, setKv2] = useState(18430);
  const [b2c, setB2c] = useState<B2CRow[]>(B2C_INITIAL);
  const [b2b, setB2b] = useState<B2BRow[]>(B2B_INITIAL);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setSec(s => {
        const next = s + 1;
        if (next >= 5) {
          setKv1(v => v + Math.floor(Math.random() * 3));
          setKv2(v => v + Math.floor(Math.random() * 5));
          const devs = ['Celular', 'Router', 'Batería', 'Cable', 'Laptop'];
          const pts = ['Centro Histórico', 'Santa Rosa', 'Colonia Obrera', 'Parque Ind.', 'Nombre de Dios'];
          const now = new Date();
          const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          setFeed(f => [[pts[Math.floor(Math.random() * pts.length)], devs[Math.floor(Math.random() * devs.length)], time], ...f.slice(0, 4)]);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const vaciar = (i: number) => {
    setConts(c => c.map((ct, idx) => idx === i ? { ...ct, c: 0, lc: 'Hoy' } : ct));
  };

  const updB2C = (i: number, newStatus: B2CStatus) => {
    setB2c(rows => rows.map((r, idx) => idx === i ? { ...r, status: newStatus } : r));
  };
  const updB2B = (i: number, newStatus: B2BStatus) => {
    setB2b(rows => rows.map((r, idx) => idx === i ? { ...r, status: newStatus } : r));
  };

  const critCount = conts.filter(c => c.c > 80).length;
  const card: React.CSSProperties = { background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px' };
  const tcard: React.CSSProperties = { background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' };
  const th: React.CSSProperties = { padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .4, background: 'var(--bg)', borderBottom: '1px solid var(--border)' };
  const td: React.CSSProperties = { padding: '11px 14px', borderBottom: '1px solid var(--border)', fontSize: 13 };

  const navItems: { id: View; label: string }[] = [
    { id: 'metricas', label: 'Métricas Globales' },
    { id: 'contenedores', label: 'Contenedores' },
    { id: 'solicitudes', label: 'Gestión Solicitudes' },
    { id: 'mineria', label: 'Minería Urbana' },
    { id: 'analitica', label: 'Analítica' },
  ];

  const Badge = ({ status }: { status: B2CStatus | B2BStatus }) => {
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
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>Panel de Administración</div>
          </div>
        </div>
        <div style={{ padding: '10px 10px 0' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 20, background: 'rgba(209,80,80,.15)', border: '1px solid rgba(209,80,80,.25)', fontSize: 11, color: '#f87171', fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f87171' }} />
            Rol: Administrador
          </div>
        </div>
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.25)', letterSpacing: 1, textTransform: 'uppercase', padding: '8px 8px 4px' }}>Operaciones</div>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setView(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 7,
              cursor: 'pointer', border: 'none',
              background: view === item.id ? 'rgba(42,125,82,.2)' : 'transparent',
              fontFamily: 'inherit', width: '100%', textAlign: 'left', fontSize: 13, fontWeight: 500,
              color: view === item.id ? '#5DBF8A' : 'rgba(255,255,255,.5)',
              borderLeft: view === item.id ? '2px solid var(--g)' : '2px solid transparent',
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
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--g)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>CR</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Carlos Rodríguez</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>Administrador General</div>
            </div>
          </div>
          <button onClick={() => router.push('/auth')} style={{ width: '100%', padding: '7px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(255,255,255,.15)', background: 'transparent', color: 'rgba(255,255,255,.5)', fontFamily: 'inherit' }}>Cerrar Sesión</button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* TOPBAR */}
        <div style={{ height: 56, background: 'var(--white)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Admin</span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--dark)' }}>{navItems.find(n => n.id === view)?.label}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 12, color: 'var(--muted)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--g)', animation: 'none', display: 'inline-block' }} />
            Actualizado hace {sec}s
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>

          {/* MÉTRICAS VIEW */}
          {view === 'metricas' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
                {[
                  { lbl: 'Solicitudes Totales', val: kv1.toLocaleString(), trend: '↑ 12% este mes', c: 'var(--b)', bg: 'var(--b10)' },
                  { lbl: 'Depósitos Ciudadanos', val: kv2.toLocaleString(), trend: '↑ 8% este mes', c: 'var(--g)', bg: 'var(--g10)' },
                  { lbl: 'EcoPuntos Emitidos', val: '4.2M', trend: '↑ 19% vs mes anterior', c: 'var(--amber)', bg: '#FFF3DC' },
                  { lbl: 'Contenedores Críticos', val: String(critCount), trend: 'Requieren vaciado urgente', c: 'var(--red)', bg: '#FEE8E8', red: true },
                ].map(k => (
                  <div key={k.lbl} style={card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}>{k.lbl}</div>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: k.bg, flexShrink: 0 }} />
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: k.red ? 'var(--red)' : 'var(--dark)', lineHeight: 1 }}>{k.val}</div>
                    <div style={{ fontSize: 11, marginTop: 6, fontWeight: 600, color: k.red ? 'var(--red)' : 'var(--g)' }}>{k.trend}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                {/* Trend chart */}
                <div style={card}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark)', marginBottom: 3 }}>Tendencia Mensual de Depósitos</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>Total de registros por mes (2026)</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 110 }}>
                    {trendData.map((v, i) => {
                      const h = Math.round((v / trendMax) * 90);
                      return (
                        <div key={months[i]} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                          <div style={{ fontSize: 9, color: 'var(--dark)', fontWeight: 600 }}>{v}</div>
                          <div style={{ height: h, background: 'var(--b)', borderRadius: '3px 3px 0 0', width: '100%', opacity: i === 5 ? 1 : 0.6 }} />
                          <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 500 }}>{months[i]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live feed */}
                <div style={tcard}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark)' }}>Últimos Depósitos</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>Tiempo real</span>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr><th style={th}>Punto</th><th style={th}>Dispositivo</th><th style={th}>Hora</th></tr>
                    </thead>
                    <tbody>
                      {feed.map((r, i) => (
                        <tr key={i}><td style={td}>{r[0]}</td><td style={td}>{r[1]}</td><td style={{ ...td, color: 'var(--muted)' }}>{r[2]}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* CONTENEDORES VIEW */}
          {view === 'contenedores' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--dark)', margin: 0 }}>Estado de Contenedores</h2>
                <input style={{ padding: '8px 14px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit', background: 'var(--white)', color: 'var(--text)', width: 220 }} type="search" placeholder="Buscar punto..." />
              </div>
              <div style={tcard}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>{['Punto de Acopio', 'Tipo', 'Capacidad', 'Última Limpieza', 'Estado', 'Acción'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {conts.map((c, i) => {
                      const col = capColor(c.c);
                      const badge = capBadge(c.c);
                      return (
                        <tr key={c.n}>
                          <td style={{ ...td, fontWeight: 600, color: 'var(--dark)' }}>{c.n}</td>
                          <td style={td}>{c.tipo}</td>
                          <td style={td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 80, height: 8, background: 'var(--bg)', borderRadius: 4, overflow: 'hidden', flexShrink: 0 }}>
                                <div style={{ width: `${c.c}%`, height: '100%', background: col, borderRadius: 4 }} />
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 700, color: col, width: 36 }}>{c.c}%</span>
                            </div>
                          </td>
                          <td style={{ ...td, color: 'var(--muted)' }}>{c.lc}</td>
                          <td style={td}>
                            <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: badge.bg, color: badge.color }}>{capLabel(c.c)}</span>
                          </td>
                          <td style={td}>
                            {c.c > 0 ? (
                              <button onClick={() => vaciar(i)} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: 'var(--g10)', color: 'var(--g)', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Marcar vaciado</button>
                            ) : (
                              <span style={{ fontSize: 11, color: 'var(--g)', fontWeight: 700 }}>✓ Vaciado</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SOLICITUDES VIEW */}
          {view === 'solicitudes' && (
            <div>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
                {[
                  { id: 'b2c' as SolTab, label: 'B2C · Ciudadanos', count: '1,240', countColor: 'var(--b)', countBg: 'var(--b10)' },
                  { id: 'b2b' as SolTab, label: 'B2B · Empresas', count: '48', countColor: 'var(--amber)', countBg: '#FFF3DC' },
                ].map(t => (
                  <button key={t.id} onClick={() => setSolTab(t.id)} style={{
                    padding: '11px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    border: 'none', background: 'transparent', fontFamily: 'inherit',
                    color: solTab === t.id ? 'var(--b)' : 'var(--muted)',
                    borderBottom: `2px solid ${solTab === t.id ? 'var(--b)' : 'transparent'}`, marginBottom: -1,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    {t.label}
                    <span style={{ padding: '1px 7px', borderRadius: 10, fontSize: 10, fontWeight: 700, background: t.countBg, color: t.countColor }}>{t.count}</span>
                  </button>
                ))}
              </div>

              {solTab === 'b2c' && (
                <div>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                    <input style={{ padding: '8px 14px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit', background: 'var(--white)', color: 'var(--text)', flex: 1 }} type="search" placeholder="Buscar por folio o ciudadano..." />
                    <select style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit', background: 'var(--white)', color: 'var(--text)' }}>
                      <option>Todos los estados</option>
                      {['Pendiente', 'En Proceso', 'Completado'].map(o => <option key={o}>{o}</option>)}
                    </select>
                    <select style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit', background: 'var(--white)', color: 'var(--text)' }}>
                      <option>Todos los puntos</option>
                      {['Centro Histórico', 'Nombre de Dios', 'Parque Industrial'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div style={tcard}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead><tr>{['Folio', 'Punto de Acopio', 'Dispositivos', 'Fecha', 'Estado', 'Acción'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
                      <tbody>
                        {b2c.map((r, i) => (
                          <tr key={r.folio}>
                            <td style={{ ...td, fontWeight: 700, color: 'var(--dark)' }}>{r.folio}</td>
                            <td style={td}>{r.punto}</td>
                            <td style={td}>{r.devs}</td>
                            <td style={{ ...td, color: 'var(--muted)' }}>{r.fecha}</td>
                            <td style={td}><Badge status={r.status} /></td>
                            <td style={td}>
                              {r.status === 'done' ? <span style={{ fontSize: 12, color: 'var(--muted)' }}>—</span>
                                : r.status === 'prog' ? <button onClick={() => updB2C(i, 'done')} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: 'var(--g10)', color: 'var(--g)', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Completar</button>
                                  : <button onClick={() => updB2C(i, 'prog')} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: 'var(--b10)', color: 'var(--b)', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Iniciar</button>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {solTab === 'b2b' && (
                <div>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                    <input style={{ padding: '8px 14px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit', background: 'var(--white)', color: 'var(--text)', flex: 1 }} type="search" placeholder="Buscar por empresa o folio..." />
                    <select style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit', background: 'var(--white)', color: 'var(--text)' }}>
                      <option>Todos los estados</option>
                      {['Pendiente', 'En Proceso', 'Completado'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div style={tcard}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead><tr>{['Folio', 'Empresa', 'RFC', 'Activos', 'Volumen', 'Estado', 'Acción'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
                      <tbody>
                        {b2b.map((r, i) => (
                          <tr key={r.folio}>
                            <td style={{ ...td, fontWeight: 700, color: 'var(--dark)' }}>{r.folio}</td>
                            <td style={td}>{r.empresa}</td>
                            <td style={{ ...td, color: 'var(--muted)', fontSize: 12 }}>{r.rfc}</td>
                            <td style={td}>{r.activos}</td>
                            <td style={td}>{r.vol}</td>
                            <td style={td}><Badge status={r.status} /></td>
                            <td style={td}>
                              {r.status === 'done' ? <span style={{ fontSize: 12, color: 'var(--muted)' }}>—</span>
                                : r.status === 'prog' ? <button onClick={() => updB2B(i, 'done')} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: 'var(--g10)', color: 'var(--g)', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Completar</button>
                                  : <button onClick={() => updB2B(i, 'prog')} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: 'var(--b10)', color: 'var(--b)', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Asignar</button>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MINERÍA URBANA */}
          {view === 'mineria' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--dark)', marginBottom: 20 }}>Inventario de Minería Urbana</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
                {MATS.map(m => (
                  <div key={m.cat} style={card}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={m.c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="8" /></svg>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 4 }}>{m.cat}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--dark)' }}>
                      {m.w} <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 400 }}>kg</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{m.u}</div>
                    <button onClick={() => alert(`Solicitud de logística enviada para: ${m.cat}`)} style={{ marginTop: 12, width: '100%', padding: '7px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text)', fontFamily: 'inherit' }}>
                      Solicitar Logística
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ANALÍTICA */}
          {view === 'analitica' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--dark)', marginBottom: 20 }}>Analítica</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div style={card}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark)', marginBottom: 3 }}>Depósitos Mensuales</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>Registros por mes 2026</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 110 }}>
                    {trendData.map((v, i) => {
                      const h = Math.round((v / trendMax) * 90);
                      return (
                        <div key={months[i]} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                          <div style={{ fontSize: 9, color: 'var(--dark)', fontWeight: 600 }}>{v}</div>
                          <div style={{ height: h, background: 'var(--g)', borderRadius: '3px 3px 0 0', width: '100%', opacity: i === 5 ? 1 : 0.65 }} />
                          <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 500 }}>{months[i]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div style={card}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark)', marginBottom: 3 }}>Dispositivos Más Frecuentes</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>Top 6 por volumen</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {devData.map(d => (
                      <div key={d.l} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                        <span style={{ width: 90, color: 'var(--text)', fontWeight: 500, flexShrink: 0 }}>{d.l}</span>
                        <div style={{ flex: 1, height: 10, background: 'var(--bg)', borderRadius: 5, overflow: 'hidden' }}>
                          <div style={{ width: `${d.p}%`, height: '100%', background: 'var(--g)', borderRadius: 5 }} />
                        </div>
                        <span style={{ width: 32, textAlign: 'right', color: 'var(--muted)', fontWeight: 600, flexShrink: 0 }}>{d.p}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
