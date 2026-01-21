import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsTransitioning(true);

    // Wait for fade overlay to appear, then switch theme
    setTimeout(() => {
      setDarkMode(prev => !prev);

      // Wait a bit then fade out
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
    }, 150);
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
      {/* Smooth transition overlay */}
      <div
        className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-150 ${
          isTransitioning
            ? 'opacity-100'
            : 'opacity-0'
        }`}
        style={{
          backgroundColor: darkMode ? '#fafbfc' : '#050505'
        }}
      />
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
