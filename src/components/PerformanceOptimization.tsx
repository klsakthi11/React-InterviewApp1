import { useState, useMemo, useCallback, memo } from 'react';
import ResizableCodePanel from './ResizableCodePanel';

// Memoized child component
const ExpensiveComponent = memo(
  ({
    value,
    onUpdate,
  }: {
    value: number;
    onUpdate: (value: number) => void;
  }) => {
    console.log('ExpensiveComponent rendered');

    // Simulate expensive computation
    const expensiveValue = useMemo(() => {
      let result = 0;
      for (let i = 0; i < 1000000; i++) {
        result += Math.random();
      }
      return result;
    }, [value]);

    return (
      <div
        style={{
          padding: '1rem',
          background: '#f0fdf4',
          borderRadius: '8px',
          marginBottom: '1rem',
        }}
      >
        <h4>Expensive Component</h4>
        <p>Value: {value}</p>
        <p>Expensive calculation: {expensiveValue.toFixed(2)}</p>
        <button className="btn btn-primary" onClick={() => onUpdate(value + 1)}>
          Update Value
        </button>
      </div>
    );
  }
);

// Virtual scrolling simulation
const VirtualList = ({ items }: { items: string[] }) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  const itemHeight = 50;
  const containerHeight = 400;

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end);
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  return (
    <div
      style={{
        height: containerHeight,
        overflow: 'auto',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
      }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div
              key={visibleRange.start + index}
              style={{
                height: itemHeight,
                padding: '1rem',
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Item {visibleRange.start + index + 1}: {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PerformanceOptimization = () => {
  const [count, setCount] = useState(0);
  const [expensiveValue, setExpensiveValue] = useState(0);
  const [showExpensive, setShowExpensive] = useState(true);

  // Memoized expensive calculation
  const memoizedValue = useMemo(() => {
    console.log('Computing memoized value...');
    return count * 2;
  }, [count]);

  // Memoized callback
  const handleExpensiveUpdate = useCallback((value: number) => {
    setExpensiveValue(value);
  }, []);

  // Generate large list for virtual scrolling demo
  const largeList = useMemo(() => {
    return Array.from(
      { length: 10000 },
      (_, i) => `Item ${i + 1} with some content`
    );
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left side - Content */}
      <div style={{ flex: 1, padding: '2rem' }}>
        <h1 className="heading-primary">Performance Optimization</h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
          }}
        >
          Learn and practice various React performance optimization techniques.
        </p>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">
            Problem: React Performance Optimization
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            Learn and practice various React performance optimization
            techniques.
          </p>

          <div
            style={{
              background: '#f8f9fa',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
            }}
          >
            <h3 style={{ marginBottom: '0.5rem' }}>Techniques Covered:</h3>
            <ul style={{ marginLeft: '1rem' }}>
              <li>React.memo - Component memoization</li>
              <li>useMemo - Value memoization</li>
              <li>useCallback - Function memoization</li>
              <li>Virtual scrolling for large lists</li>
              <li>Code splitting and lazy loading</li>
            </ul>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Live Demo:</h3>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Basic Performance Demo */}
            <div
              style={{
                padding: '1rem',
                background: '#eff6ff',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ marginBottom: '0.5rem' }}>
                Basic Performance Demo:
              </h4>
              <p>Count: {count}</p>
              <p>Memoized value: {memoizedValue}</p>
              <div
                style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}
              >
                <button
                  className="btn btn-primary"
                  onClick={() => setCount(count + 1)}
                >
                  Increment Count
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowExpensive(!showExpensive)}
                >
                  {showExpensive ? 'Hide' : 'Show'} Expensive Component
                </button>
              </div>
              {showExpensive && (
                <ExpensiveComponent
                  value={expensiveValue}
                  onUpdate={handleExpensiveUpdate}
                />
              )}
            </div>

            {/* Virtual Scrolling Demo */}
            <div
              style={{
                padding: '1rem',
                background: '#f0fdf4',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ marginBottom: '0.5rem' }}>
                Virtual Scrolling Demo:
              </h4>
              <p>Rendering 10,000 items efficiently</p>
              <VirtualList items={largeList} />
            </div>

            {/* Performance Tips */}
            <div
              style={{
                padding: '1rem',
                background: '#fef2f2',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ marginBottom: '0.5rem' }}>Performance Tips:</h4>
              <ul style={{ marginLeft: '1rem' }}>
                <li>Use React DevTools Profiler to identify bottlenecks</li>
                <li>Implement React.memo for expensive components</li>
                <li>Use useMemo for expensive calculations</li>
                <li>Use useCallback to prevent unnecessary re-renders</li>
                <li>Consider virtual scrolling for large lists</li>
                <li>Implement code splitting with React.lazy()</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Key Concepts:</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div
              style={{
                padding: '1rem',
                background: '#eff6ff',
                borderRadius: '8px',
              }}
            >
              <strong>React.memo:</strong> Prevents re-renders when props
              haven't changed
            </div>
            <div
              style={{
                padding: '1rem',
                background: '#f0fdf4',
                borderRadius: '8px',
              }}
            >
              <strong>useMemo:</strong> Memoizes expensive calculations to avoid
              recomputation
            </div>
            <div
              style={{
                padding: '1rem',
                background: '#fef2f2',
                borderRadius: '8px',
              }}
            >
              <strong>useCallback:</strong> Memoizes functions to prevent child
              re-renders
            </div>
            <div
              style={{
                padding: '1rem',
                background: '#fffbeb',
                borderRadius: '8px',
              }}
            >
              <strong>Virtual Scrolling:</strong> Only renders visible items in
              large lists
            </div>
          </div>
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
                    <strong>How do you optimize React performance?</strong> -
                    Use React.memo, useMemo, useCallback, code splitting
                  </li>
                  <li>
                    <strong>When should you use React.memo?</strong> - When
                    components re-render frequently with same props
                  </li>
                  <li>
                    <strong>
                      What's the difference between useMemo and useCallback?
                    </strong>{' '}
                    - useMemo for values, useCallback for functions
                  </li>
                  <li>
                    <strong>How do you handle large lists in React?</strong> -
                    Virtual scrolling, pagination, windowing
                  </li>
                  <li>
                    <strong>What is code splitting?</strong> - Breaking bundle
                    into smaller chunks loaded on demand
                  </li>
                  <li>
                    <strong>
                      How do you identify performance bottlenecks?
                    </strong>{' '}
                    - React DevTools Profiler, performance monitoring
                  </li>
                  <li>
                    <strong>What is lazy loading?</strong> - Loading components
                    only when needed
                  </li>
                  <li>
                    <strong>How do you optimize bundle size?</strong> - Tree
                    shaking, code splitting, removing unused dependencies
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
                    <strong>Measure before optimizing</strong> - Use profiling
                    tools to identify bottlenecks
                  </li>
                  <li>
                    <strong>Don't over-optimize</strong> - Optimization has its
                    own overhead
                  </li>
                  <li>
                    <strong>Focus on user experience</strong> - Optimize what
                    users actually notice
                  </li>
                  <li>
                    <strong>Bundle size matters</strong> - Smaller bundles load
                    faster
                  </li>
                  <li>
                    <strong>Network optimization</strong> - Consider loading
                    times and caching
                  </li>
                  <li>
                    <strong>Memory management</strong> - Avoid memory leaks and
                    excessive memory usage
                  </li>
                  <li>
                    <strong>Progressive enhancement</strong> - App should work
                    without optimizations
                  </li>
                  <li>
                    <strong>Monitor in production</strong> - Real user metrics
                    are most important
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
                    <strong>Concurrent features</strong> - React 18+ concurrent
                    rendering
                  </li>
                  <li>
                    <strong>Server-side rendering</strong> - SSR performance
                    considerations
                  </li>
                  <li>
                    <strong>Web Workers</strong> - Offloading heavy computations
                  </li>
                  <li>
                    <strong>Service Workers</strong> - Caching and offline
                    functionality
                  </li>
                  <li>
                    <strong>WebAssembly</strong> - High-performance computations
                  </li>
                  <li>
                    <strong>Micro-frontends</strong> - Performance in
                    distributed architectures
                  </li>
                  <li>
                    <strong>GraphQL optimization</strong> - Efficient data
                    fetching
                  </li>
                  <li>
                    <strong>Progressive Web Apps</strong> - Performance and
                    offline capabilities
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
                    <strong>Premature optimization</strong> - Optimizing before
                    identifying bottlenecks
                  </li>
                  <li>
                    <strong>Over-memoization</strong> - Memoizing everything
                    without measuring impact
                  </li>
                  <li>
                    <strong>Ignoring bundle size</strong> - Large bundles slow
                    down initial load
                  </li>
                  <li>
                    <strong>Not considering network</strong> - Slow networks
                    need different strategies
                  </li>
                  <li>
                    <strong>Memory leaks</strong> - Not cleaning up
                    subscriptions and timers
                  </li>
                  <li>
                    <strong>Blocking the main thread</strong> - Heavy
                    computations in render
                  </li>
                  <li>
                    <strong>Not testing on real devices</strong> - Development
                    performance differs
                  </li>
                  <li>
                    <strong>Ignoring user metrics</strong> - Not measuring real
                    user experience
                  </li>
                </ul>
              </div>
            </div>

            {/* Performance Libraries */}
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
                📚 Related Libraries & Tools
              </h3>
              <div
                style={{
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                }}
              >
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>React DevTools</strong> - Built-in profiling and
                    debugging
                  </li>
                  <li>
                    <strong>Lighthouse</strong> - Performance auditing tool
                  </li>
                  <li>
                    <strong>Webpack Bundle Analyzer</strong> - Bundle size
                    analysis
                  </li>
                  <li>
                    <strong>React Window</strong> - Virtual scrolling library
                  </li>
                  <li>
                    <strong>React Virtualized</strong> - Efficient list
                    rendering
                  </li>
                  <li>
                    <strong>why-did-you-render</strong> - Detect unnecessary
                    re-renders
                  </li>
                  <li>
                    <strong>React Query</strong> - Data fetching and caching
                  </li>
                  <li>
                    <strong>SWR</strong> - React hooks for data fetching
                  </li>
                </ul>
              </div>
            </div>

            {/* Performance Patterns */}
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
                🎨 Performance Patterns
              </h3>
              <div
                style={{
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                }}
              >
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>Component splitting</strong> - Breaking large
                    components
                  </li>
                  <li>
                    <strong>Lazy loading</strong> - Loading components on demand
                  </li>
                  <li>
                    <strong>Code splitting</strong> - Splitting bundles by
                    routes
                  </li>
                  <li>
                    <strong>Virtual scrolling</strong> - Rendering only visible
                    items
                  </li>
                  <li>
                    <strong>Debouncing</strong> - Limiting function calls
                  </li>
                  <li>
                    <strong>Throttling</strong> - Controlling function execution
                    rate
                  </li>
                  <li>
                    <strong>Memoization</strong> - Caching expensive
                    computations
                  </li>
                  <li>
                    <strong>Optimistic updates</strong> - Immediate UI feedback
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
          Performance Optimization Examples
        </h3>
        <pre style={{ margin: 0 }}>
          {`// 1. React.memo for Component Memoization
const ExpensiveComponent = memo(({ value, onUpdate }) => {
  console.log('ExpensiveComponent rendered');

  const expensiveValue = useMemo(() => {
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.random();
    }
    return result;
  }, [value]);

  return (
    <div>
      <p>Value: {value}</p>
      <p>Expensive calculation: {expensiveValue.toFixed(2)}</p>
      <button onClick={() => onUpdate(value + 1)}>Update Value</button>
    </div>
  );
});

// 2. useMemo for Expensive Calculations
const MyComponent = () => {
  const [count, setCount] = useState(0);

  const memoizedValue = useMemo(() => {
    console.log('Computing memoized value...');
    return count * 2;
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Memoized value: {memoizedValue}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

// 3. useCallback for Function Memoization
const ParentComponent = () => {
  const [count, setCount] = useState(0);

  const handleUpdate = useCallback((value) => {
    setCount(value);
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <ExpensiveComponent value={count} onUpdate={handleUpdate} />
    </div>
  );
};

// 4. Virtual Scrolling for Large Lists
const VirtualList = ({ items }) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  const itemHeight = 50;
  const containerHeight = 400;

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end);
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  return (
    <div style={{ height: containerHeight, overflow: 'auto' }}>
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: \`translateY(\${offsetY}px)\` }}>
          {visibleItems.map((item, index) => (
            <div key={visibleRange.start + index} style={{ height: itemHeight }}>
              Item {visibleRange.start + index + 1}: {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 5. Code Splitting with React.lazy
const LazyComponent = lazy(() => import('./LazyComponent'));

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <LazyComponent />
  </Suspense>
);

// 6. Custom Comparison Function for React.memo
const UserItem = memo(({ user, onSelect }) => {
  return (
    <div onClick={() => onSelect(user.id)}>
      <h4>{user.name}</h4>
      <p>{user.email}</p>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if id or name changes
  return prevProps.user.id === nextProps.user.id && 
         prevProps.user.name === nextProps.user.name;
});

// 7. Performance Monitoring
const useRenderCount = () => {
  const renderCount = useRef(0);
  renderCount.current += 1;
  
  useEffect(() => {
    console.log(\`Component rendered \${renderCount.current} times\`);
  });
  
  return renderCount.current;
};

// 8. Debounced Input
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

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

// 9. Optimized List Rendering
const OptimizedList = ({ items }) => {
  const [filteredItems, setFilteredItems] = useState(items);
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [items, debouncedSearchTerm]);

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      {filteredItems.map(item => (
        <UserItem key={item.id} user={item} />
      ))}
    </div>
  );
};

// 10. Web Workers for Heavy Computations
const useWorker = (workerFunction) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback((data) => {
    setLoading(true);
    
    const worker = new Worker(URL.createObjectURL(
      new Blob([\`self.onmessage = \${workerFunction.toString()}\`])
    ));
    
    worker.onmessage = (event) => {
      setResult(event.data);
      setLoading(false);
      worker.terminate();
    };
    
    worker.postMessage(data);
  }, [workerFunction]);

  return { result, loading, execute };
};

// 11. Intersection Observer for Lazy Loading
const useIntersectionObserver = (ref, options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
};

// 12. Performance Best Practices
const PerformanceTips = () => (
  <div>
    <h3>Performance Best Practices:</h3>
    <ul>
      <li>Use React DevTools Profiler to identify bottlenecks</li>
      <li>Implement React.memo for expensive components</li>
      <li>Use useMemo for expensive calculations</li>
      <li>Use useCallback to prevent unnecessary re-renders</li>
      <li>Consider virtual scrolling for large lists</li>
      <li>Implement code splitting with React.lazy()</li>
      <li>Use Web Workers for heavy computations</li>
      <li>Optimize images and assets</li>
      <li>Use production builds</li>
      <li>Monitor bundle size</li>
    </ul>
  </div>
);`}
        </pre>
      </ResizableCodePanel>
    </div>
  );
};

export default PerformanceOptimization;
