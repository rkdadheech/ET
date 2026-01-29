
export type Language = 'en' | 'hi';
export type Theme = 'light' | 'dark';

export interface TranslationStrings {
  home: string;
  syllabus: string;
  practice: string;
  tests: string;
  profile: string;
  searchPlaceholder: string;
  examCountdown: string;
  daysRemaining: string;
  quickLinks: string;
  studyMaterial: string;
  pyqs: string;
  dailyQuiz: string;
  welcomeBack: string;
  basicInstructor: string;
  seniorInstructor: string;
  resumeLearning: string;
  notifications: string;
  aiTutor: string;
  aiTutorDesc: string;
  askAi: string;
  focusTimer: string;
  start: string;
  pause: string;
  reset: string;
  totalStudyTime: string;
}

export interface ExamTopic {
  id: string;
  title: string;
  titleHi: string;
  progress: number;
  subTopics: string[];
}

export interface Question {
  id: string;
  text: string;
  textHi: string;
  options: string[];
  optionsHi: string[];
  correctIndex: number;
  explanation: string;
  explanationHi: string;
}
