import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Clipboard, Check, X, File } from 'lucide-react';
import { textToSpeech } from '../services/translationService';
import useTheme from '../hooks/useTheme';
import useLanguageUI from '../hooks/useLanguageUI';
import KabyleKeyboard from './KabyleKeyboard';
import mammoth from 'mammoth';

interface TextAreaProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder: string;
  readOnly?: boolean;
  language: string;
  showWordCount?: boolean;
  maxHeight?: string;
  className?: string;
  enableFileImport?: boolean;
  isRight?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder,
  readOnly = false,
  language,
  showWordCount = false,
  className = '',
  enableFileImport = true, // par défaut activé
  isRight = false, // TaxtArea de droite
}) => {
  const [copied, setCopied] = useState(false);
  const [dragging, setDragging] = useState(false);
  const { isDark } = useTheme();
  const { t } = useLanguageUI();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    textToSpeech(value, language);
  };

  const handleSpecialChar = (char: string) => {
    if (!onChange || !textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newValue = value.substring(0, start) + char + value.substring(end);
    onChange(newValue);
    setTimeout(() => {
      if (textareaRef.current) {
        const newPosition = start + char.length;
        textareaRef.current.selectionStart = newPosition;
        textareaRef.current.selectionEnd = newPosition;
        textareaRef.current.focus();
      }
    }, 0);
  };

  const readTextFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (onChange) onChange(value + '\n' + text);
    };
    reader.readAsText(file);
  };

  const readDocxFile = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    if (onChange) onChange(value + '\n' + result.value);
  };

  // Gestion Drag & Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'txt') readTextFile(file);
    else if (ext === 'docx') readDocxFile(file);
    else {
      alert('Fichier non supporté. Seuls les formats DOCX et TXT sont autorisés.');
    }
  };

  // Gestion bouton import fichier
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'txt') readTextFile(file);
    else if (ext === 'docx') readDocxFile(file);
    else alert('Fichier non supporté. Seuls les formats DOCX et TXT sont autorisés.');
    // reset input pour pouvoir réimporter le même fichier plusieurs fois si besoin
    e.target.value = '';
  };

  const charCount = value.length;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div
      className={`relative w-full ${className} transition-all duration-200`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      {(enableFileImport && !readOnly) && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-md p-2 mb-2 text-center text-sm cursor-pointer select-none ${dragging
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : isDark
                ? 'border-gray-600 text-gray-400'
                : 'border-gray-300 text-gray-500'
            }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          {dragging ? (t.dropRelease) : (t.dropHere)}
          <File className="inline ml-2" size={14} />
          <input
            type="file"
            accept=".txt,.docx"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
        </div>
      )}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          const newValue = e.target.value.slice(0, 20000);
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
          }
          onChange && onChange(newValue);
        }}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full p-4 rounded-md resize-none ${isDark
            ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-400'
            : 'bg-white/80 backdrop-blur-sm text-gray-800 focus:ring-blue-500'
          } focus:outline-none focus:ring-2 ${readOnly ? 'cursor-default' : ''}`}
        style={{
          minHeight: '125px',
          marginTop: isRight ? '48px' : '',
          height: 'auto',
        }}
       />

      {showWordCount && (
        <div className={`bottom-2 left-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {charCount} / 20 000 {charCount === 1 ? t.character : t.characters}
        </div>
       )}

       {!readOnly && value && onChange && (
        <button
          onClick={() => onChange('')}
          className={`absolute top-2 right-2 p-1 rounded-full ${isDark ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          aria-label="Clear text"
        >
          <X size={14} />
        </button>
      )}

      {value && (
        <div className="absolute bottom-2 right-2 flex space-x-2">
          <button
            onClick={handleSpeak}
            className={`p-2 rounded-full transition-colors ${isDark ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            aria-label="Text to speech"
          >
            <Volume2 size={16} />
          </button>

          <button
            onClick={handleCopy}
            className={`p-2 rounded-full transition-colors ${isDark ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            aria-label="Copy to clipboard"
          >
            {copied ? <Check size={16} className="text-green-500" /> : <Clipboard size={16} />}
          </button>
        </div>
      )}

      {!readOnly && language === 'kab' && (
        <div className="mt-5">
          <KabyleKeyboard onCharacterClick={handleSpecialChar} />
        </div>
      )}
    </div>
  );
};

export default TextArea;
