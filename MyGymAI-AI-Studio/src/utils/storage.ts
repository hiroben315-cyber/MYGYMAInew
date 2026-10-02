import { WorkoutSession, UserIntakeProfile } from '../types/workout';

const STORAGE_KEYS = {
  SESSIONS: 'ppl_hyperload_sessions_v3',
  USER_PROFILE: 'ppl_hyperload_profile_v2',
  CURRENT_DRAFT: 'ppl_hyperload_draft_v2',
  TODAY_PROTEIN: 'ppl_hyperload_protein_today_v2',
};

export const DEFAULT_INTAKE_PROFILE: UserIntakeProfile = {
  gender: 'male',
  age: 28,
  height: 171,
  weight: 80,
  goal: 'recomposition',
  trainingDaysPerWeek: 4,
  sessionDurationMin: 60,
  trainingLocation: 'gym',
  experienceYears: '1-3年',
  currentWorkingWeights: '臥推 50kg 10下、滑輪下拉 55kg 10下、深蹲 70kg 10下',
  injuriesOrLimitations: '無顯著舊傷，深蹲下背偶爾緊繃',
  targetProtein: 160,
  dailyCalories: 2150,
  assignedSplit: 'PPL (Push-Pull-Legs) / Upper-Lower',
};

export function loadUserProfile(): UserIntakeProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_INTAKE_PROFILE;
}

export function saveUserProfile(profile: UserIntakeProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error(e);
  }
}

export function loadSessions(): WorkoutSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error(e);
  }

  return [];
}

export function saveSessions(sessions: WorkoutSession[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.error(e);
  }
}

export function saveSession(newSession: WorkoutSession): void {
  try {
    const existing = loadSessions();
    const updated = [newSession, ...existing];
    saveSessions(updated);
  } catch (e) {
    console.error(e);
  }
}

export function loadTodayProtein(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TODAY_PROTEIN);
    if (raw) {
      const parsed = JSON.parse(raw);
      const today = new Date().toISOString().split('T')[0];
      if (parsed.date === today) {
        return parsed.grams;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return 0;
}

export function saveTodayProtein(grams: number): void {
  try {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(
      STORAGE_KEYS.TODAY_PROTEIN,
      JSON.stringify({ date: today, grams })
    );
  } catch (e) {
    console.error(e);
  }
}
