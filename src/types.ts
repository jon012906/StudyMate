export type StudyMode = 'all' | 'explain' | 'summary' | 'quiz' | 'plan';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  mode?: StudyMode;
}

export interface ExamplePrompt {
  id: string;
  category: StudyMode;
  title: string;
  label: string;
  prompt: string;
  badge?: string;
  iconName: 'lightbulb' | 'file-text' | 'help-circle' | 'calendar' | 'compass';
}
