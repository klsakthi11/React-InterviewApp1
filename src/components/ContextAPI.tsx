import {
  createContext,
  useContext,
  useState,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import ResizableCodePanel from './ResizableCodePanel';

// Theme Context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// User Context
interface UserContextType {
  user: { name: string; email: string } | null;
  login: (userData: { name: string; email: string }) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

// Theme Provider
const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// User Provider
const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  const login = (userData: { name: string; email: string }) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Components using Context
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: '0.75rem 1.5rem',
        backgroundColor: theme === 'light' ? '#1f2937' : '#f3f4f6',
        color: theme === 'light' ? 'white' : '#1f2937',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
      }}
    >
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
};

const UserProfile = () => {
  const { user, logout } = useUser();

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
      }}
    >
      <h3>User Profile</h3>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <button
        onClick={logout}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>
    </div>
  );
};

const LoginForm = () => {
  const { login } = useUser();
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(formData);
    setFormData({ name: '', email: '' });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <div style={{ marginBottom: '0.5rem' }}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={e =>
            setFormData(prev => ({ ...prev, name: e.target.value }))
          }
          style={{
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginRight: '0.5rem',
          }}
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={e =>
            setFormData(prev => ({ ...prev, email: e.target.value }))
          }
          style={{
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginRight: '0.5rem',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </div>
    </form>
  );
};

const ThemedComponent = () => {
  const { theme } = useTheme();

  const themeStyles = {
    light: {
      background: '#ffffff',
      color: '#1f2937',
      border: '1px solid #e5e7eb',
    },
    dark: {
      background: '#1f2937',
      color: '#f9fafb',
      border: '1px solid #4b5563',
    },
  };

  return (
    <div
      style={{
        padding: '2rem',
        borderRadius: '8px',
        ...themeStyles[theme],
        transition: 'all 0.3s ease',
      }}
    >
      <h3>Theme-aware Component</h3>
      <p>This component automatically adapts to the current theme.</p>
      <p>
        Current theme: <strong>{theme}</strong>
      </p>
    </div>
  );
};

// Additional Context Examples with UI

// 1. Language Context
interface LanguageContextType {
  language: 'en' | 'es' | 'fr';
  setLanguage: (lang: 'en' | 'es' | 'fr') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<'en' | 'es' | 'fr'>('en');

  const translations = {
    en: { welcome: 'Welcome', hello: 'Hello', goodbye: 'Goodbye' },
    es: { welcome: 'Bienvenido', hello: 'Hola', goodbye: 'Adiós' },
    fr: { welcome: 'Bienvenue', hello: 'Bonjour', goodbye: 'Au revoir' },
  };

  const t = (key: string) =>
    translations[language][key as keyof typeof translations.en] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 2. Counter Context with useReducer
interface CounterContextType {
  state: { count: number; history: number[] };
  dispatch: React.Dispatch<any>;
}

const CounterContext = createContext<CounterContextType | undefined>(undefined);

const useCounter = () => {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error('useCounter must be used within CounterProvider');
  }
  return context;
};

const counterReducer = (
  state: { count: number; history: number[] },
  action: any
) => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        count: state.count + 1,
        history: [...state.history, state.count + 1],
      };
    case 'DECREMENT':
      return {
        count: state.count - 1,
        history: [...state.history, state.count - 1],
      };
    case 'RESET':
      return {
        count: 0,
        history: [...state.history, 0],
      };
    default:
      return state;
  }
};

const CounterProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(counterReducer, {
    count: 0,
    history: [],
  });

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      {children}
    </CounterContext.Provider>
  );
};

// 3. Settings Context with Local Storage
interface SettingsContextType {
  settings: { notifications: boolean; sound: boolean; autoSave: boolean };
  updateSetting: (key: string, value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('settings');
    return saved
      ? JSON.parse(saved)
      : { notifications: true, sound: false, autoSave: true };
  });

  const updateSetting = (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('settings', JSON.stringify(newSettings));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

// 4. Notification Context
interface NotificationContextType {
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>;
  addNotification: (
    message: string,
    type: 'success' | 'error' | 'info'
  ) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within NotificationProvider'
    );
  }
  return context;
};

const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<
    Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>
  >([]);

  const addNotification = (
    message: string,
    type: 'success' | 'error' | 'info'
  ) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeNotification(id), 3000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// 5. Context with Default Values
interface DefaultThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const DefaultThemeContext = createContext<DefaultThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

const useDefaultTheme = () => {
  return useContext(DefaultThemeContext);
};

const DefaultThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <DefaultThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </DefaultThemeContext.Provider>
  );
};

// 6. Context with Callbacks and useMemo
interface CallbackThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const CallbackThemeContext = createContext<
  CallbackThemeContextType | undefined
>(undefined);

const useCallbackTheme = () => {
  const context = useContext(CallbackThemeContext);
  if (!context) {
    throw new Error(
      'useCallbackTheme must be used within CallbackThemeProvider'
    );
  }
  return context;
};

const CallbackThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme]
  );

  return (
    <CallbackThemeContext.Provider value={value}>
      {children}
    </CallbackThemeContext.Provider>
  );
};

// 7. Context with Error Boundaries
interface ErrorThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const ErrorThemeContext = createContext<ErrorThemeContextType | undefined>(
  undefined
);

const useErrorTheme = () => {
  const context = useContext(ErrorThemeContext);
  if (!context) {
    throw new Error('useErrorTheme must be used within ErrorThemeProvider');
  }
  return context;
};

const ErrorThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  if (!theme) {
    throw new Error('Theme not initialized');
  }

  return (
    <ErrorThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ErrorThemeContext.Provider>
  );
};

// 8. Context with Performance Optimization
interface PerformanceThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const PerformanceThemeContext = createContext<
  PerformanceThemeContextType | undefined
>(undefined);

const usePerformanceTheme = () => {
  const context = useContext(PerformanceThemeContext);
  if (!context) {
    throw new Error(
      'usePerformanceTheme must be used within PerformanceThemeProvider'
    );
  }
  return context;
};

const PerformanceThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const contextValue = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme]
  );

  return (
    <PerformanceThemeContext.Provider value={contextValue}>
      {children}
    </PerformanceThemeContext.Provider>
  );
};

// 9. Context with Multiple Values
interface AppContextType {
  user: { name: string; email: string } | null;
  setUser: (user: { name: string; email: string } | null) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  language: 'en' | 'es' | 'fr';
  setLanguage: (language: 'en' | 'es' | 'fr') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'en' | 'es' | 'fr'>('en');

  const value = {
    user,
    setUser,
    theme,
    setTheme,
    language,
    setLanguage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// 10. Context with Subscriptions
interface SubscriptionThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  subscribe: (callback: (theme: 'light' | 'dark') => void) => () => void;
}

const SubscriptionThemeContext = createContext<
  SubscriptionThemeContextType | undefined
>(undefined);

const useSubscriptionTheme = () => {
  const context = useContext(SubscriptionThemeContext);
  if (!context) {
    throw new Error(
      'useSubscriptionTheme must be used within SubscriptionThemeProvider'
    );
  }
  return context;
};

const SubscriptionThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [subscribers, setSubscribers] = useState<
    Array<(theme: 'light' | 'dark') => void>
  >([]);

  const subscribe = useCallback(
    (callback: (theme: 'light' | 'dark') => void) => {
      setSubscribers(prev => [...prev, callback]);
      return () => {
        setSubscribers(prev => prev.filter(sub => sub !== callback));
      };
    },
    []
  );

  const notifySubscribers = useCallback(() => {
    subscribers.forEach(callback => callback(theme));
  }, [subscribers, theme]);

  useEffect(() => {
    notifySubscribers();
  }, [theme, notifySubscribers]);

  return (
    <SubscriptionThemeContext.Provider value={{ theme, setTheme, subscribe }}>
      {children}
    </SubscriptionThemeContext.Provider>
  );
};

// UI Components for new contexts
const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h4>Language Context Demo</h4>
      <p>
        {t('welcome')} - {t('hello')} - {t('goodbye')}
      </p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => setLanguage('en')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: language === 'en' ? '#3b82f6' : '#e5e7eb',
            color: language === 'en' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          English
        </button>
        <button
          onClick={() => setLanguage('es')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: language === 'es' ? '#3b82f6' : '#e5e7eb',
            color: language === 'es' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Español
        </button>
        <button
          onClick={() => setLanguage('fr')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: language === 'fr' ? '#3b82f6' : '#e5e7eb',
            color: language === 'fr' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Français
        </button>
      </div>
    </div>
  );
};

// Additional UI Components for all context patterns
const DefaultThemeDemo = () => {
  const { theme, toggleTheme } = useDefaultTheme();

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h4>Context with Default Values</h4>
      <p>
        Current theme: <strong>{theme}</strong>
      </p>
      <button
        onClick={toggleTheme}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: theme === 'light' ? '#1f2937' : '#f3f4f6',
          color: theme === 'light' ? 'white' : '#1f2937',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Switch to {theme === 'light' ? 'Dark' : 'Light'}
      </button>
      <p
        style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}
      >
        This context has default values, so it won't throw errors if used
        outside provider
      </p>
    </div>
  );
};

const CallbackThemeDemo = () => {
  const { theme, toggleTheme } = useCallbackTheme();

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h4>Context with Callbacks and useMemo</h4>
      <p>
        Current theme: <strong>{theme}</strong>
      </p>
      <button
        onClick={toggleTheme}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: theme === 'light' ? '#1f2937' : '#f3f4f6',
          color: theme === 'light' ? 'white' : '#1f2937',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Switch to {theme === 'light' ? 'Dark' : 'Light'}
      </button>
      <p
        style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}
      >
        Uses useCallback and useMemo for performance optimization
      </p>
    </div>
  );
};

const ErrorThemeDemo = () => {
  const { theme, setTheme } = useErrorTheme();

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h4>Context with Error Boundaries</h4>
      <p>
        Current theme: <strong>{theme}</strong>
      </p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => setTheme('light')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: theme === 'light' ? '#3b82f6' : '#e5e7eb',
            color: theme === 'light' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Light
        </button>
        <button
          onClick={() => setTheme('dark')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: theme === 'dark' ? '#3b82f6' : '#e5e7eb',
            color: theme === 'dark' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Dark
        </button>
      </div>
      <p
        style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}
      >
        Throws error if theme is not initialized
      </p>
    </div>
  );
};

const PerformanceThemeDemo = () => {
  const { theme, setTheme } = usePerformanceTheme();

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h4>Context with Performance Optimization</h4>
      <p>
        Current theme: <strong>{theme}</strong>
      </p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => setTheme('light')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: theme === 'light' ? '#3b82f6' : '#e5e7eb',
            color: theme === 'light' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Light
        </button>
        <button
          onClick={() => setTheme('dark')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: theme === 'dark' ? '#3b82f6' : '#e5e7eb',
            color: theme === 'dark' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Dark
        </button>
      </div>
      <p
        style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}
      >
        Uses useMemo to prevent unnecessary re-renders
      </p>
    </div>
  );
};

const AppContextDemo = () => {
  const { user, setUser, theme, setTheme, language, setLanguage } = useApp();

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h4>Context with Multiple Values</h4>
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div>
          <h5>
            User: {user ? `${user.name} (${user.email})` : 'Not logged in'}
          </h5>
          {!user ? (
            <button
              onClick={() =>
                setUser({ name: 'John Doe', email: 'john@example.com' })
              }
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => setUser(null)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          )}
        </div>

        <div>
          <h5>Theme: {theme}</h5>
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: theme === 'light' ? '#1f2937' : '#f3f4f6',
              color: theme === 'light' ? 'white' : '#1f2937',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Toggle Theme
          </button>
        </div>

        <div>
          <h5>Language: {language}</h5>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setLanguage('en')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: language === 'en' ? '#3b82f6' : '#e5e7eb',
                color: language === 'en' ? 'white' : '#374151',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('es')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: language === 'es' ? '#3b82f6' : '#e5e7eb',
                color: language === 'es' ? 'white' : '#374151',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              ES
            </button>
            <button
              onClick={() => setLanguage('fr')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: language === 'fr' ? '#3b82f6' : '#e5e7eb',
                color: language === 'fr' ? 'white' : '#374151',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              FR
            </button>
          </div>
        </div>
      </div>
      <p
        style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}
      >
        Single context managing multiple related values
      </p>
    </div>
  );
};

const SubscriptionThemeDemo = () => {
  const { theme, setTheme, subscribe } = useSubscriptionTheme();
  const [subscriptionCount, setSubscriptionCount] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribe(newTheme => {
      console.log('Theme changed to:', newTheme);
      setSubscriptionCount(prev => prev + 1);
    });

    return unsubscribe;
  }, [subscribe]);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h4>Context with Subscriptions</h4>
      <p>
        Current theme: <strong>{theme}</strong>
      </p>
      <p>
        Subscription notifications: <strong>{subscriptionCount}</strong>
      </p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => setTheme('light')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: theme === 'light' ? '#3b82f6' : '#e5e7eb',
            color: theme === 'light' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Light
        </button>
        <button
          onClick={() => setTheme('dark')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: theme === 'dark' ? '#3b82f6' : '#e5e7eb',
            color: theme === 'dark' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Dark
        </button>
      </div>
      <p
        style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}
      >
        Check console for subscription notifications
      </p>
    </div>
  );
};

const CounterWithHistory = () => {
  const { state, dispatch } = useCounter();

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h4>Counter Context with useReducer</h4>
      <p>Count: {state.count}</p>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <button
          onClick={() => dispatch({ type: 'INCREMENT' })}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          +
        </button>
        <button
          onClick={() => dispatch({ type: 'DECREMENT' })}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          -
        </button>
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </div>
      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
        History: {state.history.slice(-5).join(', ')}
      </div>
    </div>
  );
};

const SettingsPanel = () => {
  const { settings, updateSetting } = useSettings();

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h4>Settings Context with Local Storage</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={e => updateSetting('notifications', e.target.checked)}
          />
          Notifications
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={settings.sound}
            onChange={e => updateSetting('sound', e.target.checked)}
          />
          Sound
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={settings.autoSave}
            onChange={e => updateSetting('autoSave', e.target.checked)}
          />
          Auto Save
        </label>
      </div>
      <p
        style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}
      >
        Settings persist in localStorage
      </p>
    </div>
  );
};

const NotificationDemo = () => {
  const { addNotification } = useNotifications();

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h4>Notification Context Demo</h4>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => addNotification('Success message!', 'success')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Success
        </button>
        <button
          onClick={() => addNotification('Error message!', 'error')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Error
        </button>
        <button
          onClick={() => addNotification('Info message!', 'info')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Info
        </button>
      </div>
    </div>
  );
};

const NotificationList = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        maxWidth: '300px',
      }}
    >
      {notifications.map(notification => (
        <div
          key={notification.id}
          style={{
            padding: '1rem',
            marginBottom: '0.5rem',
            borderRadius: '8px',
            backgroundColor:
              notification.type === 'success'
                ? '#d1fae5'
                : notification.type === 'error'
                  ? '#fee2e2'
                  : '#dbeafe',
            color:
              notification.type === 'success'
                ? '#065f46'
                : notification.type === 'error'
                  ? '#991b1b'
                  : '#1e40af',
            border: `1px solid ${
              notification.type === 'success'
                ? '#a7f3d0'
                : notification.type === 'error'
                  ? '#fca5a5'
                  : '#93c5fd'
            }`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{notification.message}</span>
          <button
            onClick={() => removeNotification(notification.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem',
              marginLeft: '0.5rem',
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

const ContextAPI = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <LanguageProvider>
          <CounterProvider>
            <SettingsProvider>
              <NotificationProvider>
                <DefaultThemeProvider>
                  <CallbackThemeProvider>
                    <ErrorThemeProvider>
                      <PerformanceThemeProvider>
                        <AppProvider>
                          <SubscriptionThemeProvider>
                            <div
                              style={{ display: 'flex', minHeight: '100vh' }}
                            >
                              {/* Left side - Content */}
                              <div style={{ flex: 1, padding: '2rem' }}>
                                <h1 className="heading-primary">
                                  Context API in React
                                </h1>
                                <p
                                  style={{
                                    fontSize: '1.125rem',
                                    color: 'var(--text-secondary)',
                                    marginBottom: '2rem',
                                  }}
                                >
                                  Learn how to use React Context API for global
                                  state management and prop drilling avoidance.
                                </p>

                                {/* Important Context API Concepts */}
                                <div
                                  className="card"
                                  style={{
                                    padding: '2rem',
                                    marginBottom: '2rem',
                                  }}
                                >
                                  <h2 className="heading-secondary">
                                    🎯 Important Context API Concepts
                                  </h2>

                                  <div
                                    style={{
                                      display: 'grid',
                                      gridTemplateColumns:
                                        'repeat(auto-fit, minmax(300px, 1fr))',
                                      gap: '1.5rem',
                                      marginTop: '1rem',
                                    }}
                                  >
                                    {/* Context Basics */}
                                    <div
                                      style={{
                                        padding: '1.5rem',
                                        background:
                                          'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                                        borderRadius: '12px',
                                        border: '2px solid #3b82f6',
                                      }}
                                    >
                                      <h3
                                        style={{
                                          color: '#1e40af',
                                          marginBottom: '1rem',
                                          fontSize: '1.125rem',
                                        }}
                                      >
                                        🌐 Context Basics
                                      </h3>
                                      <div
                                        style={{
                                          fontSize: '0.875rem',
                                          lineHeight: '1.6',
                                        }}
                                      >
                                        <ul style={{ paddingLeft: '1.5rem' }}>
                                          <li>
                                            <strong>createContext:</strong>{' '}
                                            Create a context object
                                          </li>
                                          <li>
                                            <strong>Provider:</strong> Provide
                                            values to consumers
                                          </li>
                                          <li>
                                            <strong>Consumer:</strong> Consume
                                            context values
                                          </li>
                                          <li>
                                            <strong>useContext:</strong> Hook to
                                            access context
                                          </li>
                                          <li>
                                            <strong>Default value:</strong>{' '}
                                            Fallback when no provider
                                          </li>
                                          <li>
                                            <strong>Context scope:</strong>{' '}
                                            Values available to children
                                          </li>
                                        </ul>
                                      </div>
                                    </div>

                                    {/* Context Patterns */}
                                    <div
                                      style={{
                                        padding: '1.5rem',
                                        background:
                                          'linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%)',
                                        borderRadius: '12px',
                                        border: '2px solid #10b981',
                                      }}
                                    >
                                      <h3
                                        style={{
                                          color: '#047857',
                                          marginBottom: '1rem',
                                          fontSize: '1.125rem',
                                        }}
                                      >
                                        📊 Context Patterns
                                      </h3>
                                      <div
                                        style={{
                                          fontSize: '0.875rem',
                                          lineHeight: '1.6',
                                        }}
                                      >
                                        <ul style={{ paddingLeft: '1.5rem' }}>
                                          <li>
                                            <strong>Single Context:</strong> One
                                            context for one concern
                                          </li>
                                          <li>
                                            <strong>Multiple Contexts:</strong>{' '}
                                            Separate contexts for different
                                            concerns
                                          </li>
                                          <li>
                                            <strong>
                                              Context with Reducer:
                                            </strong>{' '}
                                            Complex state management
                                          </li>
                                          <li>
                                            <strong>
                                              Context with Callbacks:
                                            </strong>{' '}
                                            Pass functions through context
                                          </li>
                                          <li>
                                            <strong>
                                              Context Composition:
                                            </strong>{' '}
                                            Combine multiple contexts
                                          </li>
                                          <li>
                                            <strong>
                                              Context Optimization:
                                            </strong>{' '}
                                            Prevent unnecessary re-renders
                                          </li>
                                        </ul>
                                      </div>
                                    </div>

                                    {/* Performance Considerations */}
                                    <div
                                      style={{
                                        padding: '1.5rem',
                                        background:
                                          'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
                                        borderRadius: '12px',
                                        border: '2px solid #ef4444',
                                      }}
                                    >
                                      <h3
                                        style={{
                                          color: '#dc2626',
                                          marginBottom: '1rem',
                                          fontSize: '1.125rem',
                                        }}
                                      >
                                        ⚡ Performance Tips
                                      </h3>
                                      <div
                                        style={{
                                          fontSize: '0.875rem',
                                          lineHeight: '1.6',
                                        }}
                                      >
                                        <ul style={{ paddingLeft: '1.5rem' }}>
                                          <li>
                                            <strong>
                                              Memoize context value:
                                            </strong>{' '}
                                            Use useMemo for provider value
                                          </li>
                                          <li>
                                            <strong>Split contexts:</strong>{' '}
                                            Avoid large context objects
                                          </li>
                                          <li>
                                            <strong>Use React.memo:</strong>{' '}
                                            Prevent unnecessary re-renders
                                          </li>
                                          <li>
                                            <strong>
                                              Context subscriptions:
                                            </strong>{' '}
                                            Subscribe only to needed values
                                          </li>
                                          <li>
                                            <strong>Lazy context:</strong>{' '}
                                            Create context only when needed
                                          </li>
                                          <li>
                                            <strong>Context boundaries:</strong>{' '}
                                            Limit context scope
                                          </li>
                                        </ul>
                                      </div>
                                    </div>

                                    {/* Context vs Other Solutions */}
                                    <div
                                      style={{
                                        padding: '1.5rem',
                                        background:
                                          'linear-gradient(135deg, #fffbeb 0%, #fed7aa 100%)',
                                        borderRadius: '12px',
                                        border: '2px solid #f59e0b',
                                      }}
                                    >
                                      <h3
                                        style={{
                                          color: '#92400e',
                                          marginBottom: '1rem',
                                          fontSize: '1.125rem',
                                        }}
                                      >
                                        🔄 Context vs Alternatives
                                      </h3>
                                      <div
                                        style={{
                                          fontSize: '0.875rem',
                                          lineHeight: '1.6',
                                        }}
                                      >
                                        <ul style={{ paddingLeft: '1.5rem' }}>
                                          <li>
                                            <strong>Props drilling:</strong>{' '}
                                            Pass props through multiple levels
                                          </li>
                                          <li>
                                            <strong>Redux:</strong> External
                                            state management library
                                          </li>
                                          <li>
                                            <strong>Zustand:</strong>{' '}
                                            Lightweight state management
                                          </li>
                                          <li>
                                            <strong>Recoil:</strong> Facebook's
                                            experimental state library
                                          </li>
                                          <li>
                                            <strong>Jotai:</strong> Atomic state
                                            management
                                          </li>
                                          <li>
                                            <strong>Valtio:</strong> Proxy-based
                                            state management
                                          </li>
                                        </ul>
                                      </div>
                                    </div>

                                    {/* Best Practices */}
                                    <div
                                      style={{
                                        padding: '1.5rem',
                                        background:
                                          'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                                        borderRadius: '12px',
                                        border: '2px solid #8b5cf6',
                                      }}
                                    >
                                      <h3
                                        style={{
                                          color: '#7c3aed',
                                          marginBottom: '1rem',
                                          fontSize: '1.125rem',
                                        }}
                                      >
                                        ✅ Best Practices
                                      </h3>
                                      <div
                                        style={{
                                          fontSize: '0.875rem',
                                          lineHeight: '1.6',
                                        }}
                                      >
                                        <ul style={{ paddingLeft: '1.5rem' }}>
                                          <li>
                                            <strong>
                                              Keep contexts focused:
                                            </strong>{' '}
                                            One concern per context
                                          </li>
                                          <li>
                                            <strong>
                                              Provide meaningful defaults:
                                            </strong>{' '}
                                            Help with testing
                                          </li>
                                          <li>
                                            <strong>Use TypeScript:</strong>{' '}
                                            Type context values properly
                                          </li>
                                          <li>
                                            <strong>Error boundaries:</strong>{' '}
                                            Handle context errors gracefully
                                          </li>
                                          <li>
                                            <strong>Testing:</strong> Mock
                                            contexts for component tests
                                          </li>
                                          <li>
                                            <strong>Documentation:</strong>{' '}
                                            Document context usage
                                          </li>
                                        </ul>
                                      </div>
                                    </div>

                                    {/* Common Use Cases */}
                                    <div
                                      style={{
                                        padding: '1.5rem',
                                        background:
                                          'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                                        borderRadius: '12px',
                                        border: '2px solid #10b981',
                                      }}
                                    >
                                      <h3
                                        style={{
                                          color: '#047857',
                                          marginBottom: '1rem',
                                          fontSize: '1.125rem',
                                        }}
                                      >
                                        🎯 Common Use Cases
                                      </h3>
                                      <div
                                        style={{
                                          fontSize: '0.875rem',
                                          lineHeight: '1.6',
                                        }}
                                      >
                                        <ul style={{ paddingLeft: '1.5rem' }}>
                                          <li>
                                            <strong>Theme management:</strong>{' '}
                                            Light/dark mode switching
                                          </li>
                                          <li>
                                            <strong>
                                              User authentication:
                                            </strong>{' '}
                                            User state and auth methods
                                          </li>
                                          <li>
                                            <strong>
                                              Language/localization:
                                            </strong>{' '}
                                            Internationalization
                                          </li>
                                          <li>
                                            <strong>
                                              Application settings:
                                            </strong>{' '}
                                            User preferences
                                          </li>
                                          <li>
                                            <strong>Notifications:</strong>{' '}
                                            Toast messages and alerts
                                          </li>
                                          <li>
                                            <strong>Feature flags:</strong> A/B
                                            testing and feature toggles
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Context API Overview */}
                                <div
                                  className="card"
                                  style={{
                                    padding: '2rem',
                                    marginBottom: '2rem',
                                  }}
                                >
                                  <h2 className="heading-secondary">
                                    Context API Overview
                                  </h2>
                                  <div
                                    style={{
                                      display: 'grid',
                                      gridTemplateColumns:
                                        'repeat(auto-fit, minmax(250px, 1fr))',
                                      gap: '1rem',
                                      marginTop: '1rem',
                                    }}
                                  >
                                    <div
                                      style={{
                                        padding: '1rem',
                                        background: '#eff6ff',
                                        borderRadius: '8px',
                                      }}
                                    >
                                      <h4
                                        style={{
                                          color: '#1e40af',
                                          marginBottom: '0.5rem',
                                        }}
                                      >
                                        🌐 Context Creation
                                      </h4>
                                      <p style={{ fontSize: '0.875rem' }}>
                                        createContext, default values,
                                        TypeScript
                                      </p>
                                    </div>
                                    <div
                                      style={{
                                        padding: '1rem',
                                        background: '#f0fdf4',
                                        borderRadius: '8px',
                                      }}
                                    >
                                      <h4
                                        style={{
                                          color: '#059669',
                                          marginBottom: '0.5rem',
                                        }}
                                      >
                                        📦 Context Providers
                                      </h4>
                                      <p style={{ fontSize: '0.875rem' }}>
                                        Provider components, value prop, state
                                        management
                                      </p>
                                    </div>
                                    <div
                                      style={{
                                        padding: '1rem',
                                        background: '#fef2f2',
                                        borderRadius: '8px',
                                      }}
                                    >
                                      <h4
                                        style={{
                                          color: '#dc2626',
                                          marginBottom: '0.5rem',
                                        }}
                                      >
                                        🎯 Context Consumers
                                      </h4>
                                      <p style={{ fontSize: '0.875rem' }}>
                                        useContext hook, Consumer component
                                      </p>
                                    </div>
                                    <div
                                      style={{
                                        padding: '1rem',
                                        background: '#fffbeb',
                                        borderRadius: '8px',
                                      }}
                                    >
                                      <h4
                                        style={{
                                          color: '#92400e',
                                          marginBottom: '0.5rem',
                                        }}
                                      >
                                        ⚡ Performance
                                      </h4>
                                      <p style={{ fontSize: '0.875rem' }}>
                                        Optimization, memoization, re-render
                                        prevention
                                      </p>
                                    </div>
                                    <div
                                      style={{
                                        padding: '1rem',
                                        background: '#f3e8ff',
                                        borderRadius: '8px',
                                      }}
                                    >
                                      <h4
                                        style={{
                                          color: '#7c3aed',
                                          marginBottom: '0.5rem',
                                        }}
                                      >
                                        🔧 Advanced Patterns
                                      </h4>
                                      <p style={{ fontSize: '0.875rem' }}>
                                        Multiple contexts, context composition,
                                        custom hooks
                                      </p>
                                    </div>
                                    <div
                                      style={{
                                        padding: '1rem',
                                        background: '#ecfdf5',
                                        borderRadius: '8px',
                                      }}
                                    >
                                      <h4
                                        style={{
                                          color: '#047857',
                                          marginBottom: '0.5rem',
                                        }}
                                      >
                                        ✅ Best Practices
                                      </h4>
                                      <p style={{ fontSize: '0.875rem' }}>
                                        Error handling, testing, documentation
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div
                                  className="card"
                                  style={{
                                    padding: '2rem',
                                    marginBottom: '2rem',
                                  }}
                                >
                                  <h2 className="heading-secondary">
                                    Theme Context Demo
                                  </h2>
                                  <p style={{ marginBottom: '1rem' }}>
                                    The theme context provides a global theme
                                    state that can be accessed by any component
                                    in the tree.
                                  </p>
                                  <ThemeToggle />
                                  <ThemedComponent />
                                </div>

                                <div
                                  className="card"
                                  style={{
                                    padding: '2rem',
                                    marginBottom: '2rem',
                                  }}
                                >
                                  <h2 className="heading-secondary">
                                    User Context Demo
                                  </h2>
                                  <p style={{ marginBottom: '1rem' }}>
                                    The user context manages authentication
                                    state globally.
                                  </p>
                                  <LoginForm />
                                  <UserProfile />
                                </div>

                                <div
                                  className="card"
                                  style={{
                                    padding: '2rem',
                                    marginBottom: '2rem',
                                  }}
                                >
                                  <h2 className="heading-secondary">
                                    Language Context Demo
                                  </h2>
                                  <p style={{ marginBottom: '1rem' }}>
                                    The language context manages
                                    internationalization with translations.
                                  </p>
                                  <LanguageSelector />
                                </div>

                                <div
                                  className="card"
                                  style={{
                                    padding: '2rem',
                                    marginBottom: '2rem',
                                  }}
                                >
                                  <h2 className="heading-secondary">
                                    Counter Context with useReducer
                                  </h2>
                                  <p style={{ marginBottom: '1rem' }}>
                                    The counter context demonstrates complex
                                    state management with useReducer.
                                  </p>
                                  <CounterWithHistory />
                                </div>

                                <div
                                  className="card"
                                  style={{
                                    padding: '2rem',
                                    marginBottom: '2rem',
                                  }}
                                >
                                  <h2 className="heading-secondary">
                                    Settings Context with Local Storage
                                  </h2>
                                  <p style={{ marginBottom: '1rem' }}>
                                    The settings context persists data in
                                    localStorage.
                                  </p>
                                  <SettingsPanel />
                                </div>

                                <div
                                  className="card"
                                  style={{
                                    padding: '2rem',
                                    marginBottom: '2rem',
                                  }}
                                >
                                  <h2 className="heading-secondary">
                                    Notification Context
                                  </h2>
                                  <p style={{ marginBottom: '1rem' }}>
                                    The notification context manages global
                                    notifications with auto-dismiss.
                                  </p>
                                  <NotificationDemo />
                                </div>

                                <div
                                  className="card"
                                  style={{
                                    padding: '2rem',
                                    marginBottom: '2rem',
                                  }}
                                >
                                  <h2 className="heading-secondary">
                                    Advanced Context Patterns
                                  </h2>
                                  <p style={{ marginBottom: '1rem' }}>
                                    Advanced context patterns and optimizations.
                                  </p>

                                  <div style={{ display: 'grid', gap: '2rem' }}>
                                    <DefaultThemeDemo />
                                    <CallbackThemeDemo />
                                    <ErrorThemeDemo />
                                    <PerformanceThemeDemo />
                                    <AppContextDemo />
                                    <SubscriptionThemeDemo />
                                  </div>
                                </div>

                                {/* Interview Tips & Common Questions */}
                                <div
                                  className="card"
                                  style={{
                                    padding: '2rem',
                                    marginBottom: '2rem',
                                    background:
                                      'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                                    border: '2px solid #f59e0b',
                                  }}
                                >
                                  <h2 className="heading-secondary">
                                    💡 Interview Tips & Common Questions
                                  </h2>

                                  <div
                                    style={{
                                      display: 'grid',
                                      gridTemplateColumns:
                                        'repeat(auto-fit, minmax(400px, 1fr))',
                                      gap: '2rem',
                                      marginTop: '1.5rem',
                                    }}
                                  >
                                    {/* Common Questions */}
                                    <div
                                      style={{
                                        padding: '1.5rem',
                                        background: 'rgba(255, 255, 255, 0.8)',
                                        borderRadius: '12px',
                                        border: '2px solid #f59e0b',
                                      }}
                                    >
                                      <h3
                                        style={{
                                          color: '#d97706',
                                          marginBottom: '1rem',
                                          fontSize: '1.125rem',
                                        }}
                                      >
                                        ❓ Common Interview Questions
                                      </h3>
                                      <div
                                        style={{
                                          fontSize: '0.875rem',
                                          lineHeight: '1.6',
                                        }}
                                      >
                                        <ul style={{ paddingLeft: '1.5rem' }}>
                                          <li>
                                            <strong>
                                              What is Context API?
                                            </strong>{' '}
                                            - Explain it's for sharing data
                                            across components without prop
                                            drilling
                                          </li>
                                          <li>
                                            <strong>
                                              When to use Context vs Redux?
                                            </strong>{' '}
                                            - Context for simple state, Redux
                                            for complex state management
                                          </li>
                                          <li>
                                            <strong>
                                              How to avoid Context re-renders?
                                            </strong>{' '}
                                            - Use useMemo, useCallback, and
                                            split contexts
                                          </li>
                                          <li>
                                            <strong>
                                              What are Context providers?
                                            </strong>{' '}
                                            - Components that provide values to
                                            consumers
                                          </li>
                                          <li>
                                            <strong>
                                              How to handle Context errors?
                                            </strong>{' '}
                                            - Use error boundaries and default
                                            values
                                          </li>
                                          <li>
                                            <strong>
                                              Context vs Local State?
                                            </strong>{' '}
                                            - Context for global state, useState
                                            for local state
                                          </li>
                                          <li>
                                            <strong>
                                              Performance implications?
                                            </strong>{' '}
                                            - Context can cause unnecessary
                                            re-renders
                                          </li>
                                          <li>
                                            <strong>
                                              Testing Context components?
                                            </strong>{' '}
                                            - Wrap with providers in tests
                                          </li>
                                        </ul>
                                      </div>
                                    </div>

                                    {/* Key Points */}
                                    <div
                                      style={{
                                        padding: '1.5rem',
                                        background: 'rgba(255, 255, 255, 0.8)',
                                        borderRadius: '12px',
                                        border: '2px solid #f59e0b',
                                      }}
                                    >
                                      <h3
                                        style={{
                                          color: '#d97706',
                                          marginBottom: '1rem',
                                          fontSize: '1.125rem',
                                        }}
                                      >
                                        🎯 Key Points to Remember
                                      </h3>
                                      <div
                                        style={{
                                          fontSize: '0.875rem',
                                          lineHeight: '1.6',
                                        }}
                                      >
                                        <ul style={{ paddingLeft: '1.5rem' }}>
                                          <li>
                                            <strong>
                                              Context is not a state management
                                              library
                                            </strong>{' '}
                                            - It's for data sharing
                                          </li>
                                          <li>
                                            <strong>
                                              Always provide default values
                                            </strong>{' '}
                                            - Prevents undefined errors
                                          </li>
                                          <li>
                                            <strong>Use custom hooks</strong> -
                                            Encapsulate context logic
                                          </li>
                                          <li>
                                            <strong>
                                              Split contexts by domain
                                            </strong>{' '}
                                            - Avoid single large context
                                          </li>
                                          <li>
                                            <strong>
                                              Memoize context values
                                            </strong>{' '}
                                            - Prevent unnecessary re-renders
                                          </li>
                                          <li>
                                            <strong>
                                              Handle missing providers
                                            </strong>{' '}
                                            - Use error boundaries
                                          </li>
                                          <li>
                                            <strong>
                                              Consider performance impact
                                            </strong>{' '}
                                            - Context triggers re-renders
                                          </li>
                                          <li>
                                            <strong>Use TypeScript</strong> -
                                            Type safety for context values
                                          </li>
                                        </ul>
                                      </div>
                                    </div>

                                    {/* Advanced Topics */}
                                    <div
                                      style={{
                                        padding: '1.5rem',
                                        background: 'rgba(255, 255, 255, 0.8)',
                                        borderRadius: '12px',
                                        border: '2px solid #f59e0b',
                                      }}
                                    >
                                      <h3
                                        style={{
                                          color: '#d97706',
                                          marginBottom: '1rem',
                                          fontSize: '1.125rem',
                                        }}
                                      >
                                        🚀 Advanced Topics
                                      </h3>
                                      <div
                                        style={{
                                          fontSize: '0.875rem',
                                          lineHeight: '1.6',
                                        }}
                                      >
                                        <ul style={{ paddingLeft: '1.5rem' }}>
                                          <li>
                                            <strong>
                                              Context with useReducer
                                            </strong>{' '}
                                            - Complex state logic
                                          </li>
                                          <li>
                                            <strong>Context splitting</strong> -
                                            Separate contexts by concern
                                          </li>
                                          <li>
                                            <strong>
                                              Subscription pattern
                                            </strong>{' '}
                                            - Custom event system
                                          </li>
                                          <li>
                                            <strong>
                                              Context with middleware
                                            </strong>{' '}
                                            - Custom logic in providers
                                          </li>
                                          <li>
                                            <strong>Context composition</strong>{' '}
                                            - Combining multiple contexts
                                          </li>
                                          <li>
                                            <strong>
                                              Context with persistence
                                            </strong>{' '}
                                            - localStorage integration
                                          </li>
                                          <li>
                                            <strong>
                                              Context testing strategies
                                            </strong>{' '}
                                            - Mock providers
                                          </li>
                                          <li>
                                            <strong>
                                              Context performance optimization
                                            </strong>{' '}
                                            - Selective updates
                                          </li>
                                        </ul>
                                      </div>
                                    </div>

                                    {/* Common Pitfalls */}
                                    <div
                                      style={{
                                        padding: '1.5rem',
                                        background: 'rgba(255, 255, 255, 0.8)',
                                        borderRadius: '12px',
                                        border: '2px solid #f59e0b',
                                      }}
                                    >
                                      <h3
                                        style={{
                                          color: '#d97706',
                                          marginBottom: '1rem',
                                          fontSize: '1.125rem',
                                        }}
                                      >
                                        ⚠️ Common Pitfalls
                                      </h3>
                                      <div
                                        style={{
                                          fontSize: '0.875rem',
                                          lineHeight: '1.6',
                                        }}
                                      >
                                        <ul style={{ paddingLeft: '1.5rem' }}>
                                          <li>
                                            <strong>
                                              Creating context inside components
                                            </strong>{' '}
                                            - Causes infinite re-renders
                                          </li>
                                          <li>
                                            <strong>
                                              Not memoizing context values
                                            </strong>{' '}
                                            - Triggers unnecessary updates
                                          </li>
                                          <li>
                                            <strong>
                                              Single large context
                                            </strong>{' '}
                                            - Affects performance
                                          </li>
                                          <li>
                                            <strong>
                                              Missing error handling
                                            </strong>{' '}
                                            - Undefined context values
                                          </li>
                                          <li>
                                            <strong>
                                              Not using TypeScript
                                            </strong>{' '}
                                            - Runtime errors
                                          </li>
                                          <li>
                                            <strong>
                                              Forgetting to provide context
                                            </strong>{' '}
                                            - Components can't access values
                                          </li>
                                          <li>
                                            <strong>
                                              Circular dependencies
                                            </strong>{' '}
                                            - Contexts depending on each other
                                          </li>
                                          <li>
                                            <strong>Over-engineering</strong> -
                                            Using Context for everything
                                          </li>
                                        </ul>
                                      </div>
                                    </div>

                                    {/* Context Libraries */}
                                    <div
                                      style={{
                                        padding: '1.5rem',
                                        background: 'rgba(255, 255, 255, 0.8)',
                                        borderRadius: '12px',
                                        border: '2px solid #f59e0b',
                                      }}
                                    >
                                      <h3
                                        style={{
                                          color: '#d97706',
                                          marginBottom: '1rem',
                                          fontSize: '1.125rem',
                                        }}
                                      >
                                        📚 Related Libraries & Patterns
                                      </h3>
                                      <div
                                        style={{
                                          fontSize: '0.875rem',
                                          lineHeight: '1.6',
                                        }}
                                      >
                                        <ul style={{ paddingLeft: '1.5rem' }}>
                                          <li>
                                            <strong>Redux</strong> - Complex
                                            state management
                                          </li>
                                          <li>
                                            <strong>Zustand</strong> -
                                            Lightweight state management
                                          </li>
                                          <li>
                                            <strong>Jotai</strong> - Atomic
                                            state management
                                          </li>
                                          <li>
                                            <strong>Recoil</strong> - Facebook's
                                            state management
                                          </li>
                                          <li>
                                            <strong>XState</strong> - State
                                            machines
                                          </li>
                                          <li>
                                            <strong>React Query</strong> -
                                            Server state management
                                          </li>
                                          <li>
                                            <strong>SWR</strong> - Data fetching
                                            and caching
                                          </li>
                                          <li>
                                            <strong>Custom hooks</strong> -
                                            Encapsulate context logic
                                          </li>
                                        </ul>
                                      </div>
                                    </div>

                                    {/* Context Patterns */}
                                    <div
                                      style={{
                                        padding: '1.5rem',
                                        background: 'rgba(255, 255, 255, 0.8)',
                                        borderRadius: '12px',
                                        border: '2px solid #f59e0b',
                                      }}
                                    >
                                      <h3
                                        style={{
                                          color: '#d97706',
                                          marginBottom: '1rem',
                                          fontSize: '1.125rem',
                                        }}
                                      >
                                        🎨 Context Patterns
                                      </h3>
                                      <div
                                        style={{
                                          fontSize: '0.875rem',
                                          lineHeight: '1.6',
                                        }}
                                      >
                                        <ul style={{ paddingLeft: '1.5rem' }}>
                                          <li>
                                            <strong>Provider Pattern</strong> -
                                            Wrap components with providers
                                          </li>
                                          <li>
                                            <strong>Consumer Pattern</strong> -
                                            Use useContext hook
                                          </li>
                                          <li>
                                            <strong>Compound Components</strong>{' '}
                                            - Related components together
                                          </li>
                                          <li>
                                            <strong>Render Props</strong> - Pass
                                            functions as children
                                          </li>
                                          <li>
                                            <strong>
                                              Higher-Order Components
                                            </strong>{' '}
                                            - Wrap with context
                                          </li>
                                          <li>
                                            <strong>Custom Hooks</strong> -
                                            Encapsulate context logic
                                          </li>
                                          <li>
                                            <strong>Error Boundaries</strong> -
                                            Handle context errors
                                          </li>
                                          <li>
                                            <strong>
                                              Performance Optimization
                                            </strong>{' '}
                                            - Memoization strategies
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Right side - Resizable Code Example */}
                              <ResizableCodePanel>
                                <h3
                                  style={{
                                    color: '#569cd6',
                                    marginBottom: '1rem',
                                  }}
                                >
                                  Context API Code Examples
                                </h3>
                                <pre style={{ margin: 0 }}>
                                  {`// Context API Example
import { createContext, useContext, useState, useReducer, useCallback, useMemo, useEffect } from 'react';

// 1. Basic Context
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  const value = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 2. Context with useReducer
const CounterContext = createContext();

const counterReducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'RESET':
      return { ...state, count: 0 };
    default:
      return state;
  }
};

const CounterProvider = ({ children }) => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0, history: [] });

  const value = useMemo(() => ({
    state,
    dispatch
  }), [state]);

  return (
    <CounterContext.Provider value={value}>
      {children}
    </CounterContext.Provider>
  );
};

// 3. Multiple Contexts
const UserContext = createContext();
const LanguageContext = createContext();

const AppProviders = ({ children }) => (
  <UserProvider>
    <LanguageProvider>
      {children}
    </LanguageProvider>
  </UserProvider>
);

// 4. Custom Hook for Context
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// 5. Context with Local Storage
const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : { notifications: true, sound: false };
  });

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const value = useMemo(() => ({
    settings,
    updateSetting: (key, value) => setSettings(prev => ({ ...prev, [key]: value }))
  }), [settings]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// 6. Context with Error Boundary
class ContextErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Context Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong with context.</div>;
    }
    return this.props.children;
  }
}

// 7. Context with Performance Optimization
const PerformanceThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const contextValue = useMemo(() => ({
    theme,
    setTheme
  }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// 8. Context with Subscriptions
const SubscriptionThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [subscribers, setSubscribers] = useState([]);

  const subscribe = useCallback((callback) => {
    setSubscribers(prev => [...prev, callback]);
    return () => {
      setSubscribers(prev => prev.filter(sub => sub !== callback));
    };
  }, []);

  const notifySubscribers = useCallback(() => {
    subscribers.forEach(callback => callback(theme));
  }, [subscribers, theme]);

  useEffect(() => {
    notifySubscribers();
  }, [theme, notifySubscribers]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, subscribe }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ... (component usage examples as shown in the left panel) ...`}
                                </pre>
                              </ResizableCodePanel>
                            </div>

                            {/* Notification List - Fixed Position */}
                            <NotificationList />
                          </SubscriptionThemeProvider>
                        </AppProvider>
                      </PerformanceThemeProvider>
                    </ErrorThemeProvider>
                  </CallbackThemeProvider>
                </DefaultThemeProvider>
              </NotificationProvider>
            </SettingsProvider>
          </CounterProvider>
        </LanguageProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default ContextAPI;
