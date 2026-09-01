export type MoodId = "low" | "missing" | "okay" | "smiling";
export type GoalId = "cutoff" | "heal" | "selflove";
export type RiskLevel = "high" | "medium" | "low";
export type Status = "idle" | "loading" | "done" | "error";
export type BackfillAnswer = "no_contact" | "contacted";

export interface QuickMood {
  id: MoodId;
  emoji: string;
  label: string;
}

export interface UserProfile {
  nickname?: string;
  goal?: GoalId | string;
  noContactStartDate?: string;
  status?: string;
  duration?: string;
  initiator?: string;
  timeSince?: string;
  riskyApp?: string;
  socialStatus?: string;
  trigger?: string;
  startAt?: string;
  savedAt?: string;
  [key: string]: string | string[] | GoalId | undefined;
}

export interface DailyEntry {
  id: string; // format: 'entry_YYYY-MM-DD'
  dateString: string; // format: 'YYYY-MM-DD'
  checkedIn: boolean; // วันนี้ชนะใจตัวเอง ไม่ทักไปหรือยัง
  checkedInAt: string; // ISO Timestamp
  streakDay: number; // จำนวนวัน Streak ณ วันนั้น
  mood?: string | null; // อารมณ์ประจำวัน
  note?: string | null; // ข้อความระบายประจำวัน
  aiReframing?: string | null; // คำเตือนสติฮีลใจจาก AI
}

export interface QuestionItem {
  key: string;
  label: string;
  options: string[];
}

export interface GoalOption {
  id: GoalId;
  emoji: string;
  title: string;
  desc: string;
}

export interface AiAnalysisResponse {
  empathyMessage: string;
  realityCheck: string;
  suggestedAction: string;
  riskLevel: RiskLevel;
  needsProfessionalSupport: boolean;
}

export interface AnalysisRequestBody {
  userMessage: string;
  userProfile?: UserProfile;
  mood?: string;
}

export interface AiDiaryAnalysisResponse {
  message: string;
}