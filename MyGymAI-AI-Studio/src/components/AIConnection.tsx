import React, { useEffect, useState } from 'react';
import { Cloud, RefreshCw } from 'lucide-react';
import { apiFetch } from '../utils/api';

export function AIConnection() {
  const [message, setMessage] = useState('正在檢查 AI 設定…');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    apiFetch('/api/health').then(r => r.json()).then(data => {
      if (active) setMessage(data.aiConfigured ? 'Gemini 已設定 · 點右側測試連線' : '本機模式 · 請在電腦設定 Gemini 金鑰');
    }).catch(() => { if (active) setMessage('AI 服務未連線'); });
    return () => { active = false; };
  }, []);
  return <div className="flex items-center gap-2 text-xs text-zinc-400" role="status">
    <Cloud size={17} aria-hidden="true"/><span className="flex-1">{message}</span>
    <button type="button" disabled={busy} aria-label="測試 AI 連線" className="flex items-center gap-1 px-2 py-2 rounded-lg border border-zinc-800" onClick={async () => {
      setBusy(true); setMessage('正在測試 Gemini…');
      try { const response = await apiFetch('/api/ai/test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }); const data = await response.json(); setMessage(data.usedAi ? 'Gemini 已連線 · 測試成功' : '尚未確認 AI 連線'); }
      catch (e) { setMessage(e instanceof Error ? e.message : '測試失敗，請稍後再試。'); }
      finally { setBusy(false); }
    }}><RefreshCw size={14} className={busy ? 'animate-spin' : ''}/>{busy ? '測試中' : '測試'}</button>
  </div>;
}
