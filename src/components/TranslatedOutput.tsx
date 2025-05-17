import React from 'react';
import TextArea from './TextArea';
import useTheme from '../hooks/useTheme';
import useLanguageUI from '../hooks/useLanguageUI';

interface TranslatedOutputProps {
  translatedText: string;
  alternatives: string[];
  isTranslating: boolean;
  error: string | null;
  targetLang: string;
}

const TranslatedOutput: React.FC<TranslatedOutputProps> = ({
  translatedText,
  alternatives,
  isTranslating,
  error,
  targetLang
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguageUI();

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="min-h-[120px] relative">
        {isTranslating && (
          <div className={`absolute inset-0 flex items-center justify-center ${
            isDark ? 'bg-gray-800/50' : 'bg-white/50'
          } backdrop-blur-sm z-10 rounded-md`}>
            <div className="flex flex-col items-center">
              <div className="animate-pulse flex space-x-2">
                <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce"></div>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
                {t.translating}
              </p>
            </div>
          </div>
        )}

        <TextArea
          value={translatedText}
          readOnly
          placeholder={t.translationWillAppear}
          language={targetLang}
          className="mb-2"
          isRight
        />

        {error && (
          <div className={`mt-2 text-sm text-red-600 p-2 ${
            isDark ? 'bg-red-900/20' : 'bg-red-50'
          } rounded-md`}>
            {error}
          </div>
        )}
      </div>

      {alternatives.length > 0 && !isTranslating && (
        <div className="mt-4">
          <h3 className={`text-sm font-medium ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          } mb-2`}>
            {t.alternativeTranslations}:
          </h3>
          <div className="space-y-2">
            {alternatives.map((alt, index) => (
              <div 
                key={index}
                className={`p-3 rounded-md ${
                  isDark 
                    ? 'bg-gray-700/50 text-gray-300' 
                    : 'bg-gray-50 text-gray-700'
                }`}
              >
                {alt}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslatedOutput;