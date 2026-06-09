'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type View = 'login' | 'register' | 'forgot' | 'success';
type Role = 'employee' | 'admin';
interface SucInfo { title: string; body: string; btnText: string; dest: string }

export default function AuthPage() {
  const [view, setView] = useState<View>('login');
  const [loginEmail, setLoginEmail] = useState('admin@econorte.mx');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [role, setRole] = useState<Role>('employee');
  const [showRegPass, setShowRegPass] = useState(false);
  const [passErr, setPassErr] = useState(false);
  const [regPass, setRegPass] = useState('');
  const [regPass2, setRegPass2] = useState('');
  const [suc, setSuc] = useState<SucInfo>({ title: '', body: '', btnText: '', dest: '/' });
  const router = useRouter();

  const doLogin = () => {
    const isAdmin = loginEmail.includes('admin');
    setSuc({
      title: '¡Sesión iniciada!',
      body: `Bienvenido${isAdmin ? ', Administrador.' : '.'} Redirigiendo a tu portal...`,
      btnText: isAdmin ? 'Ir al Panel Admin' : 'Ir al Dashboard',
      dest: isAdmin ? '/admin' : '/business',
    });
    setView('success');
    setTimeout(() => router.push(isAdmin ? '/admin' : '/business'), 1800);
  };

  const doForgot = () => {
    setSuc({
      title: 'Correo enviado',
      body: 'Revisa tu bandeja de entrada. Las instrucciones llegarán en los próximos 5 minutos.',
      btnText: 'Volver al inicio de sesión',
      dest: '/auth',
    });
    setView('success');
  };

  const doRegister = () => {
    if (regPass !== regPass2) { setPassErr(true); return; }
    setPassErr(false);
    setSuc({
      title: 'Cuenta creada',
      body: 'Tu cuenta ha sido registrada. Un administrador activará tu acceso en las próximas 24 horas.',
      btnText: 'Ir al inicio de sesión',
      dest: '/auth',
    });
    setView('success');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: '1.5px solid var(--border)', background: 'var(--white)',
    fontSize: 14, color: 'var(--text)', outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: 'var(--dark)', marginBottom: 6,
  };
  const fGroup: React.CSSProperties = { marginBottom: 14 };
  const btnGreen: React.CSSProperties = {
    width: '100%', padding: '13px', borderRadius: 9,
    background: 'var(--g)', color: '#fff',
    fontSize: 15, fontWeight: 700, border: 'none',
    cursor: 'pointer', fontFamily: 'inherit',
  };

  const TabRow = ({ active }: { active: 'login' | 'register' }) => (
    <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
      {(['login', 'register'] as const).map(t => (
        <button key={t} onClick={() => setView(t)} style={{
          flex: 1, padding: '10px', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', border: 'none', background: 'transparent',
          fontFamily: 'inherit',
          color: active === t ? 'var(--g)' : 'var(--muted)',
          borderBottom: `2px solid ${active === t ? 'var(--g)' : 'transparent'}`,
          marginBottom: -1,
        }}>
          {t === 'login' ? 'Iniciar sesión' : 'Registrarse'}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* LEFT PANEL */}
      <div style={{
        width: 420, flexShrink: 0, background: 'var(--dark)',
        display: 'flex', flexDirection: 'column',
        padding: '48px 40px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(42,125,82,.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(26,95,122,.12)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48, position: 'relative', zIndex: 1 }}>
          <div style={{ width: 38, height: 38, background: '#2A3A30', border: '1.5px solid #3A5A46', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5DBF8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>EcoNorte</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 1 }}>Chihuahua, México</div>
          </div>
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 1.25, marginBottom: 16, position: 'relative', zIndex: 1 }}>
          Recicla hoy.{' '}
          <em style={{ fontStyle: 'normal', color: '#5DBF8A' }}>Chihuahua</em>{' '}
          te lo agradece.
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', lineHeight: 1.7, marginBottom: 36, position: 'relative', zIndex: 1, maxWidth: 320 }}>
          Plataforma de gestión de residuos electrónicos para ciudadanos y empresas de Chihuahua. Certifica, rastrea y contribuye.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', zIndex: 1, marginTop: 'auto' }}>
          {[
            { n: '847 t', l: 'Toneladas recicladas' },
            { n: '12', l: 'Puntos de recolección activos' },
            { n: '138', l: 'Empresas participantes' },
          ].map(s => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(42,125,82,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5DBF8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{s.l}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 28, position: 'relative', zIndex: 1 }}>
          <Link href="/" style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', textDecoration: 'none' }}>← Volver al inicio</Link>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, background: 'var(--bg)' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* LOGIN VIEW */}
          {view === 'login' && (
            <div>
              <TabRow active="login" />
              <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--dark)', marginBottom: 6 }}>Iniciar sesión</h1>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24, lineHeight: 1.65 }}>Accede a tu portal empresarial o panel de administración.</p>
              <div style={fGroup}>
                <label style={labelStyle}>Correo electrónico</label>
                <input style={inputStyle} type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="tu@correo.mx" />
              </div>
              <div style={fGroup}>
                <label style={{ ...labelStyle, display: 'flex', justifyContent: 'space-between' }}>
                  Contraseña
                  <button onClick={() => setView('forgot')} style={{ fontSize: 11, color: 'var(--g)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>¿Olvidaste tu contraseña?</button>
                </label>
                <div style={{ position: 'relative' }}>
                  <input style={inputStyle} type={showLoginPass ? 'text' : 'password'} defaultValue="password123" placeholder="••••••••" />
                  <button onClick={() => setShowLoginPass(!showLoginPass)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <input type="checkbox" id="remember" style={{ accentColor: 'var(--g)' }} />
                <label htmlFor="remember" style={{ fontSize: 13, color: 'var(--muted)', cursor: 'pointer' }}>Recordar sesión</label>
              </div>
              <button style={btnGreen} onClick={doLogin}>Iniciar Sesión</button>
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <Link href="/citizen" style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--white)', fontSize: 13, fontWeight: 600, color: 'var(--muted)', textDecoration: 'none', textAlign: 'center' }}>
                  Entrar como Ciudadano
                </Link>
                <Link href="/business" style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--white)', fontSize: 13, fontWeight: 600, color: 'var(--muted)', textDecoration: 'none', textAlign: 'center' }}>
                  Demo Empresarial
                </Link>
              </div>
            </div>
          )}

          {/* REGISTER VIEW */}
          {view === 'register' && (
            <div>
              <TabRow active="register" />
              <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--dark)', marginBottom: 6 }}>Registrar empleado</h1>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24, lineHeight: 1.65 }}>Crea una cuenta de acceso al sistema EcoNorte.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={fGroup}><label style={labelStyle}>Nombre</label><input style={inputStyle} type="text" placeholder="Tu nombre" /></div>
                <div style={fGroup}><label style={labelStyle}>Apellido</label><input style={inputStyle} type="text" placeholder="Tu apellido" /></div>
              </div>
              <div style={fGroup}>
                <label style={labelStyle}>Correo corporativo</label>
                <input style={inputStyle} type="email" placeholder="nombre@econorte.mx" />
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Debe ser un correo @econorte.mx</div>
              </div>
              <div style={fGroup}><label style={labelStyle}>Número de empleado</label><input style={inputStyle} type="text" placeholder="ECO-0000" /></div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--dark)', marginBottom: 8 }}>Rol de acceso</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {(['employee', 'admin'] as const).map(r => (
                    <button key={r} onClick={() => setRole(r)} style={{
                      border: `1.5px solid ${role === r ? 'var(--g)' : 'var(--border)'}`,
                      background: role === r ? 'var(--g10)' : 'var(--white)',
                      borderRadius: 8, padding: 12, cursor: 'pointer', textAlign: 'left',
                    }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: role === r ? 'var(--g20)' : 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={role === r ? 'var(--g)' : 'var(--muted)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          {r === 'employee' ? <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></> : <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />}
                        </svg>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)' }}>{r === 'employee' ? 'Empleado' : 'Administrador'}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{r === 'employee' ? 'Acceso operativo estándar' : 'Acceso completo al sistema'}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div style={fGroup}>
                <label style={labelStyle}>Contraseña</label>
                <div style={{ position: 'relative' }}>
                  <input style={inputStyle} type={showRegPass ? 'text' : 'password'} placeholder="Mínimo 8 caracteres" value={regPass} onChange={e => setRegPass(e.target.value)} />
                  <button onClick={() => setShowRegPass(!showRegPass)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  </button>
                </div>
              </div>
              <div style={fGroup}>
                <label style={labelStyle}>Confirmar contraseña</label>
                <input style={{ ...inputStyle, borderColor: passErr ? 'var(--red)' : 'var(--border)' }} type="password" placeholder="Repite la contraseña" value={regPass2} onChange={e => setRegPass2(e.target.value)} />
                {passErr && <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>Las contraseñas no coinciden</div>}
              </div>
              <button style={btnGreen} onClick={doRegister}>Crear Cuenta</button>
            </div>
          )}

          {/* FORGOT VIEW */}
          {view === 'forgot' && (
            <div>
              <button onClick={() => setView('login')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', marginBottom: 22 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                Volver
              </button>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--dark)' }}>Recuperar contraseña</h1>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4, marginBottom: 22, lineHeight: 1.65 }}>Ingresa tu correo corporativo y te enviaremos instrucciones para restablecer tu acceso.</p>
              <div style={fGroup}><label style={labelStyle}>Correo electrónico</label><input style={inputStyle} type="email" placeholder="tu@econorte.mx" /></div>
              <button style={btnGreen} onClick={doForgot}>Enviar Instrucciones</button>
              <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--muted)' }}>
                ¿Recordaste tu contraseña?{' '}
                <button onClick={() => setView('login')} style={{ color: 'var(--g)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>Iniciar sesión</button>
              </div>
            </div>
          )}

          {/* SUCCESS VIEW */}
          {view === 'success' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'var(--g10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--dark)', marginBottom: 10 }}>{suc.title}</h1>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 28 }}>{suc.body}</p>
              <button style={btnGreen} onClick={() => {
                if (suc.dest === '/auth') setView('login');
                else router.push(suc.dest);
              }}>{suc.btnText}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
