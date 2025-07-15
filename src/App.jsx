import { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import Home from './pages/Home';

function App() {
  // Verificar la preferencia de tema del sistema
  const [darkMode, setDarkMode] = useState(() => {
    // Intentar cargar la preferencia del usuario desde localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('klip-theme');
      if (savedTheme) return savedTheme === 'dark';
      
      // Si no hay preferencia guardada, usar la del sistema
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Aplicar el tema al cargar y cuando cambia
  useEffect(() => {
    const root = document.documentElement;
    
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('klip-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('klip-theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Klip
              </h1>
              <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                Beta
              </span>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xl"
              aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
            </button>
          </div>
        </header>
        
        <main>
          <Home />
        </main>
        
        <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <div className="container mx-auto px-4">
            <p>© {new Date().getFullYear()} Klip - Organizador de pestañas</p>
            <p className="mt-1 text-xs">
              Hecho con <span role="img" aria-label="corazón">❤️</span> por ti
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
