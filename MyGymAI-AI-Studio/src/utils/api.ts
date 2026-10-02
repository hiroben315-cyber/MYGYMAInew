import { Capacitor } from '@capacitor/core';

export async function apiFetch(endpoint: string, init?: RequestInit): Promise<Response> {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
  if (Capacitor.isNativePlatform() && !base) {
    throw new Error('尚未設定 AI 服務；訓練紀錄仍可在本機使用。');
  }
  if (base && !base.startsWith('https://')) {
    throw new Error('AI 服務必須使用 HTTPS。');
  }
  const response = await fetch(`${base}${endpoint}`, {
    ...init,
    signal: init?.signal ?? AbortSignal.timeout(30000),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `AI 服務暫時無法使用（${response.status}）`);
  }
  return response;
}
