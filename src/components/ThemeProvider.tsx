import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

type Theme = 'light' | 'dark' | 'high-contrast';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const themes = {
  light: {
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f8fafc',
    '--bg-tertiary': '#f1f5f9',
    '--text-primary': '#1e293b',
    '--text-secondary': '#64748b',
    '--text-tertiary': '#94a3b8',
    '--border-color': '#e2e8f0',
    '--primary-color': '#3b82f6',
    '--primary-dark': '#2563eb',
    '--secondary-color': '#8b5cf6',
    '--success-color': '#10b981',
    '--warning-color': '#f59e0b',
    '--error-color': '#ef4444',
    '--info-color': '#06b6d4',
    '--shadow-light': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    '--shadow-medium': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    '--shadow-heavy': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    '--gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '--gradient-secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    '--gradient-success': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  dark: {
    '--bg-primary': '#0f172a',
    '--bg-secondary': '#1e293b',
    '--bg-tertiary': '#334155',
    '--text-primary': '#f8fafc',
    '--text-secondary': '#cbd5e1',
    '--text-tertiary': '#94a3b8',
    '--border-color': '#334155',
    '--primary-color': '#60a5fa',
    '--primary-dark': '#3b82f6',
    '--secondary-color': '#a78bfa',
    '--success-color': '#34d399',
    '--warning-color': '#fbbf24',
    '--error-color': '#f87171',
    '--info-color': '#22d3ee',
    '--shadow-light': '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
    '--shadow-medium': '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
    '--shadow-heavy': '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
    '--gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '--gradient-secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    '--gradient-success': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  'high-contrast': {
    '--bg-primary': '#000000',
    '--bg-secondary': '#1a1a1a',
    '--bg-tertiary': '#2a2a2a',
    '--text-primary': '#ffffff',
    '--text-secondary': '#cccccc',
    '--text-tertiary': '#999999',
    '--border-color': '#ffffff',
    '--primary-color': '#ffff00',
    '--primary-dark': '#cccc00',
    '--secondary-color': '#00ffff',
    '--success-color': '#00ff00',
    '--warning-color': '#ffaa00',
    '--error-color': '#ff0000',
    '--info-color': '#00aaff',
    '--shadow-light': '0 1px 3px 0 rgba(255, 255, 255, 0.2)',
    '--shadow-medium': '0 4px 6px -1px rgba(255, 255, 255, 0.2)',
    '--shadow-heavy': '0 10px 15px -3px rgba(255, 255, 255, 0.2)',
    '--gradient-primary': 'linear-gradient(135deg, #ffff00 0%, #ffaa00 100%)',
    '--gradient-secondary': 'linear-gradient(135deg, #00ffff 0%, #00aaff 100%)',
    '--gradient-success': 'linear-gradient(135deg, #00ff00 0%, #00aa00 100%)',
  },
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('react-interview-theme') as Theme;
    if (savedTheme && themes[savedTheme]) {
      return savedTheme;
    }

    // Check system preference
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }

    return 'light';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('react-interview-theme', newTheme);
  };

  const toggleTheme = () => {
    const themeOrder: Theme[] = ['light', 'dark', 'high-contrast'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    const themeVars = themes[theme];

    Object.entries(themeVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeVars['--bg-primary']);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = themeVars['--bg-primary'];
      document.head.appendChild(meta);
    }

    // Add theme class to body for additional styling
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('react-interview-theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme Toggle Component
export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const themeIcons = {
    light: '☀️',
    dark: '🌙',
    'high-contrast': '🎨',
  };

  const themeLabels = {
    light: 'Light',
    dark: 'Dark',
    'high-contrast': 'High Contrast',
  };

  return (
    <button
      onClick={toggleTheme}
      title={`Switch to ${themeLabels[theme === 'light' ? 'dark' : theme === 'dark' ? 'high-contrast' : 'light']} theme`}
      style={{
        background: 'transparent',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '0.5rem',
        cursor: 'pointer',
        fontSize: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        color: 'var(--text-primary)',
      }}
      className="hover-lift focus-ring"
    >
      {themeIcons[theme]}
    </button>
  );
};

export default ThemeProvider;
