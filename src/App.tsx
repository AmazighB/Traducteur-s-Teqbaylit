import TranslationPanel from './components/TranslationPanel';
import { Moon, Sun } from 'lucide-react';
import useTheme from './hooks/useTheme';
import useLanguageUI from './hooks/useLanguageUI';

function App() {
  const { isDark, setIsDark } = useTheme();
  const { uiLanguage, setUILanguage, t } = useLanguageUI();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'
      }`}>
      <header className={`${isDark ? 'bg-gray-800/50' : 'bg-gray-800'} shadow-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            {t.appName}
          </h1>

          <div className="flex items-center space-x-4">
            <select
              value={uiLanguage}
              onChange={(e) => setUILanguage(e.target.value)}
              className={`px-2 py-1 rounded-md text-sm cursor-pointer ${isDark
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-gray-700 text-white border-gray-600'
                } border`}
            >
              <option value="kab">• Taqbaylit</option>
              <option value="en">• English</option>
              <option value="fr">• Français</option>
              <option value="ar">• العربية</option>
            </select>
            {/* Lien Github */}
            <a
              href="https://github.com/AmazighB/Traducteur-s-Teqbaylit" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white hover:underline"
            >
              Github
            </a>

            {/* Lien API Doc */}
            <a
              href="https://translate.fedilab.app/docs/"  
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white hover:underline"
            >
              API Doc
            </a>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full transition-colors text-white hover:bg-white/10"
              aria-label={isDark ? t.lightMode : t.darkMode}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TranslationPanel />
      </main>

      <footer className={`fixed bottom-0 left-0 right-0 py-3 ${isDark
          ? 'bg-gray-800/50 border-gray-700'
          : 'bg-gray-50 border-gray-200'
        } border-t backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
            {t.footerCopy} {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
