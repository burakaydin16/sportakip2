import { Session } from '../types';

const STORAGE_KEY = 'pilates_tracker_sessions';

export const saveSessions = (sessions: Session[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error("Failed to save sessions", e);
  }
};

export const getSessions = (): Session[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load sessions", e);
    return [];
  }
};