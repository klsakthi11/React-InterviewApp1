import { useState, useEffect } from 'react';
import ResizableCodePanel from './ResizableCodePanel';

const ComponentLifecycle = () => {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState('Initializing');
  const [lifecycleLogs, setLifecycleLogs] = useState<string[]>([]);

  // Add lifecycle log
  const addLog = (message: string) => {
    setLifecycleLogs(prev => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  useEffect(() => {
    console.log('Component mounted');
    setMounted(true);
    setPhase('Mounted');
    addLog('Component mounted');

    return () => {
      console.log('Component will unmount');
      addLog('Component will unmount');
    };
  }, []);

  useEffect(() => {
    console.log('Count changed:', count);
    addLog(`Count changed to: ${count}`);
  }, [count]);

  // Removed the problematic useEffect that was causing infinite loop
  // This effect was running on every render and updating state

  useEffect(() => {
    addLog('Effect with empty dependency array - runs only on mount');
  }, []);

  const clearLogs = () => {
    setLifecycleLogs([]);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left side - Content */}
      <div style={{ flex: 1, padding: '2rem' }}>
        <h1 className="heading-primary">Component Lifecycle in React</h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
          }}
        >
          Learn how React components are created, updated, and destroyed
          throughout their lifecycle.
        </p>

        {/* Important Lifecycle Concepts */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">🎯 Important Lifecycle Concepts</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
              marginTop: '1rem',
            }}
          >
            {/* Mounting Phase */}
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
                🚀 Mounting Phase
              </h3>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>Constructor:</strong> Initialize state and bind
                    methods
                  </li>
                  <li>
                    <strong>getDerivedStateFromProps:</strong> Update state
                    based on props
                  </li>
                  <li>
                    <strong>Render:</strong> Create React elements
                  </li>
                  <li>
                    <strong>componentDidMount:</strong> Side effects, API calls
                  </li>
                  <li>
                    <strong>useEffect with []:</strong> Functional component
                    equivalent
                  </li>
                </ul>
              </div>
            </div>

            {/* Updating Phase */}
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
                🔄 Updating Phase
              </h3>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>getDerivedStateFromProps:</strong> Update state from
                    new props
                  </li>
                  <li>
                    <strong>shouldComponentUpdate:</strong> Control re-rendering
                  </li>
                  <li>
                    <strong>Render:</strong> Re-render with new data
                  </li>
                  <li>
                    <strong>getSnapshotBeforeUpdate:</strong> Capture DOM info
                  </li>
                  <li>
                    <strong>componentDidUpdate:</strong> Handle post-update
                    logic
                  </li>
                  <li>
                    <strong>useEffect with dependencies:</strong> Functional
                    equivalent
                  </li>
                </ul>
              </div>
            </div>

            {/* Unmounting Phase */}
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
                🗑️ Unmounting Phase
              </h3>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>componentWillUnmount:</strong> Cleanup before
                    removal
                  </li>
                  <li>
                    <strong>Cancel subscriptions:</strong> Clear timers,
                    listeners
                  </li>
                  <li>
                    <strong>Abort requests:</strong> Cancel pending API calls
                  </li>
                  <li>
                    <strong>useEffect cleanup:</strong> Return cleanup function
                  </li>
                  <li>
                    <strong>Memory cleanup:</strong> Prevent memory leaks
                  </li>
                </ul>
              </div>
            </div>

            {/* Error Handling */}
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
                🚨 Error Boundaries
              </h3>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>componentDidCatch:</strong> Catch JavaScript errors
                  </li>
                  <li>
                    <strong>getDerivedStateFromError:</strong> Update state on
                    error
                  </li>
                  <li>
                    <strong>Error boundaries:</strong> Catch errors in child
                    tree
                  </li>
                  <li>
                    <strong>Fallback UI:</strong> Show error state
                  </li>
                  <li>
                    <strong>Error logging:</strong> Report errors to service
                  </li>
                </ul>
              </div>
            </div>

            {/* Performance Optimization */}
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
                ⚡ Performance Tips
              </h3>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>React.memo:</strong> Prevent unnecessary re-renders
                  </li>
                  <li>
                    <strong>useMemo:</strong> Memoize expensive calculations
                  </li>
                  <li>
                    <strong>useCallback:</strong> Memoize event handlers
                  </li>
                  <li>
                    <strong>Lazy loading:</strong> Load components on demand
                  </li>
                  <li>
                    <strong>Code splitting:</strong> Split bundle for better
                    performance
                  </li>
                </ul>
              </div>
            </div>

            {/* Best Practices */}
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
                ✅ Best Practices
              </h3>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>Cleanup effects:</strong> Always return cleanup
                    function
                  </li>
                  <li>
                    <strong>Dependency arrays:</strong> Include all dependencies
                  </li>
                  <li>
                    <strong>Avoid side effects in render:</strong> Use useEffect
                  </li>
                  <li>
                    <strong>Optimize re-renders:</strong> Use proper
                    dependencies
                  </li>
                  <li>
                    <strong>Handle errors gracefully:</strong> Use error
                    boundaries
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Lifecycle Methods Overview */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">Lifecycle Methods Overview</h2>
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
                🚀 Mounting
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                Component creation and initial render
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
                🔄 Updating
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                Props/state changes trigger updates
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
                🗑️ Unmounting
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                Component removal and cleanup
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
                🚨 Error Handling
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                Catch and handle JavaScript errors
              </p>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">
            Problem: Understanding Component Lifecycle
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            Create a component that demonstrates the different lifecycle phases
            in React.
          </p>

          <div
            style={{
              background: '#f8f9fa',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
            }}
          >
            <h3 style={{ marginBottom: '0.5rem' }}>Requirements:</h3>
            <ul style={{ marginLeft: '1rem' }}>
              <li>Use useEffect to handle component mounting and unmounting</li>
              <li>Track state changes and log them</li>
              <li>Implement cleanup function</li>
            </ul>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Live Demo:</h3>
          <div style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: '1rem' }}>
              Component Status:{' '}
              <span
                style={{
                  color: mounted
                    ? 'var(--success-color)'
                    : 'var(--warning-color)',
                }}
              >
                {mounted ? 'Mounted' : 'Mounting...'}
              </span>
            </p>
            <p style={{ marginBottom: '1rem' }}>Current Phase: {phase}</p>
            <p style={{ marginBottom: '1rem' }}>Count: {count}</p>
            <button
              className="btn btn-primary"
              onClick={() => setCount(count + 1)}
              style={{ marginRight: '1rem' }}
            >
              Increment
            </button>
            <button className="btn btn-outline" onClick={() => setCount(0)}>
              Reset
            </button>
            <button
              className="btn btn-outline"
              onClick={clearLogs}
              style={{ marginLeft: '1rem' }}
            >
              Clear Logs
            </button>
          </div>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              marginTop: '1rem',
            }}
          >
            Check the browser console to see lifecycle logs.
          </p>
        </div>

        {/* Lifecycle Logs */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>📋 Lifecycle Logs:</h3>
          <div
            style={{
              maxHeight: '200px',
              overflow: 'auto',
              background: '#1e293b',
              color: '#e2e8f0',
              padding: '1rem',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}
          >
            {lifecycleLogs.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>
                No logs yet. Interact with the component to see lifecycle
                events.
              </p>
            ) : (
              lifecycleLogs.map((log, index) => (
                <div key={index} style={{ marginBottom: '0.25rem' }}>
                  {log}
                </div>
              ))
            )}
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
            {/* useEffect Patterns */}
            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ color: '#1e40af', marginBottom: '0.75rem' }}>
                🎯 useEffect Patterns
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
                {`// ✅ Run only on mount
useEffect(() => {
  // Setup code
  return () => {
    // Cleanup code
  };
}, []);

// ✅ Run on dependency changes
useEffect(() => {
  // Effect code
}, [dependency]);

// ✅ Run on every render (avoid)
useEffect(() => {
  // Effect code
});

// ❌ Missing dependencies
useEffect(() => {
  setCount(count + 1);
}, []); // Missing count dependency`}
              </pre>
            </div>

            {/* Class vs Functional */}
            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ color: '#059669', marginBottom: '0.75rem' }}>
                🔄 Class vs Functional
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
                {`// Class Component
componentDidMount() {
  // Setup
}

componentDidUpdate(prevProps, prevState) {
  // Update logic
}

componentWillUnmount() {
  // Cleanup
}

// Functional Component
useEffect(() => {
  // Setup
  return () => {
    // Cleanup
  };
}, []);

useEffect(() => {
  // Update logic
}, [dependency]);`}
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

// ✅ Memoize callbacks
const handleClick = useCallback(() => {
  setCount(prev => prev + 1);
}, []);

// ✅ Prevent unnecessary re-renders
const MemoizedComponent = React.memo(MyComponent);

// ✅ Lazy load components
const LazyComponent = lazy(() => import('./Component'));`}
              </pre>
            </div>

            {/* Error Handling */}
            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ color: '#ef4444', marginBottom: '0.75rem' }}>
                🚨 Error Handling
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
                {`// ✅ Error Boundary
class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    logError(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}

// ✅ Try-catch in effects
useEffect(() => {
  try {
    // Risky operation
  } catch (error) {
    // Handle error
  }
}, []);`}
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
                <li>What are the different lifecycle phases in React?</li>
                <li>
                  How do you handle side effects in functional components?
                </li>
                <li>
                  What's the difference between componentDidMount and useEffect?
                </li>
                <li>How do you prevent memory leaks in React?</li>
                <li>When should you use useMemo and useCallback?</li>
                <li>How do you handle errors in React components?</li>
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
                <li>Always return cleanup function from useEffect</li>
                <li>Include all dependencies in dependency array</li>
                <li>Use React.memo for expensive components</li>
                <li>Implement error boundaries for error handling</li>
                <li>Avoid side effects in render method</li>
                <li>Use lazy loading for better performance</li>
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
                <li>Custom hooks for lifecycle logic</li>
                <li>React.memo and performance optimization</li>
                <li>Error boundary patterns</li>
                <li>Code splitting and lazy loading</li>
                <li>Memory leak prevention</li>
                <li>Component composition patterns</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Key Concepts:</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div
              style={{
                padding: '1rem',
                background: '#eff6ff',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>
                Mounting Phase
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                When a component is first created and added to the DOM.
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
                Updating Phase
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                When a component re-renders due to props or state changes.
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
                Unmounting Phase
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                When a component is removed from the DOM.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Resizable Code Example */}
      <ResizableCodePanel>
        <h3 style={{ color: '#569cd6', marginBottom: '1rem' }}>
          Component Lifecycle Examples
        </h3>
        <pre style={{ margin: 0 }}>
          {`// 1. Basic useEffect for mounting
useEffect(() => {
  console.log('Component mounted');
  // Setup subscriptions, API calls, etc.
  
  return () => {
    console.log('Component will unmount');
    // Cleanup subscriptions, timers, etc.
  };
}, []);

// 2. useEffect with dependencies
useEffect(() => {
  console.log('Count changed:', count);
  // Effect runs when count changes
}, [count]);

// 3. useEffect for cleanup
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Timer tick');
  }, 1000);
  
  return () => {
    clearInterval(timer); // Cleanup
  };
}, []);

// 4. Multiple effects
useEffect(() => {
  // Effect 1: Run only on mount
}, []);

useEffect(() => {
  // Effect 2: Run on every render
});

useEffect(() => {
  // Effect 3: Run when dependency changes
}, [dependency]);

/**
 * 🎯 COMPONENT LIFECYCLE EXPLANATION
 * 
 * React components go through three main phases:
 * 
 * 1. 📦 MOUNTING PHASE:
 *    - Component is created and added to DOM
 *    - Constructor runs (class components)
 *    - Initial render occurs
 *    - useEffect with [] runs (functional)
 *    - componentDidMount runs (class)
 * 
 * 2. 🔄 UPDATING PHASE:
 *    - Props or state changes trigger re-render
 *    - useEffect with dependencies runs
 *    - componentDidUpdate runs (class)
 *    - Should handle side effects carefully
 * 
 * 3. 🗑️ UNMOUNTING PHASE:
 *    - Component is removed from DOM
 *    - Cleanup function runs (useEffect return)
 *    - componentWillUnmount runs (class)
 *    - Cancel subscriptions, timers, etc.
 * 
 * Key concepts:
 * - 📊 useEffect replaces lifecycle methods
 * - 🧹 Always return cleanup function
 * - 🎯 Use dependency arrays correctly
 * - ⚡ Optimize with useMemo/useCallback
 */`}
        </pre>
      </ResizableCodePanel>
    </div>
  );
};

export default ComponentLifecycle;
