
export type TaskStatus = 'todo' | 'doing' | 'done';

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: number;
  completedAt?: number;
  isPinned: boolean;
  timerEnd: number | null;
  subtasks: SubTask[];
  order: number;
  assumption?: string;
  isSynthesized?: boolean;
  projectId?: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  createdAt: number;
  isArchived: boolean;
}

export interface Decision {
  id: string;
  title: string;
  context: string;
  expectedOutcome: string;
  confidence: number;
  timestamp: number;
  reviewed: boolean;
  actualOutcome?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  isHighlighted: boolean;
  isVaulted: boolean;
  lastModified: number;
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  lastCompleted: number | null;
  history: string[];
  schedule: string[];
  isVacationMode: boolean;
}

export interface ClarityLog {
  timestamp: number;
  level: number;
}

export interface ScratchpadData {
  id: string;
  content: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface RecycleBinItem {
  id: string;
  originalId: string;
  type: 'task' | 'note' | 'decision';
  data: any;
  deletedAt: number;
}

export interface SystemSettings {
  palette: 'monochrome' | 'emerald' | 'amber' | 'cobalt';
  density: 'tactical' | 'zen';
  sidebarPosition: 'left' | 'right';
  commandAlias: string;
  overloadThreshold: number;
  defaultFocusNoise: 'none' | 'white' | 'brown';
  notificationsEnabled: boolean;
  pulseLabels: string[];
  defaultView: ViewMode;
  widgetOpacity: number;
  dateFormat: 'ISO' | 'US' | 'EU';
  confirmDelete: boolean;
}

export type ViewMode = 'tasks' | 'notes' | 'habits' | 'audit' | 'settings' | 'codex' | 'decisions' | 'synthesis' | 'triage';

export interface AppState {
  tasks: Task[];
  projects: Project[];
  notes: Note[];
  habits: Habit[];
  decisions: Decision[];
  scratchpads: ScratchpadData[];
  recycleBin: RecycleBinItem[];
  widgetEnabled: boolean;
  widgetPos: { x: number; y: number };
  kanbanEnabled: boolean;
  clarityLogs: ClarityLog[];
  settings: SystemSettings;
}
