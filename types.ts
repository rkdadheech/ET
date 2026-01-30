
export type Language = 'en' | 'hi';
export type Theme = 'light' | 'dark';

export interface User {
  name: string;
  examType: 'Basic' | 'Senior';
}

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
  pomodoro: string;
  stopwatch: string;
  workSession: string;
  breakTime: string;
  logSession: string;
  sessionComplete: string;
  searchMaterialPlaceholder: string;
  fetchingResources: string;
  noResourcesFound: string;
  onlineResources: string;
  examCalendar: string;
  login: string;
  enterName: string;
  selectExam: string;
  startPreparation: string;
  currentAffairs: string;
  india: string;
  rajasthan: string;
  latestUpdates: string;
}

export interface ExamTopic {
  id: string;
  title: string;
  titleHi: string;
  progress: number;
  subTopics: string[];
}

export interface ExamDate {
  title: string;
  date: string;
  type: 'Basic' | 'Senior' | 'Other';
  source: string;
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

export interface StudySession {
  id: string;
  timestamp: number;
  duration: number; // seconds
  mode: 'stopwatch' | 'pomodoro';
}

export interface QuizResult {
  id: string;
  timestamp: number;
  score: number;
  totalQuestions: number;
  topic: string;
}

export interface SavedResource {
  uri: string;
  title: string;
  timestamp: number;
}
