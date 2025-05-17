import React, { useState } from 'react';
import useTheme from '../hooks/useTheme';


interface KabyleKeyboardProps {
  onCharacterClick: (char: string) => void;
}

const KabyleKeyboard: React.FC<KabyleKeyboardProps> = ({ onCharacterClick }) => {
  const { isDark } = useTheme();
  const [isUppercase, setIsUppercase] = useState(false);

  const specialChars = ['č', 'ḍ', 'ǧ', 'ḥ', 'ɣ', 'ṭ', 'ẓ', 'ɛ'];

  const toggleCase = () => {
    setIsUppercase(!isUppercase);
  };

  return (
    <div className={`p-2 rounded-md border ${
      isDark 
        ? 'bg-gray-700 border-gray-600' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
        Caractères spéciaux
        </span>
        <button
          onClick={toggleCase}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            isDark 
              ? 'bg-gray-600 hover:bg-gray-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
          }`}
        >
          {isUppercase ? 'Minuscules' : 'Majuscules'}
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        {specialChars.map((char) => {
          const displayChar = isUppercase ? char.toUpperCase() : char;
          return (
            <button
              key={char}
              onClick={() => onCharacterClick(displayChar)}
              className={`px-3 py-2 rounded-md text-lg transition-colors ${
                isDark
                  ? 'bg-gray-600 hover:bg-gray-800 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              {displayChar}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default KabyleKeyboard;
