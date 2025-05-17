import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Language } from '../types';
import useTheme from '../hooks/useTheme';

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguage: string;
  onChange: (code: string) => void;
  label: string;
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  languages,
  selectedLanguage,
  onChange,
  label,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDark } = useTheme();

  const selectedLanguageObj = languages.find(lang => lang.code === selectedLanguage);

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <span className={`block text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
        {label}
      </span>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isDark 
            ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
            : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center space-x-2">
          <span className="text-xl">{selectedLanguageObj?.flag}</span>
          <span className="truncate">{selectedLanguageObj?.name || 'Select language'}</span>
        </span>
        <ChevronDown size={16} className={`ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`} />
      </button>

      {isOpen && (
        <div className={`absolute z-10 w-full mt-1 rounded-md shadow-lg border max-h-60 overflow-auto ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-300'
        }`}>
          
          <ul className="py-1" role="listbox">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((language) => (
                <li
                  key={language.code}
                  role="option"
                  aria-selected={selectedLanguage === language.code}
                  onClick={() => handleSelect(language.code)}
                  className={`px-4 py-2 text-sm cursor-pointer flex items-center justify-between ${
                    isDark 
                      ? `${selectedLanguage === language.code ? 'bg-gray-700' : ''} hover:bg-gray-700 text-gray-300` 
                      : `${selectedLanguage === language.code ? 'bg-indigo-50' : ''} hover:bg-indigo-50 text-gray-900`
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-xl">{language.flag}</span>
                    <span>{language.name}</span>
                  </span>
                  {selectedLanguage === language.code && (
                    <Check size={16} className={isDark ? 'text-indigo-400' : 'text-indigo-600'} />
                  )}
                </li>
              ))
            ) : (
              <li className={`px-4 py-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                No languages found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;