import { useState, useEffect, useCallback, useRef } from 'react';
import ResizableCodePanel from './ResizableCodePanel';

// Custom Hook: useLocalStorage
const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
};

// Custom Hook: useDebounce
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Custom Hook: useFetch
const useFetch = <T,>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (Math.random() > 0.3) {
          const mockData = {
            message: 'Data fetched successfully!',
            timestamp: new Date().toISOString(),
          } as T;
          setData(mockData);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// Custom Hook: useClickOutside
const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  handler: () => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

// Removed unused usePrevious hook

// Custom Hook: useToggle
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return { value, toggle, setTrue, setFalse };
};

// Custom Hook: useWindowSize
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Demo Components
const LocalStorageDemo = () => {
  const [name, setName] = useLocalStorage('userName', '');
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h3>useLocalStorage Hook</h3>
      <p style={{ marginBottom: '1rem' }}>
        This data persists across browser sessions.
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Name:
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '1rem',
          }}
          placeholder="Enter your name"
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Theme:
        </label>
        <select
          value={theme}
          onChange={e => setTheme(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '1rem',
          }}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
        Try refreshing the page - the values will persist!
      </p>
    </div>
  );
};

const DebounceDemo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h3>useDebounce Hook</h3>
      <p style={{ marginBottom: '1rem' }}>
        The search term is debounced by 500ms to avoid excessive API calls.
      </p>

      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '0.75rem',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '1rem',
          marginBottom: '1rem',
        }}
        placeholder="Type to search..."
      />

      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
        <p>
          <strong>Current input:</strong> {searchTerm}
        </p>
        <p>
          <strong>Debounced value:</strong> {debouncedSearchTerm}
        </p>
      </div>
    </div>
  );
};

const FetchDemo = () => {
  const { data, loading, error } = useFetch<{
    message: string;
    timestamp: string;
  }>('/api/data');

  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h3>useFetch Hook</h3>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Loading...</p>
        </div>
      )}

      {error && (
        <div
          style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: '#fef2f2',
            color: '#991b1b',
            borderRadius: '8px',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
          <p>
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {data && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
          }}
        >
          <h4 style={{ color: '#166534', marginBottom: '0.5rem' }}>Success!</h4>
          <pre style={{ margin: 0, fontSize: '0.875rem' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

const ClickOutsideDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLButtonElement>(null);

  useClickOutside(dropdownRef as React.RefObject<HTMLElement>, () =>
    setIsOpen(false)
  );

  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h3>useClickOutside Hook</h3>
      <p style={{ marginBottom: '1rem' }}>
        Click outside the dropdown to close it.
      </p>

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          ref={dropdownRef}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Toggle Dropdown
        </button>

        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              padding: '0.5rem',
              minWidth: '150px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              zIndex: 10,
              marginTop: '0.5rem',
            }}
          >
            <div style={{ padding: '0.5rem' }}>Dropdown Item 1</div>
            <div style={{ padding: '0.5rem' }}>Dropdown Item 2</div>
            <div style={{ padding: '0.5rem' }}>Dropdown Item 3</div>
          </div>
        )}
      </div>
    </div>
  );
};

const ToggleDemo = () => {
  const { value: isOn, toggle, setTrue, setFalse } = useToggle(false);

  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h3>useToggle Hook</h3>
      <p style={{ marginBottom: '1rem' }}>
        Current state: <strong>{isOn ? 'ON' : 'OFF'}</strong>
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={toggle}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: isOn ? '#10b981' : '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Toggle
        </button>
        <button
          onClick={setTrue}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Set True
        </button>
        <button
          onClick={setFalse}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Set False
        </button>
      </div>
    </div>
  );
};

const WindowSizeDemo = () => {
  const { width, height } = useWindowSize();

  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h3>useWindowSize Hook</h3>
      <p style={{ marginBottom: '1rem' }}>
        Try resizing your browser window to see the values update.
      </p>

      <div style={{ textAlign: 'center' }}>
        <h4>Window Dimensions</h4>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {width} × {height}
        </p>
      </div>
    </div>
  );
};

const CustomHooks = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left side - Content */}
      <div style={{ flex: 1, padding: '2rem' }}>
        <h1 className="heading-primary">Custom Hooks in React</h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
          }}
        >
          Learn how to create and use custom hooks to extract and reuse
          component logic.
        </p>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">What are Custom Hooks?</h2>
          <p style={{ marginBottom: '1rem' }}>
            Custom hooks are functions that start with "use" and may call other
            hooks. They allow you to extract component logic into reusable
            functions.
          </p>
          <ul style={{ listStyle: 'disc', paddingLeft: '2rem' }}>
            <li>Start with "use" prefix</li>
            <li>Can call other hooks</li>
            <li>Share logic between components</li>
            <li>Keep components clean and focused</li>
            <li>Follow React hooks rules</li>
          </ul>
        </div>

        <LocalStorageDemo />
        <DebounceDemo />
        <FetchDemo />
        <ClickOutsideDemo />
        <ToggleDemo />
        <WindowSizeDemo />
      </div>

      {/* Right side - Resizable Code Example */}
      <ResizableCodePanel>
        <h3 style={{ color: '#569cd6', marginBottom: '1rem' }}>
          Custom Hooks Examples
        </h3>
        <pre style={{ margin: 0 }}>
          {`// 1. useLocalStorage Hook
const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
};

// 2. useDebounce Hook
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// 3. useFetch Hook
const useFetch = <T,>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// 4. useClickOutside Hook
const useClickOutside = (ref: RefObject<HTMLElement>, handler: () => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

// 5. usePrevious Hook
const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

// 6. useToggle Hook
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse };
};

// 7. useWindowSize Hook
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// 8. Using Custom Hooks
const MyComponent = () => {
  const [name, setName] = useLocalStorage('userName', '');
  const [isOpen, setIsOpen] = useToggle(false);
  const { width, height } = useWindowSize();

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={() => setIsOpen.toggle()}>
        {isOpen.value ? 'Close' : 'Open'}
      </button>
      <p>Window: {width} × {height}</p>
    </div>
  );
};

// 9. Custom Hook with Parameters
const useCounter = (initialValue = 0, step = 1) => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(prev => prev + step);
  }, [step]);

  const decrement = useCallback(() => {
    setCount(prev => prev - step);
  }, [step]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  return { count, increment, decrement, reset };
};

// 10. Custom Hook with Dependencies
const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

// 11. Custom Hook with State Management
const useForm = (initialValues: Record<string, any>) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, errors, setErrors, handleChange, reset };
};

// 12. Custom Hook with Event Listeners
const useKeyPress = (targetKey: string) => {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = ({ key }: KeyboardEvent) => {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    };

    const upHandler = ({ key }: KeyboardEvent) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return keyPressed;
};`}
        </pre>
      </ResizableCodePanel>
    </div>
  );
};

export default CustomHooks;
