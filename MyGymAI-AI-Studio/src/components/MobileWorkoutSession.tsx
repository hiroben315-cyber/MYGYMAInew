import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Minus, Check, Timer, Dumbbell, Repeat2, ClipboardCheck, ListChecks } from 'lucide-react';
import { ExerciseSymbol } from './ExerciseSymbol';
import { ExerciseItem, WorkoutRoutine } from '../types/workout';

interface Props {
  routine: WorkoutRoutine;
  exercises: ExerciseItem[];
  onRoutineChange: (routine: WorkoutRoutine) => void;
  onExercisesChange: (exercises: ExerciseItem[]) => void;
  onStartRestTimer: (seconds: number) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export function MobileWorkoutSession({ routine, exercises, onRoutineChange, onExercisesChange, onStartRestTimer, onAnalyze, isAnalyzing }: Props) {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [recorded, setRecorded] = useState<Set<string>>(new Set());
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const index = Math.min(exerciseIndex, Math.max(0, exercises.length - 1));
  const exercise = exercises[index];
  const currentSetIndex = Math.min(setIndex, Math.max(0, (exercise?.sets.length || 1) - 1));
  const set = exercise?.sets[currentSetIndex];
  const total = exercises.reduce((n, ex) => n + ex.sets.length, 0);
  const recordedCount = exercises.reduce((n, ex) => n + ex.sets.filter(s => recorded.has(s.id)).length, 0);
  const selectExercise = (next: number) => { setExerciseIndex(next); setSetIndex(0); };
  const update = (field: 'weightKg' | 'reps', value: number) => {
    if (!set) return;
    onExercisesChange(exercises.map((ex, i) => i !== index ? ex : { ...ex, sets: ex.sets.map((s, j) => j !== currentSetIndex ? s : { ...s, [field]: Math.max(0, value) }) }));
  };
  const addSet = () => {
    if (!exercise) return;
    const last = exercise.sets.at(-1);
    onExercisesChange(exercises.map((ex, i) => i !== index ? ex : { ...ex, sets: [...ex.sets, { id: `set-${Date.now()}-${Math.random().toString(36).slice(2,7)}`, setNumber: ex.sets.length + 1, weightKg: last?.weightKg || 0, reps: last?.reps || 10, completed: false }] }));
    setSetIndex(exercise.sets.length);
  };
  return <section className="phone-session sm:hidden" aria-label="手機訓練模式">
    <div className="session-title"><div><p><Dumbbell size={14}/> WORKOUT</p><h2>開始今天的訓練</h2></div><span>{recordedCount} / {total} 組已確認</span></div>
    <div className="session-plan">
      <label><span className="icon-label"><ListChecks size={16}/>今日課表</span><select aria-label="今日課表" value={routine} onChange={e => { onRoutineChange(e.target.value as WorkoutRoutine); selectExercise(0); setRecorded(new Set()); }}>
        <option value="Push">推日 · 胸、肩、三頭</option><option value="Pull">拉日 · 背、二頭</option><option value="Legs">腿日 · 下肢</option><option value="Upper">上肢</option><option value="Lower">下肢</option><option value="FullBody">全身</option><option value="Custom">自訂</option>
      </select></label>
      <button onClick={() => setAdding(!adding)} aria-expanded={adding} aria-label="新增動作"><Plus size={20}/></button>
    </div>
    {adding && <form className="session-add" onSubmit={e => { e.preventDefault(); if (!name.trim()) return; const id = `exercise-${Date.now()}`; onExercisesChange([...exercises, { id, name: name.trim(), isCompound: false, sets: [{ id: `${id}-1`, setNumber: 1, weightKg: 0, reps: 10, completed: false }] }]); selectExercise(exercises.length); setName(''); setAdding(false); }}><input aria-label="新動作名稱" placeholder="輸入動作名稱" value={name} onChange={e => setName(e.target.value)}/><button type="submit">新增</button></form>}
    {exercise && set ? <>
      <div className="session-exercise">
        <div className="session-pager"><button disabled={index === 0} onClick={() => selectExercise(index - 1)} aria-label="上一個動作"><ChevronLeft/></button><span>動作 {index + 1} / {exercises.length}</span><button disabled={index === exercises.length - 1} onClick={() => selectExercise(index + 1)} aria-label="下一個動作"><ChevronRight/></button></div>
        <ExerciseSymbol name={exercise.name}/><h3>{exercise.name.replace(/\s*\([^)]*\)/g, '')}</h3>
        <select className="exercise-jump" aria-label="切換動作" value={index} onChange={e => selectExercise(Number(e.target.value))}>{exercises.map((ex, i) => <option key={ex.id} value={i}>{i + 1}. {ex.name.replace(/\s*\([^)]*\)/g, '')}</option>)}</select>
        <div className="session-sets" aria-label="選擇組數">{exercise.sets.map((s, i) => <button key={s.id} aria-pressed={i === currentSetIndex} onClick={() => setSetIndex(i)}>{recorded.has(s.id) ? <Check size={14}/> : null}第 {i + 1} 組</button>)}<button onClick={addSet} aria-label="新增一組"><Plus size={18}/></button></div>
        <div className="session-numbers">
          {(['weightKg', 'reps'] as const).map(field => <div key={field}><label htmlFor={`session-${field}`}>{field === 'weightKg' ? <Dumbbell size={18}/> : <Repeat2 size={18}/>} {field === 'weightKg' ? '重量 kg' : '次數'}</label><input id={`session-${field}`} type="number" inputMode={field === 'weightKg' ? 'decimal' : 'numeric'} min="0" step={field === 'weightKg' ? '0.5' : '1'} value={set[field] || ''} placeholder="0" onChange={e => update(field, (field === 'reps' ? parseInt(e.target.value) : parseFloat(e.target.value)) || 0)}/><div className="session-stepper"><button aria-label={field === 'weightKg' ? '減少重量' : '減少次數'} onClick={() => update(field, set[field] - (field === 'weightKg' ? 2.5 : 1))}><Minus size={18}/></button><span>{field === 'weightKg' ? '2.5 kg' : '1 下'}</span><button aria-label={field === 'weightKg' ? '增加重量' : '增加次數'} onClick={() => update(field, set[field] + (field === 'weightKg' ? 2.5 : 1))}><Plus size={18}/></button></div></div>)}
        </div>
        <button className="record-set" onClick={() => { setRecorded(prev => new Set(prev).add(set.id)); onExercisesChange(exercises.map((ex,i) => i !== index ? ex : {...ex, sets: ex.sets.map((s,j) => j !== currentSetIndex ? s : {...s, completed:true})})); if (currentSetIndex < exercise.sets.length - 1) setSetIndex(currentSetIndex + 1); onStartRestTimer(exercise.isCompound ? 120 : 90); }}><Check size={20}/>確認本組，開始休息<Timer size={18}/></button>
        <p className="session-hint">{currentSetIndex + 1 === exercise.sets.length ? '最後一組了，照自己的節奏完成。' : `休息後接著第 ${currentSetIndex + 2} 組。`}</p>
      </div>
      <button className="finish-session" disabled={isAnalyzing} onClick={onAnalyze}><ClipboardCheck size={19}/>{isAnalyzing ? '正在儲存…' : '儲存整份訓練紀錄'}</button>
      <p className="session-hint">本組確認不會單獨儲存，結束時請儲存整份紀錄。</p>
    </> : <p className="session-empty">選擇課表或新增動作，開始記錄。</p>}
  </section>;
}

