import { Language } from '../types';

export const languages: Language[] = [
  
  { code: 'kab', name: 'Taqbaylit', flag: '•' },
  { code: 'fr', name: 'Français', flag: '•' },
  { code: 'en', name: 'English', flag: '•' },
  { code: 'ar', name: 'العربية', flag: '•' },  
  { code: 'es', name: 'Spanish', flag: '•' },
  { code: 'de', name: 'German', flag: '•' },
  { code: 'it', name: 'Italian', flag: '•' },
  { code: 'pt', name: 'Portuguese', flag: '•' },
  { code: 'ru', name: 'Russian', flag: '•' },
  { code: 'ja', name: 'Japanese', flag: '•' },
  { code: 'ko', name: 'Korean', flag: '•' },
  { code: 'zh', name: 'Chinese', flag: '•' },
  { code: 'hi', name: 'Hindi', flag: '•' },
  { code: 'tr', name: 'Turkish', flag: '•' },
  { code: 'nl', name: 'Dutch', flag: '•' },
  { code: 'pl', name: 'Polish', flag: '•' },
  { code: 'sv', name: 'Swedish', flag: '•' }
];

export const getLanguageByCode = (code: string): Language => {
  return languages.find(lang => lang.code === code) || languages[0];
};

export const getLanguageName = (code: string): string => {
  return getLanguageByCode(code).name;
};