
import { AppState, SystemSettings } from '../types.ts';

const STORAGE_KEY = 'shadowkeep_data_v1';

const DEFAULT_SETTINGS: SystemSettings = {
  palette: 'monochrome',
  density: 'tactical',
  sidebarPosition: 'left',
  commandAlias: 'OPERATOR',
  overloadThreshold: 12,
  defaultFocusNoise: 'none',
  notificationsEnabled: true,
  pulseLabels: ['Depleted', 'Static', 'Functional', 'High', 'Peak'],
  defaultView: 'tasks',
  widgetOpacity: 1,
  dateFormat: 'ISO',
  confirmDelete: true
};

const INITIAL_STATE: AppState = {
  tasks: [],
  projects: [],
  notes: [],
  habits: [],
  decisions: [],
  scratchpads: [],
  recycleBin: [],
  widgetEnabled: true,
  widgetPos: { x: 20, y: 20 },
  kanbanEnabled: false,
  clarityLogs: [],
  settings: DEFAULT_SETTINGS
};

export const storageService = {
  saveData: (data: AppState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  },

  loadData: (): AppState => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Deep merge with INITIAL_STATE to ensure all arrays and objects exist
        return {
          ...INITIAL_STATE,
          ...parsed,
          tasks: parsed.tasks || [],
          projects: parsed.projects || [],
          notes: parsed.notes || [],
          habits: parsed.habits || [],
          decisions: parsed.decisions || [],
          scratchpads: parsed.scratchpads || [],
          recycleBin: parsed.recycleBin || [],
          clarityLogs: parsed.clarityLogs || [],
          settings: { 
            ...DEFAULT_SETTINGS, 
            ...(parsed.settings || {}) 
          }
        };
      }
    } catch (e) {
      console.error('Failed to load from localStorage', e);
    }
    return INITIAL_STATE;
  }
};
