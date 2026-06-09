'use client';
import { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

type Screen = 'mapa' | 'depositar' | 'recoleccion' | 'ecopuntos' | 'historial';

const PUNTOS = [
  { id: 1, n: 'Centro Histórico', d: 'Calle Libertad 1540', t: '614-123-4567', h: 'Lun-Sab 8-18h', c: 45, tipo: 'quickbox', lat: 28.6353, lng: -106.0889 },
  { id: 2, n: 'Colonia Obrera', d: 'Av. Universidad 3200', t: '614-234-5678', h: 'Lun-Vie 9-17h', c: 72, tipo: 'large', lat: 28.6420, lng: -106.0820 },
  { id: 3, n: 'Colonia Mirador', d: 'Blvd. Díaz Ordaz 450', t: '614-345-6789', h: 'Mar-Dom 8-20h', c: 28, tipo: 'quickbox', lat: 28.6280, lng: -106.0750 },
  { id: 4, n: 'Nombre de Dios', d: 'Calle Durazno 1820', t: '614-456-7890', h: 'Lun-Sab 8-18h', c: 89, tipo: 'large', lat: 28.6150, lng: -106.0950 },
  { id: 5, n: 'Santa Rosa', d: 'Av. Tecnológico 890', t: '614-567-8901', h: 'Lun-Vie 8-17h', c: 34, tipo: 'quickbox', lat: 28.6500, lng: -106.0820 },
  { id: 6, n: 'San Felipe', d: 'Calle San Felipe 220', t: '614-678-9012', h: 'Mar-Dom 9-18h', c: 56, tipo: 'quickbox', lat: 28.6400, lng: -106.1050 },
  { id: 7, n: 'Desarrollo Urbano', d: 'Periférico R. Almada 1200', t: '614-789-0123', h: 'Lun-Sab 8-20h', c: 15, tipo: 'large', lat: 28.6600, lng: -106.0900 },
  { id: 8, n: 'Campestre', d: 'Blvd. Campestre 340', t: '614-890-1234', h: 'Lun-Vie 8-17h', c: 67, tipo: 'quickbox', lat: 28.6250, lng: -106.1100 },
  { id: 9, n: 'Parque Industrial', d: 'Av. Industrial 560', t: '614-901-2345', h: 'Lun-Sab 7-19h', c: 91, tipo: 'large', lat: 28.6700, lng: -106.0700 },
  { id: 10, n: 'Centro Sur', d: 'Av. Teófilo Borunda 1100', t: '614-012-3456', h: 'Mar-Dom 8-18h', c: 42, tipo: 'quickbox', lat: 28.6200, lng: -106.0800 },
  { id: 11, n: 'Montecillo', d: 'Calle Montecillo 780', t: '614-123-5679', h: 'Lun-Vie 9-17h', c: 78, tipo: 'quickbox', lat: 28.6480, lng: -106.1150 },
  { id: 12, n: 'Zona Industrial Norte', d: 'Blvd. A. Ortiz 2200', t: '614-234-6780', h: 'Lun-Sab 7-18h', c: 53, tipo: 'large', lat: 28.6550, lng: -106.0550 },
];

const DEVS = [
  { id: 'cel', l: 'Celular' }, { id: 'lap', l: 'Laptop' }, { id: 'pc', l: 'PC' },
  { id: 'tab', l: 'Tablet' }, { id: 'bat', l: 'Batería' }, { id: 'cha', l: 'Cargador' },
  { id: 'cab', l: 'Cable' }, { id: 'hdd', l: 'Disco' }, { id: 'mon', l: 'Monitor' },
  { id: 'pri', l: 'Impresora' }, { id: 'rou', l: 'Router' }, { id: 'tv', l: 'TV' }, { id: 'oth', l: 'Otro' },
];

const STEP_TITLES = ['', 'Paso 1 de 5 — Punto de Acopio', 'Paso 2 de 5 — Dispositivos', 'Paso 3 de 5 — Evidencia', 'Paso 4 de 5 — Tu Nombre', '¡Listo!'];
const STEP_SUBS = ['', 'Selecciona dónde vas a depositar', 'Marca los artículos que traes', 'Foto requerida para validar', 'Opcional · puedes omitir', 'Depósito registrado exitosamente'];
const STEP_WIDTHS = ['', '20%', '40%', '60%', '80%', '100%'];

function capColor(c: number) { return c < 50 ? '#2A7D52' : c < 80 ? '#D48A10' : '#D93030'; }
function capLabel(c: number) { return c < 50 ? 'Disponible' : c < 80 ? 'Llenando' : 'Casi lleno'; }

export default function CitizenPage() {
  const [screen, setScreen] = useState<Screen>('mapa');
  const [step, setStep] = useState(1);
  const [selPoint, setSelPoint] = useState<number | null>(null);
  const [selDevs, setSelDevs] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'quickbox' | 'large'>('all');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const L = (await import('leaflet')).default;
      if (!mapContainerRef.current || leafletRef.current) return;

      const map = L.map(mapContainerRef.current, { zoomControl: true, attributionControl: false }).setView([28.640, -106.088], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      PUNTOS.forEach(p => {
        const color = capColor(p.c);
        const label = capLabel(p.c);
        const icon = L.divIcon({
          className: '',
          html: `<div style="background:${color};width:36px;height:36px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;color:white;font-size:10px;font-weight:700">${p.c}%</div>`,
          iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -20],
        });
        const marker = L.marker([p.lat, p.lng], { icon });
        marker.bindPopup(`
          <div style="font-family:'DM Sans',sans-serif;min-width:210px">
            <div style="font-weight:700;font-size:14px;color:#2C3040;margin-bottom:6px">${p.n}</div>
            <div style="font-size:11px;color:#707688;margin-bottom:2px">📍 ${p.d}</div>
            <div style="font-size:11px;color:#707688;margin-bottom:2px">🕐 ${p.h}</div>
            <div style="font-size:11px;color:#707688;margin-bottom:10px">📞 ${p.t}</div>
            <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px">
              <span style="color:#707688">Capacidad</span>
              <span style="color:${color};font-weight:700">${p.c}% · ${label}</span>
            </div>
            <div style="height:6px;background:#E8EBF0;border-radius:3px;margin-bottom:10px">
              <div style="width:${p.c}%;height:100%;background:${color};border-radius:3px"></div>
            </div>
            <div style="display:flex;gap:6px">
              <button data-pid="${p.id}" data-action="dep" style="flex:1;padding:8px 0;background:#2A7D52;color:white;border:none;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif">Depositar aquí</button>
              <button data-pid="${p.id}" data-action="rep" style="flex:1;padding:8px 0;background:#FEE2E2;color:#991B1B;border:none;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif">Reportar lleno</button>
            </div>
          </div>`, { maxWidth: 240 });

        marker.on('popupopen', e => {
          const el = (e as any).popup.getElement() as HTMLElement | null;
          if (!el) return;
          el.addEventListener('click', (evt: MouseEvent) => {
            const target = evt.target as HTMLElement;
            const pid = target.dataset.pid;
            const action = target.dataset.action;
            if (pid && action === 'dep') {
              setSelPoint(parseInt(pid));
              setStep(2);
              setScreen('depositar');
            } else if (pid && action === 'rep') {
              alert(`Punto ${p.n} reportado como lleno. ¡Gracias por tu reporte!`);
            }
          });
        });
        marker.addTo(map);
      });

      leafletRef.current = map;
    })();
  }, []);

  useEffect(() => {
    if (screen === 'mapa' && leafletRef.current) {
      setTimeout(() => leafletRef.current.invalidateSize(), 60);
    }
  }, [screen]);

  const toggleDev = (id: string) => {
    setSelDevs(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };

  const resetDeposit = () => { setStep(1); setSelPoint(null); setSelDevs([]); };

  const filteredPuntos = PUNTOS.filter(p => filterType === 'all' || p.tipo === filterType);

  const navBtn: React.CSSProperties = {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: 3, border: 'none', background: 'transparent',
    cursor: 'pointer', fontFamily: 'inherit', padding: '8px 0',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: '1.5px solid var(--border)', background: 'var(--white)',
    fontSize: 14, color: 'var(--text)', fontFamily: 'inherit', boxSizing: 'border-box' as const,
  };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--dark)', marginBottom: 6 };
  const fGroup: React.CSSProperties = { marginBottom: 14 };

  const contentWrap: React.CSSProperties = {
    maxWidth: 640, margin: '0 auto', width: '100%', boxSizing: 'border-box' as const,
  };

  return (
    <div style={{ height: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* HEADER */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, flexShrink: 0, height: 56 }}>
        {screen === 'depositar' && step < 5 && (
          <>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)' }}>{STEP_TITLES[step]}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{STEP_SUBS[step]}</div>
            </div>
            <div style={{ width: 72, height: 4, borderRadius: 2, background: 'var(--border)', overflow: 'hidden', flexShrink: 0 }}>
              <div style={{ height: '100%', background: 'var(--g)', borderRadius: 2, width: STEP_WIDTHS[step], transition: 'width .3s' }} />
            </div>
          </>
        )}
        {screen === 'mapa' && (
          <>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark)' }}>EcoNorte</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Puntos de acopio</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[{ id: 'all', l: 'Todos' }, { id: 'quickbox', l: 'Quick' }, { id: 'large', l: 'Grande' }].map(f => (
                <button key={f.id} onClick={() => setFilterType(f.id as typeof filterType)} style={{
                  padding: '5px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  border: 'none', fontFamily: 'inherit',
                  background: filterType === f.id ? 'var(--g)' : 'var(--bg)',
                  color: filterType === f.id ? '#fff' : 'var(--muted)',
                }}>{f.l}</button>
              ))}
            </div>
          </>
        )}
        {screen === 'recoleccion' && <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark)' }}>Recolección Domiciliaria</div>}
        {screen === 'ecopuntos' && <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark)' }}>EcoPuntos</div>}
        {screen === 'historial' && <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark)' }}>Historial</div>}
        {screen === 'depositar' && step === 5 && <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--dark)' }}>¡Depósito Registrado!</div>}
      </div>

      {/* CONTENT AREA */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

        {/* MAPA SCREEN */}
        <div style={{ position: 'absolute', inset: 0, display: screen === 'mapa' ? 'block' : 'none' }}>
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
        </div>

        {/* DEPOSITAR SCREEN */}
        <div style={{ position: 'absolute', inset: 0, display: screen === 'depositar' ? 'flex' : 'none', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={contentWrap}>

              {/* Step 1: Select point */}
              {step === 1 && (
                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>{filteredPuntos.length} puntos disponibles</div>
                  {PUNTOS.map(p => (
                    <button key={p.id} onClick={() => setSelPoint(p.id)} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px', borderRadius: 10, marginBottom: 8,
                      border: `1.5px solid ${selPoint === p.id ? 'var(--g)' : 'var(--border)'}`,
                      background: selPoint === p.id ? 'var(--g10)' : 'var(--white)',
                      cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                    }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: capColor(p.c), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{p.c}%</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)' }}>{p.n}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.d}</div>
                      </div>
                      <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700, background: p.c < 50 ? 'var(--g10)' : p.c < 80 ? '#FFF3DC' : '#FEE8E8', color: capColor(p.c), flexShrink: 0 }}>{capLabel(p.c)}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Select devices */}
              {step === 2 && (
                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>Selecciona los artículos que traes</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 8 }}>
                    {DEVS.map(d => (
                      <button key={d.id} onClick={() => toggleDev(d.id)} style={{
                        padding: '10px 6px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center',
                        border: `1.5px solid ${selDevs.includes(d.id) ? 'var(--g)' : 'var(--border)'}`,
                        background: selDevs.includes(d.id) ? 'var(--g10)' : 'var(--white)',
                        color: selDevs.includes(d.id) ? 'var(--g)' : 'var(--text)',
                      }}>{d.l}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Photo */}
              {step === 3 && (
                <div style={{ padding: '16px' }}>
                  <div style={{ border: '2px dashed var(--border)', borderRadius: 12, padding: '48px 20px', textAlign: 'center', marginBottom: 16, cursor: 'pointer' }} onClick={() => alert('Cámara no disponible en demo')}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--g10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)', marginBottom: 4 }}>Tomar foto</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>JPG o PNG · Máx. 5 MB</div>
                  </div>
                  <div style={{ padding: '12px 14px', background: 'var(--g10)', borderRadius: 8, border: '1px solid var(--g20)', fontSize: 12, color: 'var(--g)' }}>
                    La foto valida tu depósito y suma puntos automáticamente.
                  </div>
                </div>
              )}

              {/* Step 4: Name */}
              {step === 4 && (
                <div style={{ padding: '16px' }}>
                  <div style={fGroup}>
                    <label style={labelStyle}>Nombre (opcional)</label>
                    <input style={inputStyle} type="text" placeholder="Tu nombre completo" />
                  </div>
                  <div style={{ padding: '12px 14px', background: 'var(--bg)', borderRadius: 8, fontSize: 12, color: 'var(--muted)' }}>
                    Necesario para recibir el comprobante digital y sumar puntos a tu cuenta.
                  </div>
                </div>
              )}

              {/* Step 5: Success */}
              {step === 5 && (
                <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', textAlign: 'center' }}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--g10)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>Depósito Registrado</h2>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24, lineHeight: 1.6 }}>
                    Tu depósito ha sido registrado exitosamente.
                  </div>
                  <div style={{ padding: '14px 20px', background: 'var(--g10)', borderRadius: 12, border: '1px solid var(--g20)', marginBottom: 20, width: '100%', maxWidth: 320 }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>EcoPuntos ganados</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--g)' }}>+75 pts</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Folio: ECO-2026-{String(Math.floor(Math.random() * 90000) + 10000)}</div>
                  </div>
                  <button onClick={resetDeposit} style={{ width: '100%', maxWidth: 320, padding: '12px', borderRadius: 10, background: 'var(--g)', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Nuevo Depósito
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Step footer — part of flex layout, not fixed */}
          {step < 5 && (
            <div style={{ flexShrink: 0, background: 'var(--white)', borderTop: '1px solid var(--border)', padding: '12px 16px' }}>
              <div style={{ ...contentWrap, display: 'flex', gap: 10 }}>
                {step > 1 && (
                  <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--white)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--muted)' }}>
                    Atrás
                  </button>
                )}
                <button onClick={() => setStep(s => Math.min(s + 1, 5))} style={{ flex: 2, padding: '12px', borderRadius: 10, background: 'var(--g)', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {step === 4 ? 'Registrar Depósito' : 'Continuar'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RECOLECCIÓN SCREEN */}
        <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', display: screen === 'recoleccion' ? 'block' : 'none' }}>
          <div style={{ ...contentWrap, padding: '16px' }}>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.6 }}>
              Programa la recolección de tus residuos directamente en tu domicilio.
            </div>
            <div style={fGroup}><label style={labelStyle}>Nombre completo</label><input style={inputStyle} type="text" placeholder="Tu nombre completo" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={fGroup}><label style={labelStyle}>Teléfono</label><input style={inputStyle} type="tel" placeholder="614-000-0000" /></div>
              <div style={fGroup}><label style={labelStyle}>Email</label><input style={inputStyle} type="email" placeholder="tu@correo.mx" /></div>
            </div>
            <div style={fGroup}><label style={labelStyle}>Dirección</label><input style={inputStyle} type="text" placeholder="Calle, número exterior" /></div>
            <div style={fGroup}><label style={labelStyle}>Colonia</label><input style={inputStyle} type="text" placeholder="Nombre de la colonia" /></div>
            <div style={fGroup}>
              <label style={labelStyle}>Tipos de residuos</label>
              <select style={inputStyle}>
                <option>Selecciona...</option>
                <option>Electrónicos pequeños (celular, tablet)</option>
                <option>Equipo de cómputo (laptop, PC)</option>
                <option>Electrodomésticos (TV, monitor)</option>
                <option>Baterías y cargadores</option>
                <option>Mezcla de varios tipos</option>
              </select>
            </div>
            <div style={fGroup}>
              <label style={labelStyle}>Volumen estimado</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
                {['Pequeño', 'Mediano', 'Grande', 'Extra'].map((v, i) => (
                  <ChipBtn key={v} label={v} defaultActive={i === 1} />
                ))}
              </div>
            </div>
            <div style={fGroup}><label style={labelStyle}>Fecha deseada</label><input style={inputStyle} type="date" defaultValue="2026-06-15" /></div>
            <button onClick={() => alert('Solicitud enviada.\n\nFolio: RECO-2026-00892\nNos pondremos en contacto para confirmar la fecha.')} style={{ width: '100%', padding: '13px', borderRadius: 10, background: 'var(--b)', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit', marginBottom: 16 }}>
              Solicitar Recolección
            </button>
          </div>
        </div>

        {/* ECOPUNTOS SCREEN */}
        <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', display: screen === 'ecopuntos' ? 'block' : 'none' }}>
          <div style={{ ...contentWrap, padding: '16px' }}>
            {/* Hero */}
            <div style={{ background: 'linear-gradient(135deg, var(--g) 0%, #1A5038 100%)', borderRadius: 16, padding: '24px 20px', marginBottom: 16, textAlign: 'center', color: '#fff' }}>
              <div style={{ fontSize: 42, fontWeight: 700, lineHeight: 1 }}>1,250</div>
              <div style={{ fontSize: 13, opacity: .8, marginTop: 4 }}>EcoPuntos acumulados</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, padding: '4px 12px', borderRadius: 20, background: 'rgba(255,255,255,.15)', fontSize: 12, fontWeight: 700 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7EC8F5' }} />
                Nivel Azul
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,.2)', borderRadius: 3, marginTop: 12, overflow: 'hidden' }}>
                <div style={{ width: '50%', height: '100%', background: '#7EC8F5', borderRadius: 3 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, opacity: .7, marginTop: 5 }}>
                <span>Azul · 500 pts</span>
                <span>250 pts para Platino</span>
              </div>
            </div>

            {/* Levels */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)', marginBottom: 12 }}>Niveles del Programa</div>
              {[
                { n: 'Verde', pts: '200+', c: '#2A7D52', bg: '#EBF5EF', done: true },
                { n: 'Azul', pts: '500+', c: '#1A5F7A', bg: '#E5F0F7', active: true },
                { n: 'Platino', pts: '1,000+', c: '#8B6914', bg: '#FFF3DC', locked: true },
              ].map(l => (
                <div key={l.n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, background: l.active ? 'var(--g10)' : 'transparent', marginBottom: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.c, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)' }}>Nivel {l.n}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{l.pts} puntos</div>
                  </div>
                  {l.done && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--g)' }}>✓ Logrado</span>}
                  {l.active && <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700, background: 'var(--g)', color: '#fff' }}>Actual</span>}
                  {l.locked && <span style={{ fontSize: 10, color: 'var(--muted)' }}>250 pts restantes</span>}
                </div>
              ))}
            </div>

            {/* Rewards */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)', marginBottom: 12 }}>Canjear Puntos</div>
              {[
                { n: 'Descuento predial', pts: 500 },
                { n: 'Vale transporte', pts: 300 },
                { n: 'Certificado ambiental', pts: 200 },
              ].map(r => (
                <div key={r.n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--g10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" rx="1" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" /></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dark)' }}>{r.n}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{r.pts} puntos</div>
                  </div>
                  <button onClick={() => alert(`Canjeando: ${r.n}`)} style={{ padding: '6px 12px', borderRadius: 7, background: 'var(--g10)', color: 'var(--g)', border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Canjear</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HISTORIAL SCREEN */}
        <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', display: screen === 'historial' ? 'block' : 'none' }}>
          <div style={{ ...contentWrap, padding: '16px' }}>
            {[
              {
                mes: 'Junio 2026', items: [
                  { pt: 'Centro Histórico', devs: '2× Celular, 1× Cargador', dt: '7 Jun 2026 · 09:42', pts: '+75 pts' },
                  { pt: 'Santa Rosa', devs: '1× Laptop', dt: '3 Jun 2026 · 11:24', pts: '+50 pts' },
                ]
              },
              {
                mes: 'Mayo 2026', items: [
                  { pt: 'Colonia Obrera', devs: '1× Monitor, 1× PC', dt: '22 May 2026 · 14:15', pts: '+90 pts' },
                  { pt: 'Centro Sur', devs: '3× Batería', dt: '15 May 2026 · 10:00', pts: '+30 pts' },
                  { pt: 'San Felipe', devs: '1× Router, 2× Cable', dt: '8 May 2026 · 16:45', pts: '+35 pts' },
                ]
              },
              {
                mes: 'Abril 2026', items: [
                  { pt: 'Centro Histórico', devs: '1× Laptop, 1× Tablet', dt: '28 Abr 2026 · 12:30', pts: '+70 pts' },
                ]
              },
            ].map(group => (
              <div key={group.mes} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 10 }}>{group.mes}</div>
                {group.items.map(item => (
                  <div key={item.dt} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--g10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="2" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18.01" /></svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)' }}>{item.pt}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{item.devs}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>{item.dt}</div>
                    </div>
                    <span style={{ padding: '3px 8px', borderRadius: 20, background: 'var(--g10)', color: 'var(--g)', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{item.pts}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div style={{ background: 'var(--white)', borderTop: '1px solid var(--border)', display: 'flex', flexShrink: 0, height: 60 }}>
        {([
          { id: 'mapa', label: 'Mapa', icon: <MapIcon /> },
          { id: 'depositar', label: 'Depositar', icon: <DepIcon /> },
          { id: 'recoleccion', label: 'Recolección', icon: <TruckIcon /> },
          { id: 'ecopuntos', label: 'EcoPuntos', icon: <StarIcon /> },
          { id: 'historial', label: 'Historial', icon: <ClockIcon /> },
        ] as const).map(tab => (
          <button key={tab.id} onClick={() => setScreen(tab.id as Screen)} style={{ ...navBtn, color: screen === tab.id ? 'var(--g)' : 'var(--muted)' }}>
            <div style={{ color: screen === tab.id ? 'var(--g)' : 'var(--muted)' }}>{tab.icon}</div>
            <span style={{ fontSize: 10, fontWeight: screen === tab.id ? 700 : 400 }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ChipBtn({ label, defaultActive }: { label: string; defaultActive?: boolean }) {
  const [active, setActive] = useState(defaultActive ?? false);
  return (
    <button onClick={() => setActive(a => !a)} style={{
      padding: '7px 4px', borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer',
      fontFamily: 'inherit', border: `1.5px solid ${active ? 'var(--b)' : 'var(--border)'}`,
      background: active ? 'var(--b10)' : 'var(--white)', color: active ? 'var(--b)' : 'var(--muted)',
    }}>{label}</button>
  );
}

function MapIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /></svg>; }
function DepIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>; }
function TruckIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h5l3 3v5h-8V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>; }
function StarIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>; }
function ClockIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>; }
