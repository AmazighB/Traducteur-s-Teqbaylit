export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface TranslationRequest {
  q: string;
  source: string;
  target: string;
  format: string;
  alternatives: number;
  api_key: string;
}

export interface TranslationResponse {
  translatedText: string;
  alternatives?: string[];
  detectedLanguage?: {
    confidence: number;
    language: string;
  };
}

export interface HistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: number;
}

export interface Translations {
  [key: string]: {
    appName: string;
    translateFrom: string;
    translateTo: string;
    enterText: string;
    translationWillAppear: string;
    detectedLanguage: string;
    alternativeTranslations: string;
    recentTranslations: string;
    characters: string;
    character: string;
    help: string;
    about: string;
    translating: string;
    darkMode: string;
    lightMode: string;
    dropRelease:string;
    dropHere:string;
    footerCopy:string;
    specChar:string;
  };
}