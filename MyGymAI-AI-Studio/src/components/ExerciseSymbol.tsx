import React from 'react';

/** Simple equipment symbols, not demonstrations of exercise technique. */
export function ExerciseSymbol({ name }: { name: string }) {
  const squat = /蹲|腿|Squat|Leg/i.test(name);
  const cable = /滑輪|下拉|划船|Pull|Row/i.test(name);
  return <svg viewBox="0 0 96 72" fill="none" aria-hidden="true" className="exercise-symbol">
    <rect x="2" y="2" width="92" height="68" rx="20" fill="currentColor" opacity=".07"/>
    <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      {squat ? <><path d="M22 58V16h52v42M17 58h14m34 0h14M20 28h56"/><path d="M30 21v14m36-14v14"/><circle cx="48" cy="37" r="5"/><path d="m44 44-6 8 10 7m4-15 6 8-10 7"/></> : cable ? <><path d="M25 59V15h43v44M19 59h55M47 16v18m-14 0h28M35 34l-5 5m29-5 5 5"/><circle cx="47" cy="16" r="4"/><path d="M40 53h15m-12 0v6m9-6v6"/></> : <><path d="m24 28 48 0M29 20v16m-6-13v10m44-13v16m6-13v10M25 49h42M32 49v10m29-10v10"/><path d="M38 44h19m-15-4 1-7m10 7-1-7"/></>}
    </g>
  </svg>;
}
