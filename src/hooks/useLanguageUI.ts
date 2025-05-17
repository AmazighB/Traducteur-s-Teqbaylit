import { useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const useLanguageUI = () => {
  const [uiLanguage, setUILanguage] = useState(() => {
    const saved = localStorage.getItem('uiLanguage');
    return saved || 'en';
  });

  const t = translations[uiLanguage as keyof typeof translations];

  useEffect(() => {
    localStorage.setItem('uiLanguage', uiLanguage);
  }, [uiLanguage]);

  return { uiLanguage, setUILanguage, t };
};

export default useLanguageUI;