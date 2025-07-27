import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useReducer,
  useLayoutEffect,
  useImperativeHandle,
  forwardRef,
  useDebugValue,
  useDeferredValue,
  useTransition,
  useId,
  useSyncExternalStore,
  useInsertionEffect,
} from 'react';
import ResizableCodePanel from './ResizableCodePanel';

// Reducer for useReducer demo
const counterReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'increment':
      return {
        count: state.count + 1,
        history: [...state.history, state.count],
      };
    case 'decrement':
      return {
        count: state.count - 1,
        history: [...state.history, state.count],
      };
    case 'reset':
      return { count: 0, history: [] };
    default:
      return state;
  }
};

// Custom hook for useDebugValue demo
const useCounterWithDebug = (initialValue: number) => {
  const [count, setCount] = useState(initialValue);
  useDebugValue(count > 10 ? 'High Count' : 'Low Count');
  return [count, setCount];
};

// Custom hook for useSyncExternalStore demo (simplified)
const useWindowSizeStore = () => {
  // For demo purposes, return a static object to avoid infinite loops
  return { width: window.innerWidth, height: window.innerHeight };
};

// Custom hook for window size tracking
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

// Component for useImperativeHandle demo
const FancyInput = forwardRef((props: any, ref: any) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    select: () => inputRef.current?.select(),
    getValue: () => inputRef.current?.value || '',
    setValue: (value: string) => {
      if (inputRef.current) inputRef.current.value = value;
    },
  }));

  return <input ref={inputRef} {...props} />;
});

const Hooks = () => {
  // All hooks must be called at the top level
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const [theme, setTheme] = useState('light');
  const [isPending, startTransition] = useTransition();
  const [deferredCount, setDeferredCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const fancyInputRef = useRef<any>(null);
  const uniqueId = useId();

  // useReducer state
  const [reducerState, dispatch] = useReducer(counterReducer, {
    count: 0,
    history: [],
  });

  // useDebugValue hook
  const [debugCount, setDebugCount] = useCounterWithDebug(0);

  // useSyncExternalStore hook
  const windowSize = useWindowSizeStore();

  // useDeferredValue hook
  const deferredText = useDeferredValue(text);

  // useEffect - Side effects
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // useLayoutEffect - Synchronous side effects
  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.borderColor =
        theme === 'light' ? '#3b82f6' : '#fbbf24';
    }
  }, [theme]);

  // useInsertionEffect - CSS-in-JS insertion (simplified for demo)
  useInsertionEffect(() => {
    // This effect runs once on mount for demonstration
    console.log('useInsertionEffect: CSS-in-JS insertion effect triggered');
    return () => {
      console.log('useInsertionEffect: Cleanup');
    };
  }, []); // Empty dependency array - runs only once

  // useCallback - Memoized function
  const handleReset = useCallback(() => {
    setCount(0);
    setText('');
  }, []);

  // useMemo - Memoized value
  const expensiveCalculation = useMemo(() => {
    console.log('Performing expensive calculation...');
    return count * 2;
  }, [count]);

  // Custom hook simulation - moved outside component
  const windowSizeCustom = useWindowSize();

  // Handler functions
  const handleFancyInputFocus = () => {
    fancyInputRef.current?.focus();
  };

  const handleFancyInputBlur = () => {
    fancyInputRef.current?.blur();
  };

  const handleFancyInputSelect = () => {
    fancyInputRef.current?.select();
  };

  const handleFancyInputSetValue = () => {
    fancyInputRef.current?.setValue('Hello from imperative handle!');
  };

  const handleTransitionUpdate = () => {
    startTransition(() => {
      setDeferredCount(prev => prev + 1000);
    });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left side - Content */}
      <div style={{ flex: 1, padding: '2rem' }}>
        <h1 className="heading-primary">React Hooks</h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
          }}
        >
          Learn how to use various React hooks to manage state, side effects,
          and component logic.
        </p>

        {/* Important Hooks Concepts */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">🎯 Important Hooks Concepts</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
              marginTop: '1rem',
            }}
          >
            {/* State Hooks */}
            <div
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
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
                📊 State Hooks
              </h3>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>useState:</strong> Manage component state
                  </li>
                  <li>
                    <strong>useReducer:</strong> Complex state logic
                  </li>
                  <li>
                    <strong>useDeferredValue:</strong> Defer value updates
                  </li>
                  <li>
                    <strong>useTransition:</strong> Mark updates as non-urgent
                  </li>
                  <li>
                    <strong>useId:</strong> Generate unique IDs
                  </li>
                  <li>
                    <strong>useSyncExternalStore:</strong> Subscribe to external
                    stores
                  </li>
                </ul>
              </div>
            </div>

            {/* Effect Hooks */}
            <div
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%)',
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
                🔄 Effect Hooks
              </h3>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>useEffect:</strong> Side effects after render
                  </li>
                  <li>
                    <strong>useLayoutEffect:</strong> Synchronous side effects
                  </li>
                  <li>
                    <strong>useInsertionEffect:</strong> CSS-in-JS insertion
                  </li>
                  <li>
                    <strong>Cleanup functions:</strong> Prevent memory leaks
                  </li>
                  <li>
                    <strong>Dependency arrays:</strong> Control when effects run
                  </li>
                  <li>
                    <strong>Effect timing:</strong> Understand execution order
                  </li>
                </ul>
              </div>
            </div>

            {/* Ref Hooks */}
            <div
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
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
                🎯 Ref Hooks
              </h3>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>useRef:</strong> Persist values between renders
                  </li>
                  <li>
                    <strong>forwardRef:</strong> Forward refs to child
                    components
                  </li>
                  <li>
                    <strong>useImperativeHandle:</strong> Customize ref value
                  </li>
                  <li>
                    <strong>DOM access:</strong> Direct DOM manipulation
                  </li>
                  <li>
                    <strong>Value persistence:</strong> Store mutable values
                  </li>
                  <li>
                    <strong>Focus management:</strong> Control input focus
                  </li>
                </ul>
              </div>
            </div>

            {/* Performance Hooks */}
            <div
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #fffbeb 0%, #fed7aa 100%)',
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
                ⚡ Performance Hooks
              </h3>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>useMemo:</strong> Memoize expensive calculations
                  </li>
                  <li>
                    <strong>useCallback:</strong> Memoize event handlers
                  </li>
                  <li>
                    <strong>React.memo:</strong> Prevent unnecessary re-renders
                  </li>
                  <li>
                    <strong>useDeferredValue:</strong> Defer expensive updates
                  </li>
                  <li>
                    <strong>useTransition:</strong> Mark updates as non-urgent
                  </li>
                  <li>
                    <strong>Optimization strategies:</strong> When and how to
                    optimize
                  </li>
                </ul>
              </div>
            </div>

            {/* Custom Hooks */}
            <div
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
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
                🔧 Custom Hooks
              </h3>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>Reusable logic:</strong> Extract component logic
                  </li>
                  <li>
                    <strong>State sharing:</strong> Share state between
                    components
                  </li>
                  <li>
                    <strong>Side effects:</strong> Encapsulate effect logic
                  </li>
                  <li>
                    <strong>Naming convention:</strong> Always start with 'use'
                  </li>
                  <li>
                    <strong>Composition:</strong> Combine multiple hooks
                  </li>
                  <li>
                    <strong>Testing:</strong> Test custom hooks independently
                  </li>
                </ul>
              </div>
            </div>

            {/* Rules of Hooks */}
            <div
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
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
                📋 Rules of Hooks
              </h3>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>Only call at top level:</strong> Don't call inside
                    loops, conditions, or nested functions
                  </li>
                  <li>
                    <strong>Only call from React functions:</strong> Call hooks
                    from React components or custom hooks
                  </li>
                  <li>
                    <strong>Hook order matters:</strong> Hooks must be called in
                    the same order every render
                  </li>
                  <li>
                    <strong>Dependency arrays:</strong> Include all dependencies
                    in useEffect, useMemo, useCallback
                  </li>
                  <li>
                    <strong>Custom hook naming:</strong> Always start custom
                    hooks with 'use'
                  </li>
                  <li>
                    <strong>ESLint rules:</strong> Use eslint-plugin-react-hooks
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Hooks Overview */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">React Hooks Overview</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
              <h4 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>
                📊 State Management
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                useState, useReducer, useDeferredValue
              </p>
            </div>
            <div
              style={{
                padding: '1rem',
                background: '#f0fdf4',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>
                🔄 Side Effects
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                useEffect, useLayoutEffect, useInsertionEffect
              </p>
            </div>
            <div
              style={{
                padding: '1rem',
                background: '#fef2f2',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>
                🎯 Refs & DOM
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                useRef, forwardRef, useImperativeHandle
              </p>
            </div>
            <div
              style={{
                padding: '1rem',
                background: '#fffbeb',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ color: '#92400e', marginBottom: '0.5rem' }}>
                ⚡ Performance
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                useMemo, useCallback, useTransition
              </p>
            </div>
            <div
              style={{
                padding: '1rem',
                background: '#f3e8ff',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ color: '#7c3aed', marginBottom: '0.5rem' }}>
                🔧 Custom Hooks
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                Reusable logic and state sharing
              </p>
            </div>
            <div
              style={{
                padding: '1rem',
                background: '#ecfdf5',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ color: '#047857', marginBottom: '0.5rem' }}>
                📋 Rules & Best Practices
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                Hook rules and optimization strategies
              </p>
            </div>
          </div>
        </div>

        {/* Quick Reference - Best Practices */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#1e40af' }}>
            📚 Quick Reference - Best Practices
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* useState Patterns */}
            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ color: '#1e40af', marginBottom: '0.75rem' }}>
                📊 useState Patterns
              </h4>
              <pre
                style={{
                  fontSize: '0.75rem',
                  background: '#1e293b',
                  color: '#e2e8f0',
                  padding: '1rem',
                  borderRadius: '6px',
                  overflow: 'auto',
                }}
              >
                {`// ✅ Functional updates for dependent state
const [count, setCount] = useState(0);
setCount(prev => prev + 1);

// ✅ Lazy initialization
const [state, setState] = useState(() => {
  return expensiveCalculation();
});

// ✅ Object state updates
const [user, setUser] = useState({ name: '', email: '' });
setUser(prev => ({ ...prev, name: 'John' }));

// ❌ Avoid direct mutation
setUser(prev => {
  prev.name = 'John'; // Don't do this!
  return prev;
});`}
              </pre>
            </div>

            {/* useEffect Patterns */}
            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ color: '#059669', marginBottom: '0.75rem' }}>
                🔄 useEffect Patterns
              </h4>
              <pre
                style={{
                  fontSize: '0.75rem',
                  background: '#1e293b',
                  color: '#e2e8f0',
                  padding: '1rem',
                  borderRadius: '6px',
                  overflow: 'auto',
                }}
              >
                {`// ✅ Mount only
useEffect(() => {
  // Setup
  return () => {
    // Cleanup
  };
}, []);

// ✅ Run on dependency changes
useEffect(() => {
  // Effect logic
}, [dependency]);

// ✅ Cleanup subscriptions
useEffect(() => {
  const subscription = api.subscribe();
  return () => subscription.unsubscribe();
}, []);

// ❌ Missing dependencies
useEffect(() => {
  setCount(count + 1);
}, []); // Missing count dependency`}
              </pre>
            </div>

            {/* Performance Optimization */}
            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ color: '#7c3aed', marginBottom: '0.75rem' }}>
                ⚡ Performance Tips
              </h4>
              <pre
                style={{
                  fontSize: '0.75rem',
                  background: '#1e293b',
                  color: '#e2e8f0',
                  padding: '1rem',
                  borderRadius: '6px',
                  overflow: 'auto',
                }}
              >
                {`// ✅ Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// ✅ Memoize event handlers
const handleClick = useCallback(() => {
  setCount(prev => prev + 1);
}, []);

// ✅ Prevent unnecessary re-renders
const MemoizedComponent = React.memo(MyComponent);

// ✅ Use transition for non-urgent updates
const [isPending, startTransition] = useTransition();
startTransition(() => {
  setHeavyState(newValue);
});`}
              </pre>
            </div>

            {/* Custom Hooks */}
            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ color: '#ef4444', marginBottom: '0.75rem' }}>
                🔧 Custom Hooks
              </h4>
              <pre
                style={{
                  fontSize: '0.75rem',
                  background: '#1e293b',
                  color: '#e2e8f0',
                  padding: '1rem',
                  borderRadius: '6px',
                  overflow: 'auto',
                }}
              >
                {`// ✅ Custom hook pattern
const useCustomHook = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  
  const increment = useCallback(() => {
    setValue(prev => prev + 1);
  }, []);
  
  return { value, increment };
};

// ✅ Hook composition
const useUser = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]);
  
  return { user, loading };
};`}
              </pre>
            </div>
          </div>
        </div>

        {/* Interview Tips */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#059669' }}>
            💡 Interview Tips & Common Questions
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '1rem',
            }}
          >
            <div
              style={{
                padding: '1rem',
                background: '#f0fdf4',
                borderRadius: '8px',
                border: '1px solid #bbf7d0',
              }}
            >
              <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>
                🤔 Common Questions
              </h4>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>What are the Rules of Hooks?</li>
                <li>When should you use useMemo vs useCallback?</li>
                <li>
                  What's the difference between useEffect and useLayoutEffect?
                </li>
                <li>How do you prevent infinite loops in useEffect?</li>
                <li>When should you use useReducer instead of useState?</li>
                <li>How do you create custom hooks?</li>
              </ul>
            </div>

            <div
              style={{
                padding: '1rem',
                background: '#fef3c7',
                borderRadius: '8px',
                border: '1px solid #fde68a',
              }}
            >
              <h4 style={{ color: '#92400e', marginBottom: '0.5rem' }}>
                🎯 Key Points to Remember
              </h4>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>Always call hooks at the top level</li>
                <li>Include all dependencies in dependency arrays</li>
                <li>Use functional updates for dependent state</li>
                <li>Return cleanup functions from useEffect</li>
                <li>Start custom hooks with 'use' prefix</li>
                <li>Use React.memo for expensive components</li>
              </ul>
            </div>

            <div
              style={{
                padding: '1rem',
                background: '#dbeafe',
                borderRadius: '8px',
                border: '1px solid #93c5fd',
              }}
            >
              <h4 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>
                🚀 Advanced Topics
              </h4>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>useTransition and useDeferredValue</li>
                <li>useSyncExternalStore for external state</li>
                <li>useInsertionEffect for CSS-in-JS</li>
                <li>useImperativeHandle with forwardRef</li>
                <li>Custom hook testing strategies</li>
                <li>Hook composition patterns</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Resizable Code Example */}
      <ResizableCodePanel>
        <h3 style={{ color: '#569cd6', marginBottom: '1rem' }}>
          React Hooks Examples
        </h3>
        <pre style={{ margin: 0 }}>
          {`// 1. 📊 useState - State Management
const [count, setCount] = useState(0);
const [user, setUser] = useState({ name: '', email: '' });

// 2. 🔄 useEffect - Side Effects
useEffect(() => {
  document.title = \`Count: \${count}\`;
  return () => {
    // Cleanup function
  };
}, [count]);

// 3. 🎯 useRef - DOM Access & Values
const inputRef = useRef(null);
const valueRef = useRef(0); // Persist between renders

// 4. ⚡ useMemo - Expensive Calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// 5. 🔧 useCallback - Memoized Functions
const handleClick = useCallback(() => {
  setCount(prev => prev + 1);
}, []);

// 6. 📊 useReducer - Complex State
const [state, dispatch] = useReducer(reducer, initialState);

// 7. 🔄 useLayoutEffect - Synchronous Effects
useLayoutEffect(() => {
  // Runs synchronously after DOM mutations
}, [dependency]);

// 8. 🎭 useImperativeHandle - Custom Ref Value
useImperativeHandle(ref, () => ({
  focus: () => inputRef.current?.focus(),
  blur: () => inputRef.current?.blur(),
}));

// 9. 🐛 useDebugValue - Debug Information
useDebugValue(count > 10 ? 'High Count' : 'Low Count');

// 10. ⏱️ useDeferredValue - Deferred Updates
const deferredValue = useDeferredValue(expensiveValue);

// 11. 🚀 useTransition - Non-blocking Updates
const [isPending, startTransition] = useTransition();
startTransition(() => {
  setHeavyState(newValue);
});

// 12. 🆔 useId - Unique Identifiers
const uniqueId = useId();

// 13. 🔗 useSyncExternalStore - External State
const externalValue = useSyncExternalStore(
  subscribe,
  getSnapshot,
  getServerSnapshot
);

// 14. 🎨 useInsertionEffect - CSS-in-JS
useInsertionEffect(() => {
  // Insert styles before DOM mutations
}, [styles]);

/**
 * 🎯 HOOKS BEST PRACTICES:
 * 
 * 1. 📊 STATE MANAGEMENT
 *    - Use useState for simple state
 *    - Use useReducer for complex state
 *    - Keep state minimal and normalized
 * 
 * 2. 🔄 SIDE EFFECTS
 *    - Use useEffect for side effects
 *    - Always provide cleanup functions
 *    - Be careful with dependency arrays
 * 
 * 3. ⚡ PERFORMANCE
 *    - Use useCallback for function memoization
 *    - Use useMemo for value memoization
 *    - Avoid unnecessary re-renders
 * 
 * 4. 🎯 REFS
 *    - Use useRef for DOM access
 *    - Use useRef for persistent values
 *    - Don't use refs for state that should trigger re-renders
 * 
 * 5. 🔧 CUSTOM HOOKS
 *    - Extract reusable logic
 *    - Follow naming conventions
 *    - Keep hooks focused and simple
 * 
 * 6. 🐛 DEBUGGING
 *    - Use useDebugValue for custom hooks
 *    - Use React DevTools
 *    - Check dependency arrays
 * 
 * 7. 🚀 ADVANCED PATTERNS
 *    - Use useTransition for non-blocking updates
 *    - Use useDeferredValue for deferred updates
 *    - Use useSyncExternalStore for external state
 * 
 * 8. 🎭 IMPERATIVE HANDLES
 *    - Use useImperativeHandle sparingly
 *    - Prefer declarative over imperative
 *    - Document imperative methods
 */`}
        </pre>
      </ResizableCodePanel>
    </div>
  );
};

export default Hooks;
