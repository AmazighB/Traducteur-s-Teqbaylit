import { TranslationRequest, TranslationResponse } from '../types';

const TRANSLATE_API_URL = 'https://translate.fedilab.app/translate';
const DETECT_API_URL = 'https://translate.fedilab.app/detect';

const detectLanguage = async (text: string): Promise<string> => {
  try {
    const response = await fetch(DETECT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text })
    });

    if (!response.ok) {
      throw new Error(`Language detection failed: ${response.status}`);
    }

    const data = await response.json();
    return data.language || 'auto';
  } catch (error) {
    console.error('Language detection error:', error);
    return 'auto';
  }
};

export const translateText = async (
  text: string,
  sourceLang: string,
  targetLang: string,
  alternatives: number = 3
): Promise<TranslationResponse> => {
  if (!text.trim()) {
    return { translatedText: '' };
  }

  try {
    // If source language is auto, detect it first
    const detectedLang = sourceLang === 'auto' ? await detectLanguage(text) : sourceLang;

    // Create form data for the translation request
    const formData = new FormData();
    formData.append('q', text);
    formData.append('source', detectedLang);
    formData.append('target', targetLang);
    formData.append('format', 'text');
    formData.append('api_key', ''); // API allows empty key for public access

    const response = await fetch(TRANSLATE_API_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Translation error: ${response.status}`);
    }

    const data = await response.json();
    return {
      translatedText: data.translatedText || '',
      alternatives: data.alternatives || [],
      detectedLanguage: {
        confidence: 1,
        language: detectedLang
      }
    };
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};

export const textToSpeech = (text: string, lang: string): void => {
  if (!text || !window.speechSynthesis) return;
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.speak(utterance);
};