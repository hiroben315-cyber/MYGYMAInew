import React, { useEffect, useState } from 'react';
import { LockKeyhole, Dumbbell } from 'lucide-react';

export function CloudGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [required, setRequired] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    fetch('/api/auth/session').then(r => { if (!r.ok) throw new Error(); return r.json(); }).then(data => { setRequired(data.required); setReady(data.authenticated); })
      .catch(() => setError('無法連線至伺服器，請重新整理再試。'));
  }, []);
  if (ready) return <>{required && <button className="cloud-logout" onClick={async () => { const r = await fetch('/api/auth/logout', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: '{}' }); if (r.ok) setReady(false); }}>登出</button>}{children}</>;
  return <main className="cloud-login"><Dumbbell size={34}/><h1>MyGym</h1><p>你的私人健身日誌</p>
    {required ? <form onSubmit={async e => { e.preventDefault(); setBusy(true); setError(''); try {
      const r = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({password}) });
      const data = await r.json(); if (!r.ok) throw new Error(data.error); setPassword(''); setReady(true);
    } catch(e) { setError(e instanceof Error ? e.message : '登入失敗'); } finally { setBusy(false); } }}>
      <label htmlFor="cloud-password"><LockKeyhole size={16}/>存取密碼</label><input id="cloud-password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)}/><button disabled={busy}>{busy ? '登入中…' : '登入日誌'}</button>
    </form> : <p>正在確認連線…</p>}
    {error && <p role="alert">{error}</p>}
  </main>;
}
