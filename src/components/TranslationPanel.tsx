import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import TextArea from './TextArea';
import TranslatedOutput from './TranslatedOutput';
import TranslationHistory from './TranslationHistory';
import { languages } from '../data/languages';
import useTranslation from '../hooks/useTranslation';
import useTheme from '../hooks/useTheme';
import useLanguageUI from '../hooks/useLanguageUI';

const TranslationPanel: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useLanguageUI();
  const {
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
  } = useTranslation();

  const handleHistorySelect = (item: any) => {
    setSourceText(item.sourceText);
    setSourceLang(item.sourceLang);
    setTargetLang(item.targetLang);
  };

  return (
    <div className={`w-full ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center mb-6 space-y-4 md:space-y-0">
          <div className="flex-1">
            <LanguageSelector
              languages={languages}
              selectedLanguage={sourceLang}
              onChange={setSourceLang}
              label={t.translateFrom}
              className="flex-1"
            />
          </div>

          <div className="flex justify-center mx-4">
            <button
              onClick={swapLanguages}
              disabled={sourceLang === 'auto'}
              className={`p-2 rounded-full transition-all duration-300 ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              } ${sourceLang === 'auto' ? 'cursor-not-allowed opacity-50' : ''}`}
              aria-label="Swap languages"
            >
              <ArrowLeftRight size={20} />
            </button>
          </div>

          <div className="flex-1">
            <LanguageSelector
              languages={languages.filter(lang => lang.code !== 'auto')}
              selectedLanguage={targetLang}
              onChange={setTargetLang}
              label={t.translateTo}
              className="flex-1"
            />
          </div>
        </div>

        {detectedLanguage && sourceLang === 'auto' && sourceText && (
          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
            {t.detectedLanguage}: {languages.find(l => l.code === detectedLanguage)?.name || detectedLanguage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-3">
            <TextArea
              value={sourceText}
              onChange={setSourceText}
              placeholder={t.enterText}
              language={sourceLang !== 'auto' ? sourceLang : 'en'}
              showWordCount
              maxHeight="300px"
            />
          </div>

          <div className="flex flex-col space-y-3">
            <TranslatedOutput
              translatedText={translatedText}
              alternatives={alternatives}
              isTranslating={isTranslating}
              error={error}
              targetLang={targetLang}
            />
          </div>
        </div>

        <TranslationHistory history={history} onSelect={handleHistorySelect} />
      </div>
    </div>
  );
}

export default TranslationPanel;