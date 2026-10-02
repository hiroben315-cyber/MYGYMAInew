import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadSessions, saveSessions, loadTodayProtein, saveTodayProtein } from '../src/utils/storage';

const values = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', { value: {
  getItem: (key: string) => values.get(key) ?? null,
  setItem: (key: string, value: string) => values.set(key, value),
} });

test('new installations and deleted histories stay empty', () => {
  values.clear();
  assert.deepEqual(loadSessions(), []);
  saveSessions([]);
  assert.deepEqual(loadSessions(), []);
});

test('protein starts at zero and persists for today', () => {
  values.clear();
  assert.equal(loadTodayProtein(), 0);
  saveTodayProtein(42);
  assert.equal(loadTodayProtein(), 42);
  values.set('ppl_hyperload_protein_today_v2', JSON.stringify({ date: '2000-01-01', grams: 42 }));
  assert.equal(loadTodayProtein(), 0);
});
