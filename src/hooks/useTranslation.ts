import { useState, useEffect } from 'react';
import { translateText } from '../services/translationService';
import { HistoryItem, TranslationResponse } from '../types';

const useTranslation = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);

  // Clear translation when source text is empty
  useEffect(() => {
    if (!sourceText) {
      setTranslatedText('');
      setAlternatives([]);
      setError(null);
    }
  }, [sourceText]);

  // Debounced translation
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
   
    const performTranslation = async () => {
      if (!sourceText.trim() || sourceLang === targetLang) {
        setTranslatedText(sourceText);
        setAlternatives([]);
        setIsTranslating(false);
        return;
      }

      setIsTranslating(true);
      setError(null);

      try {
        const result: TranslationResponse = await translateText(
          sourceText,
          sourceLang,
          targetLang
        );

        setTranslatedText(result.translatedText);
        setAlternatives(result.alternatives || []);
        
        if (result.detectedLanguage && sourceLang === 'auto') {
          setDetectedLanguage(result.detectedLanguage.language);
        }

        // Add to history if the translation was successful and not empty
        if (result.translatedText && sourceText.trim()) {
          const newHistoryItem: HistoryItem = {
            id: Date.now().toString(),
            sourceText,
            translatedText: result.translatedText,
            sourceLang: detectedLanguage || sourceLang,
            targetLang,
            timestamp: Date.now()
          };
          
          setHistory(prev => {
            const updatedHistory = [newHistoryItem, ...prev].slice(0, 10);
            return updatedHistory;
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Translation failed');
      } finally {
        setIsTranslating(false);
      }
    };

    if (sourceText.trim()) {
      timeoutId = setTimeout(performTranslation, 500);
    } else {
      setIsTranslating(false);
    }

    return () => clearTimeout(timeoutId);
  }, [sourceText, sourceLang, targetLang]);

  const swapLanguages = () => {
    if (sourceLang !== 'auto') {
      setSourceText(translatedText);
      setSourceLang(targetLang);
      setTargetLang(sourceLang);
    }
  };

  return {
    sourceText,
    setSourceText,
    translatedText,
    sourceLang,
    setSourceLang,
    targetLang,
    setTargetLang,
    isTranslating,
    error,
    alternatives,
    history,
    detectedLanguage,
    swapLanguages
  };
};

export default useTranslation;