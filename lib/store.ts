import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DailyEntry, UserProfile } from '@/types';

interface AppState {
  profile: UserProfile | null;
  entries: DailyEntry[];

  setProfile: (profile: UserProfile) => void;
  checkInToday: () => void;
  updateTodayDiary: (mood: string, note: string, aiReframing?: string) => void;
  getTodayEntry: () => DailyEntry | undefined;
  calculateStreak: () => number;
}

// ===================== Helper ==========================
const getTodayDateString = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ----------------------------------------------------------------------
// Zustand Store Implementation
// ----------------------------------------------------------------------
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: null,
      entries: [],

      setProfile: (profile) => set({ profile }),

      checkInToday: () => {
        const todayStr = getTodayDateString();
        const currentEntries = get().entries;
        const existingIndex = currentEntries.findIndex((e) => e.dateString === todayStr);

        if (existingIndex > -1 && currentEntries[existingIndex].checkedIn) {
          return;
        }

        const currentStreak = get().calculateStreak();
        const newStreak = currentStreak + 1;

        if (existingIndex > -1) {
          const updatedEntries = [...currentEntries];
          updatedEntries[existingIndex] = {
            ...updatedEntries[existingIndex],
            checkedIn: true,
            checkedInAt: new Date().toISOString(),
            streakDay: newStreak,
          };
          set({ entries: updatedEntries });
        } else {
          const newEntry: DailyEntry = {
            id: `entry_${todayStr}`,
            dateString: todayStr,
            checkedIn: true,
            checkedInAt: new Date().toISOString(),
            streakDay: newStreak,
            mood: null,
            note: null,
            aiReframing: null,
          };
          set({ entries: [newEntry, ...currentEntries] });
        }
      },

      updateTodayDiary: (mood, note, aiReframing) => {
        const todayStr = getTodayDateString();
        const currentEntries = get().entries;
        const existingIndex = currentEntries.findIndex((e) => e.dateString === todayStr);

        if (existingIndex > -1) {
          const updatedEntries = [...currentEntries];
          updatedEntries[existingIndex] = {
            ...updatedEntries[existingIndex],
            mood,
            note,
            aiReframing: aiReframing || updatedEntries[existingIndex].aiReframing,
          };
          set({ entries: updatedEntries });
        } else {
          const currentStreak = get().calculateStreak();
          const newEntry: DailyEntry = {
            id: `entry_${todayStr}`,
            dateString: todayStr,
            checkedIn: true, 
            checkedInAt: new Date().toISOString(),
            streakDay: currentStreak + 1,
            mood,
            note,
            aiReframing,
          };
          set({ entries: [newEntry, ...currentEntries] });
        }
      },

      getTodayEntry: () => {
        const todayStr = getTodayDateString();
        return get().entries.find((e) => e.dateString === todayStr);
      },

      calculateStreak: () => {
        const entries = get().entries;
        if (entries.length === 0) return 0;
        
        // เรียงลำดับจากวันที่ล่าสุดไปอดีต
        const sortedEntries = [...entries].sort((a, b) => 
          new Date(b.dateString).getTime() - new Date(a.dateString).getTime()
        );

        return sortedEntries[0]?.streakDay || 0;
      },
    }),
    {
      name: 'nocontact_app_storage', 
      storage: createJSONStorage(() => localStorage),
    }
  )
);