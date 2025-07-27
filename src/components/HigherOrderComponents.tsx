import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import ResizableCodePanel from './ResizableCodePanel';

// HOC: withLoading
const withLoading = <P extends object>(WrappedComponent: ComponentType<P>) => {
  return function WithLoadingComponent(props: P & { loading?: boolean }) {
    const { loading = false, ...restProps } = props;

    if (loading) {
      return (
        <div
          style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Loading...</p>
        </div>
      );
    }

    return <WrappedComponent {...(restProps as P)} />;
  };
};

// HOC: withCounter
const withCounter = <P extends object>(
  WrappedComponent: ComponentType<
    P & {
      count: number;
      increment: () => void;
      decrement: () => void;
      reset: () => void;
    }
  >
) => {
  return function WithCounterComponent(props: P) {
    const [count, setCount] = useState(0);

    const increment = () => setCount(prev => prev + 1);
    const decrement = () => setCount(prev => prev - 1);
    const reset = () => setCount(0);

    return (
      <WrappedComponent
        {...props}
        count={count}
        increment={increment}
        decrement={decrement}
        reset={reset}
      />
    );
  };
};

// HOC: withLocalStorage
const withLocalStorage = <P extends object>(
  WrappedComponent: ComponentType<
    P & {
      value: string;
      setValue: (value: string) => void;
    }
  >,
  key: string,
  defaultValue: any
) => {
  return function WithLocalStorageComponent(props: P) {
    const [value, setValue] = useState(() => {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        return defaultValue;
      }
    });

    const updateValue = (newValue: any) => {
      setValue(newValue);
      try {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    };

    return <WrappedComponent {...props} value={value} setValue={updateValue} />;
  };
};

// HOC: withClickOutside
const withClickOutside = <P extends object>(
  WrappedComponent: ComponentType<
    P & {
      isOpen: boolean;
      setIsOpen: (open: boolean) => void;
    }
  >
) => {
  return function WithClickOutsideComponent(props: P) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Element;
        if (isOpen && !target.closest('[data-click-outside]')) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
      <WrappedComponent {...props} isOpen={isOpen} setIsOpen={setIsOpen} />
    );
  };
};

// HOC: withTheme
const withTheme = <P extends object>(
  WrappedComponent: ComponentType<
    P & {
      theme: 'light' | 'dark';
      toggleTheme: () => void;
      themeStyles: any;
    }
  >
) => {
  return function WithThemeComponent(props: P) {
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

    return (
      <WrappedComponent
        {...props}
        theme={theme}
        toggleTheme={toggleTheme}
        themeStyles={themeStyles}
      />
    );
  };
};

// Base Components
const UserProfile = ({ name, email }: { name: string; email: string }) => (
  <div
    style={{
      padding: '1rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
    }}
  >
    <h3>User Profile</h3>
    <p>
      <strong>Name:</strong> {name}
    </p>
    <p>
      <strong>Email:</strong> {email}
    </p>
  </div>
);

const Counter = ({
  count,
  increment,
  decrement,
  reset,
}: {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}) => (
  <div style={{ textAlign: 'center', padding: '1rem' }}>
    <h3>Counter</h3>
    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{count}</p>
    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
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
);

const Settings = ({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) => (
  <div
    style={{
      padding: '1rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
    }}
  >
    <h3>Settings</h3>
    <input
      type="text"
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder="Enter setting value"
      style={{
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '1rem',
      }}
    />
    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
      This value persists in localStorage
    </p>
  </div>
);

const Dropdown = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => (
  <div style={{ position: 'relative', display: 'inline-block' }}>
    <button
      onClick={() => setIsOpen(!isOpen)}
      data-click-outside
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
        data-click-outside
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
);

const ThemedComponent = ({
  theme,
  toggleTheme,
  themeStyles,
}: {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  themeStyles: any;
}) => (
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
);

// Enhanced Components using HOCs
const UserProfileWithLoading = withLoading(UserProfile);
const CounterWithHOC = withCounter(Counter);
const SettingsWithStorage = withLocalStorage(
  Settings,
  'settings',
  'default value'
);
const DropdownWithClickOutside = withClickOutside(Dropdown);
const ThemedComponentWithHOC = withTheme(ThemedComponent);

const HigherOrderComponents = () => {
  const [loading, setLoading] = useState(false);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left side - Content */}
      <div style={{ flex: 1, padding: '2rem' }}>
        <h1 className="heading-primary">Higher-Order Components (HOCs)</h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
          }}
        >
          Learn how to use Higher-Order Components to enhance and reuse
          component logic.
        </p>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">What are HOCs?</h2>
          <p style={{ marginBottom: '1rem' }}>
            Higher-Order Components are functions that take a component and
            return a new component with enhanced functionality.
          </p>
          <ul style={{ listStyle: 'disc', paddingLeft: '2rem' }}>
            <li>Take a component as an argument</li>
            <li>Return a new enhanced component</li>
            <li>Share logic between components</li>
            <li>Don't modify the original component</li>
            <li>Follow the composition pattern</li>
          </ul>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">withLoading HOC</h2>
          <p style={{ marginBottom: '1rem' }}>
            This HOC adds loading state to any component.
          </p>
          <div style={{ marginBottom: '1rem' }}>
            <button
              onClick={simulateLoading}
              disabled={loading}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: loading ? '#9ca3af' : 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              Simulate Loading
            </button>
          </div>
          <UserProfileWithLoading
            loading={loading}
            name="John Doe"
            email="john@example.com"
          />
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">withCounter HOC</h2>
          <p style={{ marginBottom: '1rem' }}>
            This HOC adds counter functionality to any component.
          </p>
          <CounterWithHOC />
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">withLocalStorage HOC</h2>
          <p style={{ marginBottom: '1rem' }}>
            This HOC adds localStorage persistence to any component.
          </p>
          <SettingsWithStorage />
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">withClickOutside HOC</h2>
          <p style={{ marginBottom: '1rem' }}>
            This HOC adds click-outside functionality to close dropdowns/modals.
          </p>
          <DropdownWithClickOutside />
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">withTheme HOC</h2>
          <p style={{ marginBottom: '1rem' }}>
            This HOC adds theme functionality to any component.
          </p>
          <ThemedComponentWithHOC />
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
                    <strong>What is a Higher-Order Component?</strong> -
                    Function that takes a component and returns enhanced
                    component
                  </li>
                  <li>
                    <strong>When should you use HOCs?</strong> - When you need
                    to share logic between multiple components
                  </li>
                  <li>
                    <strong>
                      What's the difference between HOCs and custom hooks?
                    </strong>{' '}
                    - HOCs enhance components, hooks share stateful logic
                  </li>
                  <li>
                    <strong>How do you compose multiple HOCs?</strong> - Use
                    function composition or utility libraries
                  </li>
                  <li>
                    <strong>What are the limitations of HOCs?</strong> - Props
                    collision, static composition, wrapper hell
                  </li>
                  <li>
                    <strong>How do you handle prop collision in HOCs?</strong> -
                    Use prop namespacing or filtering
                  </li>
                  <li>
                    <strong>When should you avoid HOCs?</strong> - When custom
                    hooks or render props are more appropriate
                  </li>
                  <li>
                    <strong>How do you test HOCs?</strong> - Test the enhanced
                    component, not the HOC directly
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
                    <strong>Don't modify the original component</strong> - HOCs
                    should be pure functions
                  </li>
                  <li>
                    <strong>Pass through unrelated props</strong> - Use rest
                    parameters to forward props
                  </li>
                  <li>
                    <strong>Use display names for debugging</strong> - Set
                    displayName for better DevTools experience
                  </li>
                  <li>
                    <strong>Handle prop collisions</strong> - Be careful with
                    prop names to avoid conflicts
                  </li>
                  <li>
                    <strong>Consider composition over inheritance</strong> -
                    HOCs follow composition pattern
                  </li>
                  <li>
                    <strong>Keep HOCs focused</strong> - Each HOC should have a
                    single responsibility
                  </li>
                  <li>
                    <strong>Use TypeScript for type safety</strong> - Proper
                    typing prevents runtime errors
                  </li>
                  <li>
                    <strong>Consider alternatives</strong> - Custom hooks might
                    be simpler for stateful logic
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
                    <strong>HOC composition patterns</strong> - Combining
                    multiple HOCs effectively
                  </li>
                  <li>
                    <strong>Parameterized HOCs</strong> - HOCs that accept
                    configuration parameters
                  </li>
                  <li>
                    <strong>HOCs with refs</strong> - Using forwardRef with HOCs
                  </li>
                  <li>
                    <strong>HOCs and context</strong> - Integrating HOCs with
                    React Context
                  </li>
                  <li>
                    <strong>HOC performance optimization</strong> - Memoizing
                    HOCs for better performance
                  </li>
                  <li>
                    <strong>HOCs vs Render Props</strong> - When to use each
                    pattern
                  </li>
                  <li>
                    <strong>HOCs vs Custom Hooks</strong> - Modern alternatives
                    to HOCs
                  </li>
                  <li>
                    <strong>HOC testing strategies</strong> - Unit and
                    integration testing approaches
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
                    <strong>Wrapper hell</strong> - Too many nested HOCs making
                    debugging difficult
                  </li>
                  <li>
                    <strong>Prop collision</strong> - HOCs overwriting props
                    from other HOCs
                  </li>
                  <li>
                    <strong>Static composition</strong> - HOCs are composed at
                    build time, not runtime
                  </li>
                  <li>
                    <strong>Performance issues</strong> - HOCs creating new
                    components on every render
                  </li>
                  <li>
                    <strong>TypeScript complexity</strong> - Complex type
                    definitions for HOCs
                  </li>
                  <li>
                    <strong>Testing difficulties</strong> - Hard to test HOCs in
                    isolation
                  </li>
                  <li>
                    <strong>Over-engineering</strong> - Using HOCs when simpler
                    solutions exist
                  </li>
                  <li>
                    <strong>Naming conflicts</strong> - Display names and prop
                    names causing confusion
                  </li>
                </ul>
              </div>
            </div>

            {/* HOC Libraries */}
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
                    <strong>Recompose</strong> - Utility library for HOCs
                  </li>
                  <li>
                    <strong>Redux connect</strong> - HOC for connecting
                    components to Redux
                  </li>
                  <li>
                    <strong>React Router withRouter</strong> - HOC for accessing
                    router props
                  </li>
                  <li>
                    <strong>Formik withFormik</strong> - HOC for form handling
                  </li>
                  <li>
                    <strong>Render Props</strong> - Alternative to HOCs
                  </li>
                  <li>
                    <strong>Custom Hooks</strong> - Modern alternative to HOCs
                  </li>
                  <li>
                    <strong>Compound Components</strong> - Component composition
                    pattern
                  </li>
                  <li>
                    <strong>Context API</strong> - Built-in state sharing
                    solution
                  </li>
                </ul>
              </div>
            </div>

            {/* HOC Patterns */}
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
                🎨 HOC Patterns
              </h3>
              <div
                style={{
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                }}
              >
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>withLoading</strong> - Add loading state to
                    components
                  </li>
                  <li>
                    <strong>withError</strong> - Add error handling to
                    components
                  </li>
                  <li>
                    <strong>withCounter</strong> - Add stateful counter
                    functionality
                  </li>
                  <li>
                    <strong>withLocalStorage</strong> - Add persistence to
                    components
                  </li>
                  <li>
                    <strong>withClickOutside</strong> - Add click-outside
                    detection
                  </li>
                  <li>
                    <strong>withTheme</strong> - Add theming capabilities
                  </li>
                  <li>
                    <strong>withAnalytics</strong> - Add tracking to components
                  </li>
                  <li>
                    <strong>withPermissions</strong> - Add authorization logic
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
          Higher-Order Components Examples
        </h3>
        <pre style={{ margin: 0 }}>
          {`// 1. Basic HOC Structure
const withEnhancement = <P extends object>(WrappedComponent: ComponentType<P>) => {
  return function EnhancedComponent(props: P) {
    // Add new logic here
    return <WrappedComponent {...props} />;
  };
};

// 2. withLoading HOC
const withLoading = <P extends object>(WrappedComponent: ComponentType<P>) => {
  return function WithLoadingComponent(props: P & { loading?: boolean }) {
    const { loading = false, ...restProps } = props;

    if (loading) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...(restProps as P)} />;
  };
};

// 3. withError HOC
const withError = <P extends object>(WrappedComponent: ComponentType<P>) => {
  return function WithErrorComponent(props: P & { error?: string | null }) {
    const { error, ...restProps } = props;

    if (error) {
      return <div>Error: {error}</div>;
    }

    return <WrappedComponent {...(restProps as P)} />;
  };
};

// 4. withCounter HOC
const withCounter = <P extends object>(WrappedComponent: ComponentType<P>) => {
  return function WithCounterComponent(props: P) {
    const [count, setCount] = useState(0);

    const increment = () => setCount(prev => prev + 1);
    const decrement = () => setCount(prev => prev - 1);
    const reset = () => setCount(0);

    return (
      <WrappedComponent
        {...props}
        count={count}
        increment={increment}
        decrement={decrement}
        reset={reset}
      />
    );
  };
};

// 5. withLocalStorage HOC
const withLocalStorage = <P extends object>(
  WrappedComponent: ComponentType<P>,
  key: string,
  defaultValue: any
) => {
  return function WithLocalStorageComponent(props: P) {
    const [value, setValue] = useState(() => {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        return defaultValue;
      }
    });

    const updateValue = (newValue: any) => {
      setValue(newValue);
      try {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    };

    return (
      <WrappedComponent
        {...props}
        value={value}
        setValue={updateValue}
      />
    );
  };
};

// 6. withClickOutside HOC
const withClickOutside = <P extends object>(WrappedComponent: ComponentType<P>) => {
  return function WithClickOutsideComponent(props: P) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Element;
        if (isOpen && !target.closest('[data-click-outside]')) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
      <WrappedComponent
        {...props}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    );
  };
};

// 7. withTheme HOC
const withTheme = <P extends object>(WrappedComponent: ComponentType<P>) => {
  return function WithThemeComponent(props: P) {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    const toggleTheme = () => {
      setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
      <WrappedComponent
        {...props}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  };
};

// 8. Using HOCs
const UserProfile = ({ name, email }: { name: string; email: string }) => (
  <div>
    <h3>User Profile</h3>
    <p>Name: {name}</p>
    <p>Email: {email}</p>
  </div>
);

const UserProfileWithLoading = withLoading(UserProfile);
const UserProfileWithError = withError(UserProfile);

// 9. Multiple HOCs
const EnhancedComponent = withLoading(withError(withCounter(UserProfile)));

// 10. HOC with Parameters
const withInterval = (interval: number) => <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  return function WithIntervalComponent(props: P) {
    const [tick, setTick] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setTick(prev => prev + 1);
      }, interval);

      return () => clearInterval(timer);
    }, [interval]);

    return <WrappedComponent {...props} tick={tick} />;
  };
};

// 11. HOC with Display Name
const withDisplayName = <P extends object>(
  WrappedComponent: ComponentType<P>,
  displayName: string
) => {
  const EnhancedComponent = (props: P) => {
    return <WrappedComponent {...props} />;
  };

  EnhancedComponent.displayName = displayName;
  return EnhancedComponent;
};

// 12. HOC with Ref Forwarding
const withRef = <P extends object>(WrappedComponent: ComponentType<P>) => {
  return forwardRef<HTMLDivElement, P>((props, ref) => {
    return (
      <div ref={ref}>
        <WrappedComponent {...props} />
      </div>
    );
  });
};

// 13. HOC with Context
const withContext = <P extends object>(
  WrappedComponent: ComponentType<P>,
  Context: React.Context<any>
) => {
  return function WithContextComponent(props: P) {
    const contextValue = useContext(Context);

    return (
      <WrappedComponent
        {...props}
        contextValue={contextValue}
      />
    );
  };
};

// 14. HOC with Error Boundary
const withErrorBoundary = <P extends object>(WrappedComponent: ComponentType<P>) => {
  return function WithErrorBoundaryComponent(props: P) {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
      return <div>Something went wrong!</div>;
    }

    return (
      <ErrorBoundary onError={() => setHasError(true)}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
};`}
        </pre>
      </ResizableCodePanel>
    </div>
  );
};

export default HigherOrderComponents;
