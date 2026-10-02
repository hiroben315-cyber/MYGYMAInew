import type { Express, Request } from 'express';
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export function installCloudSecurity(app: Express, env = process.env) {
  const enabled = env.CLOUD_MODE === 'true';
  const password = env.APP_PASSWORD || '';
  const secret = env.SESSION_SECRET || '';
  if (enabled && (password.length < 12 || secret.length < 32)) throw new Error('Cloud mode requires APP_PASSWORD (12+ characters) and SESSION_SECRET (32+ characters).');
  const sign = (value: string) => createHmac('sha256', secret).update(value).digest('hex');
  const equal = (a: string, b: string) => timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());
  const authenticated = (req: Request) => {
    if (!enabled) return true;
    const token = (req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith('mygym_session='))?.slice(14) || '';
    const [expiry, nonce, signature] = token.split('.');
    return Boolean(expiry && nonce && signature && Number(expiry) > Date.now() && equal(signature, sign(`${expiry}.${nonce}`)));
  };
  const cookie = (value: string, age: number) => `mygym_session=${value}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${age}`;
  let loginWindow = 0, loginAttempts = 0, aiWindow = 0, aiAttempts = 0;
  app.disable('x-powered-by');
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'same-origin');
    if (enabled) res.setHeader('X-Frame-Options', 'DENY');
    if (req.path.startsWith('/api/')) res.setHeader('Cache-Control', 'no-store');
    if (enabled && req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
      // JSON requests cannot be submitted by cross-site HTML forms.
      if (!req.is('application/json')) return res.status(415).json({ error: '此操作需要 JSON 請求。' });
      const origin = req.headers.origin;
      if (origin) {
        try { if (new URL(origin).host !== req.get('host')) return res.status(403).json({ error: '不允許跨站操作。' }); }
        catch { return res.status(403).json({ error: '來源無效。' }); }
      }
    }
    next();
  });
  app.get('/healthz', (_req, res) => res.json({ ok: true }));
  app.get('/api/auth/session', (req, res) => res.json({ required: enabled, authenticated: authenticated(req) }));
  app.post('/api/auth/login', (req, res) => {
    if (!enabled) return res.json({ success: true });
    if (Date.now() - loginWindow > 15 * 60 * 1000) { loginWindow = Date.now(); loginAttempts = 0; }
    if (++loginAttempts > 10) return res.status(429).json({ error: '嘗試次數過多，請 15 分鐘後重試。' });
    if (typeof req.body?.password !== 'string' || !equal(req.body.password, password)) return res.status(401).json({ error: '密碼不正確。' });
    const payload = `${Date.now() + 7 * 86400000}.${randomBytes(18).toString('hex')}`;
    res.setHeader('Set-Cookie', cookie(`${payload}.${sign(payload)}`, 7 * 86400));
    return res.json({ success: true });
  });
  app.post('/api/auth/logout', (_req, res) => { res.setHeader('Set-Cookie', cookie('', 0)); res.json({ success: true }); });
  app.use('/api', (req, res, next) => {
    if (!authenticated(req)) return res.status(401).json({ error: '請先登入。' });
    if (enabled && req.method === 'POST') {
      if (Date.now() - aiWindow > 3600000) { aiWindow = Date.now(); aiAttempts = 0; }
      if (++aiAttempts > 30) return res.status(429).json({ error: '本小時 AI 請求已達 30 次，請稍後再試。' });
    }
    next();
  });
}
