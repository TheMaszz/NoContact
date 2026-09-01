import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { BackfillAnswer, DailyEntry, UserProfile } from "@/types";

interface AppState {
  profile: UserProfile | null;
  entries: DailyEntry[];

  setProfile: (profile: UserProfile) => void;
  checkInToday: () => void;
  updateTodayDiary: (mood: string, note: string, aiReframing?: string) => void;
  getTodayEntry: () => DailyEntry | undefined;
  calculateStreak: () => number;
  getMissedDates: () => string[];
  backfillDates: (answers: Record<string, BackfillAnswer>) => void;
}

// ===================== Date helpers ==========================
const pad = (n: number) => String(n).padStart(2, "0");

const formatDateString = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const getTodayDateString = (): string => formatDateString(new Date());

const parseDateString = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const addDays = (date: Date, delta: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + delta);
  return result;
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
        const existingIndex = currentEntries.findIndex(
          (e) => e.dateString === todayStr,
        );

        if (existingIndex > -1 && currentEntries[existingIndex].checkedIn) {
          return;
        }

        if (existingIndex > -1) {
          const updatedEntries = [...currentEntries];
          updatedEntries[existingIndex] = {
            ...updatedEntries[existingIndex],
            checkedIn: true,
            checkedInAt: new Date().toISOString(),
          };
          set({ entries: updatedEntries });
        } else {
          const newEntry: DailyEntry = {
            id: `entry_${todayStr}`,
            dateString: todayStr,
            checkedIn: true,
            checkedInAt: new Date().toISOString(),
            streakDay: 0,
            mood: null,
            note: null,
            aiReframing: null,
          };
          set({ entries: [newEntry, ...currentEntries] });
        }

        const freshStreak = get().calculateStreak();
        const finalEntries = get().entries;
        const finalIndex = finalEntries.findIndex(
          (e) => e.dateString === todayStr,
        );
        if (finalIndex > -1) {
          const withStreak = [...finalEntries];
          withStreak[finalIndex] = {
            ...withStreak[finalIndex],
            streakDay: freshStreak,
          };
          set({ entries: withStreak });
        }
      },

      updateTodayDiary: (mood, note, aiReframing) => {
        const todayStr = getTodayDateString();
        const currentEntries = get().entries;
        const existingIndex = currentEntries.findIndex(
          (e) => e.dateString === todayStr,
        );

        if (existingIndex > -1) {
          const updatedEntries = [...currentEntries];
          updatedEntries[existingIndex] = {
            ...updatedEntries[existingIndex],
            mood,
            note,
            aiReframing:
              aiReframing || updatedEntries[existingIndex].aiReframing,
          };
          set({ entries: updatedEntries });
        } else {
          const newEntry: DailyEntry = {
            id: `entry_${todayStr}`,
            dateString: todayStr,
            checkedIn: true,
            checkedInAt: new Date().toISOString(),
            streakDay: 0,
            mood,
            note,
            aiReframing,
          };
          set({ entries: [newEntry, ...currentEntries] });
        }

        const freshStreak = get().calculateStreak();
        const finalEntries = get().entries;
        const finalIndex = finalEntries.findIndex(
          (e) => e.dateString === todayStr,
        );
        if (finalIndex > -1) {
          const withStreak = [...finalEntries];
          withStreak[finalIndex] = {
            ...withStreak[finalIndex],
            streakDay: freshStreak,
          };
          set({ entries: withStreak });
        }
      },

      getTodayEntry: () => {
        const todayStr = getTodayDateString();
        return get().entries.find((e) => e.dateString === todayStr);
      },

      calculateStreak: () => {
        const entries = get().entries;
        const checkedInDates = new Set(
          entries.filter((e) => e.checkedIn).map((e) => e.dateString),
        );
        if (checkedInDates.size === 0) return 0;

        const todayStr = getTodayDateString();
        const yesterdayStr = formatDateString(addDays(new Date(), -1));

        let cursor: Date;
        if (checkedInDates.has(todayStr)) {
          cursor = parseDateString(todayStr);
        } else if (checkedInDates.has(yesterdayStr)) {
          cursor = parseDateString(yesterdayStr);
        } else {
          return 0;
        }

        let count = 0;
        while (checkedInDates.has(formatDateString(cursor))) {
          count++;
          cursor = addDays(cursor, -1);
        }
        return count;
      },
      getMissedDates: () => {
        const entries = get().entries;
        if (entries.length === 0) return [];

        const sorted = [...entries].sort(
          (a, b) =>
            parseDateString(b.dateString).getTime() -
            parseDateString(a.dateString).getTime(),
        );
        const todayStr = getTodayDateString();
        const mostRecentStr = sorted[0].dateString;

        if (mostRecentStr >= todayStr) return [];

        let cursor = addDays(parseDateString(mostRecentStr), 1);
        const missed: string[] = [];
        while (formatDateString(cursor) !== todayStr) {
          missed.push(formatDateString(cursor));
          cursor = addDays(cursor, 1);
          if (missed.length > 60) break; // safety valve for corrupted/ancient data
        }
        return missed;
      },
      backfillDates: (answers) => {
        const currentEntries = get().entries;
        const existingDates = new Set(currentEntries.map((e) => e.dateString));

        const newEntries: DailyEntry[] = Object.entries(answers)
          .filter(([dateString]) => !existingDates.has(dateString))
          .map(([dateString, answer]) => ({
            id: `entry_${dateString}`,
            dateString,
            checkedIn: answer === "no_contact",
            checkedInAt: new Date(`${dateString}T12:00:00`).toISOString(),
            streakDay: 0, // historical display only — calculateStreak() always derives fresh
            mood: null,
            note: null,
            aiReframing: null,
          }));

        set({ entries: [...newEntries, ...currentEntries] });
      },
    }),
    {
      name: "nocontact_app_storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).useAppStore = useAppStore;
}