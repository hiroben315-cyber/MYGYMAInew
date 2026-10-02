import React, { useState } from 'react';
import { Download } from 'lucide-react';

export function DataBackup() {
  const [message, setMessage] = useState('');
  return <details className="secondary-details"><summary>資料備份與搬移</summary><div className="p-3 space-y-3 text-sm text-zinc-400">
    <p>匯出這台裝置、目前網址下的訓練紀錄、個人設定、蛋白質與身體測量。備份不含 Gemini 金鑰，也不會上傳資料。</p>
    <button className="flex items-center gap-2 rounded-xl border border-zinc-800 px-4 py-3" onClick={() => {
      try {
        const keys = ['ppl_hyperload_sessions_v3', 'ppl_hyperload_profile_v2', 'ppl_hyperload_draft_v2', 'ppl_hyperload_protein_today_v2', 'ppl_hyperload_body_metrics_v2'];
        const data: Record<string, unknown> = {};
        for (const key of keys) { const raw = localStorage.getItem(key); if (raw !== null) data[key] = JSON.parse(raw); }
        const blob = new Blob([JSON.stringify({ app: 'MyGymAI', version: 1, exportedAt: new Date().toISOString(), data }, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `MyGymAI-data-${new Date().toISOString().slice(0,10)}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
        setMessage('備份檔已產生，請確認瀏覽器下載。');
      } catch { setMessage('備份失敗，請保留原始資料並重試。'); }
    }}><Download size={18}/>下載我的資料</button><p role="status">{message}</p>
  </div></details>;
}
