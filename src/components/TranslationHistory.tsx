import React from 'react';
import { HistoryItem } from '../types';
import { getLanguageName } from '../data/languages';
import { Clock, ArrowUpRight } from 'lucide-react';
import useTheme from '../hooks/useTheme';
import useLanguageUI from '../hooks/useLanguageUI';

interface TranslationHistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

const TranslationHistory: React.FC<TranslationHistoryProps> = ({ history, onSelect }) => {
  const { isDark } = useTheme();
  const { t } = useLanguageUI();

  if (history.length === 0) {
    return null;
  }

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    
    <div className={`border-t pt-4 mt-6 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      
      <h3 className={`flex items-center text-sm font-medium mb-3 ${
        isDark ? 'text-gray-300' : 'text-gray-700'
      }`}>
        <Clock size={14} className="mr-1" />
        {t.recentTranslations}
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto pb-4">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className={`group p-3 rounded-md transition-colors cursor-pointer relative ${
              isDark 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-50 hover:bg-indigo-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 mr-6">
                <p className={`text-sm font-medium truncate ${
                  isDark ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {item.sourceText}
                </p>
                <p className={`text-sm truncate mt-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {item.translatedText}
                </p>
              </div>
              <ArrowUpRight 
                size={14} 
                className={`absolute top-3 right-3 ${
                  isDark 
                    ? 'text-gray-500 group-hover:text-gray-300' 
                    : 'text-gray-400 group-hover:text-indigo-500'
                }`} 
              />
            </div>
            <div className={`flex justify-between mt-2 text-xs ${
              isDark ? 'text-gray-500' : 'text-gray-500'
            }`}>
              <span>{getLanguageName(item.sourceLang)} → {getLanguageName(item.targetLang)}</span>
              <span>{formatTime(item.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranslationHistory;