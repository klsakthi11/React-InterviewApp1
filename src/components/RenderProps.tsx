import { useState, useEffect, type ReactNode } from 'react';
import ResizableCodePanel from './ResizableCodePanel';

// Render Props Components
interface MousePositionProps {
  children: (position: { x: number; y: number }) => ReactNode;
}

const MousePosition = ({ children }: MousePositionProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <>{children(position)}</>;
};

interface CounterProps {
  children: (props: {
    count: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
  }) => ReactNode;
}

const Counter = ({ children }: CounterProps) => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);

  return <>{children({ count, increment, decrement, reset })}</>;
};

interface DataFetcherProps<T> {
  url: string;
  children: (props: {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
  }) => ReactNode;
}

const DataFetcher = <T,>({ url, children }: DataFetcherProps<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchData();
  }, [url]);

  return <>{children({ data, loading, error, refetch: fetchData })}</>;
};

interface ThemeProviderProps {
  children: (props: {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    themeStyles: any;
  }) => ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

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

  return <>{children({ theme, toggleTheme, themeStyles })}</>;
};

interface FormProps {
  initialValues: Record<string, any>;
  children: (props: {
    values: Record<string, any>;
    handleChange: (name: string, value: any) => void;
    handleSubmit: (e: React.FormEvent) => void;
    reset: () => void;
  }) => ReactNode;
}

const Form = ({ initialValues, children }: FormProps) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', values);
  };

  const reset = () => {
    setValues(initialValues);
  };

  return <>{children({ values, handleChange, handleSubmit, reset })}</>;
};

interface WindowSizeProps {
  children: (props: { width: number; height: number }) => ReactNode;
}

const WindowSize = ({ children }: WindowSizeProps) => {
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

  return <>{children(windowSize)}</>;
};

const RenderProps = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left side - Content */}
      <div style={{ flex: 1, padding: '2rem' }}>
        <h1 className="heading-primary">Render Props Pattern</h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
          }}
        >
          Learn how to use the render props pattern to share code between React
          components.
        </p>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">What are Render Props?</h2>
          <p style={{ marginBottom: '1rem' }}>
            Render props is a pattern where a component receives a function as a
            prop and calls it to render something.
          </p>
          <ul style={{ listStyle: 'disc', paddingLeft: '2rem' }}>
            <li>Share logic between components</li>
            <li>Pass functions as props</li>
            <li>Flexible and reusable</li>
            <li>Alternative to HOCs and custom hooks</li>
            <li>Great for complex state management</li>
          </ul>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">Mouse Position Tracker</h2>
          <p style={{ marginBottom: '1rem' }}>
            This component tracks mouse position and renders whatever you pass
            to it.
          </p>
          <MousePosition>
            {({ x, y }) => (
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                <h3>Mouse Position</h3>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  X: {x}, Y: {y}
                </p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Move your mouse to see the coordinates update
                </p>
              </div>
            )}
          </MousePosition>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">Counter with Render Props</h2>
          <p style={{ marginBottom: '1rem' }}>
            This counter component provides state and methods to render custom
            UI.
          </p>
          <Counter>
            {({ count, increment, decrement, reset }) => (
              <div style={{ textAlign: 'center' }}>
                <h3>Counter</h3>
                <p
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                  }}
                >
                  {count}
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    justifyContent: 'center',
                  }}
                >
                  <button
                    onClick={decrement}
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
                    onClick={reset}
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
                  <button
                    onClick={increment}
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
                </div>
              </div>
            )}
          </Counter>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">Data Fetcher</h2>
          <p style={{ marginBottom: '1rem' }}>
            This component handles data fetching and provides loading, error,
            and data states.
          </p>
          <DataFetcher url="/api/data">
            {({ data, loading, error, refetch }) => (
              <div>
                {loading && (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                      ⏳
                    </div>
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
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                      ❌
                    </div>
                    <p>
                      <strong>Error:</strong> {error}
                    </p>
                    <button
                      onClick={refetch}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '1rem',
                      }}
                    >
                      Retry
                    </button>
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
                    <h4 style={{ color: '#166534', marginBottom: '0.5rem' }}>
                      Success!
                    </h4>
                    <pre style={{ margin: 0, fontSize: '0.875rem' }}>
                      {JSON.stringify(data as any, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </DataFetcher>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">Theme Provider</h2>
          <p style={{ marginBottom: '1rem' }}>
            This component provides theme state and styles to its children.
          </p>
          <ThemeProvider>
            {({ theme, toggleTheme, themeStyles }) => (
              <div
                style={{
                  padding: '2rem',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  ...themeStyles[theme],
                }}
              >
                <h3>Themed Component</h3>
                <p>
                  Current theme: <strong>{theme}</strong>
                </p>
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
              </div>
            )}
          </ThemeProvider>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">Form with Render Props</h2>
          <p style={{ marginBottom: '1rem' }}>
            This form component provides form state management.
          </p>
          <Form initialValues={{ name: '', email: '' }}>
            {({ values, handleChange, handleSubmit, reset }) => (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Name:
                  </label>
                  <input
                    type="text"
                    value={values.name}
                    onChange={e => handleChange('name', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                    }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Email:
                  </label>
                  <input
                    type="email"
                    value={values.email}
                    onChange={e => handleChange('email', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="submit"
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
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={reset}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                    }}
                  >
                    Reset
                  </button>
                </div>
              </form>
            )}
          </Form>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">Window Size Tracker</h2>
          <p style={{ marginBottom: '1rem' }}>
            This component tracks window size and provides responsive
            information.
          </p>
          <WindowSize>
            {({ width, height }) => (
              <div style={{ textAlign: 'center' }}>
                <h3>Window Size</h3>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {width} × {height}
                </p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Try resizing your browser window
                </p>
              </div>
            )}
          </WindowSize>
        </div>

        {/* Interview Tips & Common Questions */}
        <div
          className="card"
          style={{
            padding: '2rem',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            border: '2px solid #f59e0b',
          }}
        >
          <h2 className="heading-secondary">
            💡 Interview Tips & Common Questions
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
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
                    <strong>What is the render props pattern?</strong> - Passing
                    a function as a prop to control rendering
                  </li>
                  <li>
                    <strong>When should you use render props?</strong> - When
                    you need to share logic between components
                  </li>
                  <li>
                    <strong>How does render props differ from HOCs?</strong> -
                    Render props use functions, HOCs use component wrapping
                  </li>
                  <li>
                    <strong>What are the drawbacks of render props?</strong> -
                    Can lead to deeply nested code ("wrapper hell")
                  </li>
                  <li>
                    <strong>How do you type render props in TypeScript?</strong>{' '}
                    - Use function types for children props
                  </li>
                  <li>
                    <strong>How do you avoid unnecessary re-renders?</strong> -
                    Memoize functions and use React.memo
                  </li>
                  <li>
                    <strong>What are alternatives to render props?</strong> -
                    HOCs, custom hooks, compound components
                  </li>
                  <li>
                    <strong>How do you test render props components?</strong> -
                    Render with test functions and assert output
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
                    <strong>Render props are functions</strong> - Children as a
                    function
                  </li>
                  <li>
                    <strong>Share logic, not UI</strong> - Keep UI flexible
                  </li>
                  <li>
                    <strong>Can be combined with hooks</strong> - Use hooks
                    inside render props components
                  </li>
                  <li>
                    <strong>TypeScript support</strong> - Use proper types for
                    children
                  </li>
                  <li>
                    <strong>Performance considerations</strong> - Avoid
                    unnecessary re-renders
                  </li>
                  <li>
                    <strong>Test with different children</strong> - Ensure
                    flexibility
                  </li>
                  <li>
                    <strong>Use memoization</strong> - Memoize functions passed
                    as props
                  </li>
                  <li>
                    <strong>Prefer hooks for new code</strong> - Hooks are more
                    idiomatic in modern React
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
                    <strong>Compound components</strong> - Related pattern for
                    sharing logic
                  </li>
                  <li>
                    <strong>Dynamic children</strong> - Render different UIs
                    based on state
                  </li>
                  <li>
                    <strong>Context with render props</strong> - Combine context
                    and render props
                  </li>
                  <li>
                    <strong>Performance optimization</strong> - Memoize children
                    functions
                  </li>
                  <li>
                    <strong>Testing strategies</strong> - Test with various
                    children
                  </li>
                  <li>
                    <strong>TypeScript generics</strong> - Type-safe render
                    props
                  </li>
                  <li>
                    <strong>Integration with hooks</strong> - Use hooks inside
                    render props
                  </li>
                  <li>
                    <strong>SSR considerations</strong> - Render props work with
                    server-side rendering
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
                    <strong>Wrapper hell</strong> - Too many nested render props
                  </li>
                  <li>
                    <strong>Unnecessary re-renders</strong> - Functions
                    recreated on every render
                  </li>
                  <li>
                    <strong>Complexity</strong> - Can make code harder to read
                  </li>
                  <li>
                    <strong>Prop drilling</strong> - Passing props through many
                    layers
                  </li>
                  <li>
                    <strong>Testing difficulties</strong> - Harder to test
                    deeply nested render props
                  </li>
                  <li>
                    <strong>TypeScript typing</strong> - Can be verbose for
                    complex props
                  </li>
                  <li>
                    <strong>Overuse</strong> - Prefer hooks for most new code
                  </li>
                  <li>
                    <strong>Performance issues</strong> - Not memoizing children
                    functions
                  </li>
                </ul>
              </div>
            </div>

            {/* Related Libraries & Patterns */}
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
                    <strong>Downshift</strong> - Render props for autocomplete
                  </li>
                  <li>
                    <strong>React Table</strong> - Render props for table logic
                  </li>
                  <li>
                    <strong>React Motion</strong> - Animation with render props
                  </li>
                  <li>
                    <strong>React Router</strong> - Early versions used render
                    props
                  </li>
                  <li>
                    <strong>Formik</strong> - Form state with render props
                  </li>
                  <li>
                    <strong>Compound Components</strong> - Related pattern
                  </li>
                  <li>
                    <strong>Custom Hooks</strong> - Modern alternative
                  </li>
                  <li>
                    <strong>Context API</strong> - State sharing
                  </li>
                </ul>
              </div>
            </div>

            {/* Render Props Patterns & Best Practices */}
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
                🎨 Render Props Patterns & Best Practices
              </h3>
              <div
                style={{
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                }}
              >
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>Children as a function</strong> - Standard render
                    props pattern
                  </li>
                  <li>
                    <strong>Keep logic and UI separate</strong> - Logic in
                    parent, UI in child
                  </li>
                  <li>
                    <strong>Memoize children functions</strong> - Prevent
                    unnecessary re-renders
                  </li>
                  <li>
                    <strong>Combine with hooks</strong> - Use hooks for state,
                    render props for UI
                  </li>
                  <li>
                    <strong>Type children properly</strong> - Use TypeScript for
                    type safety
                  </li>
                  <li>
                    <strong>Test with different children</strong> - Ensure
                    flexibility
                  </li>
                  <li>
                    <strong>Prefer hooks for new code</strong> - Hooks are more
                    idiomatic
                  </li>
                  <li>
                    <strong>Document expected children</strong> - Make API clear
                    for consumers
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Resizable Code Example */}
      <ResizableCodePanel>
        <h3 style={{ color: '#569cd6', marginBottom: '1rem' }}>
          Render Props Examples
        </h3>
        <pre style={{ margin: 0 }}>
          {`// 1. Basic Render Props Pattern
interface RenderPropsComponentProps {
  children: (data: any) => ReactNode;
}

const RenderPropsComponent = ({ children }: RenderPropsComponentProps) => {
  const data = { message: 'Hello from render props!' };
  return <>{children(data)}</>;
};

// 2. Mouse Position Tracker
interface MousePositionProps {
  children: (position: { x: number; y: number }) => ReactNode;
}

const MousePosition = ({ children }: MousePositionProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <>{children(position)}</>;
};

// 3. Counter with Render Props
interface CounterProps {
  children: (props: {
    count: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
  }) => ReactNode;
}

const Counter = ({ children }: CounterProps) => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);

  return <>{children({ count, increment, decrement, reset })}</>;
};

// 4. Data Fetcher
interface DataFetcherProps<T> {
  url: string;
  children: (props: {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
  }) => ReactNode;
}

const DataFetcher = <T,>({ url, children }: DataFetcherProps<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchData();
  }, [url]);

  return <>{children({ data, loading, error, refetch: fetchData })}</>;
};

// 5. Using Render Props
const App = () => (
  <div>
    <MousePosition>
      {({ x, y }) => (
        <div>
          Mouse position: {x}, {y}
        </div>
      )}
    </MousePosition>

    <Counter>
      {({ count, increment, decrement, reset }) => (
        <div>
          <p>Count: {count}</p>
          <button onClick={increment}>+</button>
          <button onClick={decrement}>-</button>
          <button onClick={reset}>Reset</button>
        </div>
      )}
    </Counter>

    <DataFetcher url="/api/data">
      {({ data, loading, error, refetch }) => (
        <div>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
          <button onClick={refetch}>Refetch</button>
        </div>
      )}
    </DataFetcher>
  </div>
);

// 6. Theme Provider with Render Props
interface ThemeProviderProps {
  children: (props: {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
  }) => ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return <>{children({ theme, toggleTheme })}</>;
};

// 7. Form with Render Props
interface FormProps {
  initialValues: Record<string, any>;
  children: (props: {
    values: Record<string, any>;
    handleChange: (name: string, value: any) => void;
    handleSubmit: (e: React.FormEvent) => void;
    reset: () => void;
  }) => ReactNode;
}

const Form = ({ initialValues, children }: FormProps) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', values);
  };

  const reset = () => {
    setValues(initialValues);
  };

  return <>{children({ values, handleChange, handleSubmit, reset })}</>;
};

// 8. Window Size Tracker
interface WindowSizeProps {
  children: (props: { width: number; height: number }) => ReactNode;
}

const WindowSize = ({ children }: WindowSizeProps) => {
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

  return <>{children(windowSize)}</>;
};

// 9. Render Props with Multiple Values
interface MultiValueProps {
  children: (props: {
    value1: string;
    value2: number;
    updateValue1: (value: string) => void;
    updateValue2: (value: number) => void;
  }) => ReactNode;
}

const MultiValue = ({ children }: MultiValueProps) => {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState(0);

  return (
    <>
      {children({
        value1,
        value2,
        updateValue1: setValue1,
        updateValue2: setValue2
      })}
    </>
  );
};

// 10. Render Props with Conditional Rendering
interface ConditionalProps {
  condition: boolean;
  children: (props: { isVisible: boolean; toggle: () => void }) => ReactNode;
}

const Conditional = ({ condition, children }: ConditionalProps) => {
  const [isVisible, setIsVisible] = useState(condition);

  const toggle = () => setIsVisible(prev => !prev);

  return <>{children({ isVisible, toggle })}</>;
};

// 11. Render Props with Async Operations
interface AsyncProps {
  operation: () => Promise<any>;
  children: (props: {
    result: any;
    loading: boolean;
    error: string | null;
    execute: () => void;
  }) => ReactNode;
}

const Async = ({ operation, children }: AsyncProps) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await operation();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return <>{children({ result, loading, error, execute })}</>;
};

// 12. Render Props vs HOCs
// Render Props (more flexible)
<MousePosition>
  {({ x, y }) => <div>Mouse: {x}, {y}</div>}
</MousePosition>

// HOC (less flexible)
const withMousePosition = (Component) => {
  return (props) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    return <Component {...props} position={position} />;
  };
};`}
        </pre>
      </ResizableCodePanel>
    </div>
  );
};

export default RenderProps;
