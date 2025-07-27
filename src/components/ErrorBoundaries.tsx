import { Component, useState, useEffect, useCallback } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import ResizableCodePanel from './ResizableCodePanel';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

// Error Boundary Class Component (must remain class component due to React limitations)
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console or error reporting service
    console.error('Error caught by boundary:', error, errorInfo);

    this.setState({ error, errorInfo });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div
          style={{
            padding: '2rem',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            backgroundColor: '#fef2f2',
            color: '#991b1b',
          }}
        >
          <h2>Something went wrong!</h2>
          <p>We're sorry, but something unexpected happened.</p>
          <button
            onClick={() =>
              this.setState({
                hasError: false,
                error: undefined,
                errorInfo: undefined,
              })
            }
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
            Try Again
          </button>
          {import.meta.env.DEV && this.state.error && (
            <details style={{ marginTop: '1rem' }}>
              <summary>Error Details (Development)</summary>
              <pre
                style={{
                  backgroundColor: '#1f2937',
                  color: '#f9fafb',
                  padding: '1rem',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '0.875rem',
                }}
              >
                {this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Modern Function Components
const BuggyCounter = () => {
  const [count, setCount] = useState(0);

  if (count === 5) {
    throw new Error('I crashed at count 5!');
  }

  return (
    <div
      style={{
        padding: '1rem',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        marginBottom: '1rem',
      }}
    >
      <h3>Buggy Counter</h3>
      <p>Count: {count}</p>
      <button
        onClick={() => setCount(count + 1)}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Increment
      </button>
      <p
        style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}
      >
        This component will crash when count reaches 5
      </p>
    </div>
  );
};

const AsyncErrorComponent = () => {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call that might fail
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate random error
        if (Math.random() > 0.5) {
          throw new Error('Failed to fetch data from API');
        }

        setData('Successfully loaded data!');
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>{data}</div>;
};

// Custom error reporting hook
const useErrorReporter = () => {
  const reportError = useCallback((error: Error, errorInfo: ErrorInfo) => {
    // In a real app, you would send this to your error reporting service
    console.log('Reporting error to service:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  }, []);

  return { reportError };
};

// Custom fallback component
const CustomFallback = ({
  resetError,
}: {
  error: Error;
  resetError: () => void;
}) => (
  <div
    style={{
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: '#f3f4f6',
      borderRadius: '8px',
      border: '2px dashed #d1d5db',
    }}
  >
    <h3 style={{ color: '#374151', marginBottom: '1rem' }}>
      Oops! Something went wrong
    </h3>
    <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
      We encountered an unexpected error. Don't worry, it's not your fault!
    </p>
    <button
      onClick={resetError}
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
      Try Again
    </button>
  </div>
);

// Modern Error Boundary Wrapper (Function Component)
const ErrorBoundaryWrapper = ({ children, fallback, onError }: Props) => {
  return (
    <ErrorBoundary fallback={fallback} onError={onError}>
      {children}
    </ErrorBoundary>
  );
};

const ErrorBoundaries = () => {
  const { reportError } = useErrorReporter();
  const [key, setKey] = useState(0);

  const resetComponent = useCallback(() => {
    setKey(prev => prev + 1);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left side - Content */}
      <div style={{ flex: 1, padding: '2rem' }}>
        <h1 className="heading-primary">Error Boundaries in React</h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
          }}
        >
          Learn how to catch and handle JavaScript errors in React components
          using Error Boundaries.
        </p>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">What are Error Boundaries?</h2>
          <p style={{ marginBottom: '1rem' }}>
            Error Boundaries are React components that catch JavaScript errors
            anywhere in their child component tree, log those errors, and
            display a fallback UI instead of the component tree that crashed.
          </p>
          <ul style={{ listStyle: 'disc', paddingLeft: '2rem' }}>
            <li>
              Must be class components (not function components) - React
              limitation
            </li>
            <li>Only catch errors in the component tree below them</li>
            <li>
              Don't catch errors in event handlers, async code, or server-side
              rendering
            </li>
            <li>Provide graceful degradation when errors occur</li>
          </ul>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">Demo: Buggy Counter</h2>
          <p style={{ marginBottom: '1rem' }}>
            This counter will crash when it reaches 5. The Error Boundary will
            catch the error and show a fallback UI.
          </p>
          <ErrorBoundaryWrapper
            key={key}
            onError={reportError}
            fallback={
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #ef4444',
                  borderRadius: '8px',
                }}
              >
                <h4 style={{ color: '#991b1b', marginBottom: '0.5rem' }}>
                  Counter crashed!
                </h4>
                <button
                  onClick={resetComponent}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Reset Counter
                </button>
              </div>
            }
          >
            <BuggyCounter />
          </ErrorBoundaryWrapper>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">Demo: Async Error</h2>
          <p style={{ marginBottom: '1rem' }}>
            This component simulates an async operation that might fail
            randomly.
          </p>
          <ErrorBoundaryWrapper
            onError={reportError}
            fallback={
              <CustomFallback
                error={new Error('Async error')}
                resetError={() => window.location.reload()}
              />
            }
          >
            <AsyncErrorComponent />
          </ErrorBoundaryWrapper>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">Error Boundary Best Practices</h2>
          <ul style={{ listStyle: 'disc', paddingLeft: '2rem' }}>
            <li>Place error boundaries strategically in your component tree</li>
            <li>Use them to catch errors in specific features or sections</li>
            <li>Provide meaningful fallback UI</li>
            <li>Log errors to your error reporting service</li>
            <li>Consider providing a way to recover from errors</li>
            <li>Test error boundaries with intentional errors</li>
          </ul>
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
                    <strong>What are Error Boundaries?</strong> - Components
                    that catch JavaScript errors in child components
                  </li>
                  <li>
                    <strong>
                      Why must Error Boundaries be class components?
                    </strong>{' '}
                    - React limitation, only class components have error
                    lifecycle methods
                  </li>
                  <li>
                    <strong>What errors do Error Boundaries catch?</strong> -
                    JavaScript errors in render, lifecycle methods, and
                    constructors
                  </li>
                  <li>
                    <strong>What errors do Error Boundaries NOT catch?</strong>{' '}
                    - Event handlers, async code, server-side rendering, errors
                    thrown in the boundary itself
                  </li>
                  <li>
                    <strong>How to handle async errors?</strong> - Use try-catch
                    in async functions or error handling in promises
                  </li>
                  <li>
                    <strong>What is getDerivedStateFromError?</strong> - Static
                    method to update state when an error occurs
                  </li>
                  <li>
                    <strong>What is componentDidCatch?</strong> - Lifecycle
                    method for side effects like error logging
                  </li>
                  <li>
                    <strong>How to test Error Boundaries?</strong> -
                    Intentionally throw errors in child components
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
                    <strong>Must be class components</strong> - Function
                    components cannot be error boundaries
                  </li>
                  <li>
                    <strong>Only catch errors below them</strong> - Errors in
                    siblings or parents are not caught
                  </li>
                  <li>
                    <strong>Provide fallback UI</strong> - Always render
                    something when errors occur
                  </li>
                  <li>
                    <strong>Log errors properly</strong> - Use componentDidCatch
                    for error reporting
                  </li>
                  <li>
                    <strong>Strategic placement</strong> - Place boundaries
                    around critical features
                  </li>
                  <li>
                    <strong>Recovery mechanisms</strong> - Provide ways to reset
                    or retry
                  </li>
                  <li>
                    <strong>Development vs Production</strong> - Different error
                    handling strategies
                  </li>
                  <li>
                    <strong>Error boundaries don't prevent crashes</strong> -
                    They provide graceful degradation
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
                    <strong>Nested Error Boundaries</strong> - Multiple layers
                    of error handling
                  </li>
                  <li>
                    <strong>Custom Error Reporting</strong> - Integration with
                    services like Sentry
                  </li>
                  <li>
                    <strong>Error Boundary Composition</strong> - Combining with
                    other patterns
                  </li>
                  <li>
                    <strong>Async Error Handling</strong> - Error boundaries
                    with async operations
                  </li>
                  <li>
                    <strong>Error Boundary Testing</strong> - Unit and
                    integration testing strategies
                  </li>
                  <li>
                    <strong>Performance Considerations</strong> - Impact on
                    bundle size and runtime
                  </li>
                  <li>
                    <strong>Error Boundary Patterns</strong> - Common
                    implementation patterns
                  </li>
                  <li>
                    <strong>Future of Error Boundaries</strong> - React 18+
                    improvements
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
                    <strong>Trying to use function components</strong> - Only
                    class components work
                  </li>
                  <li>
                    <strong>Not handling async errors</strong> - Error
                    boundaries don't catch async errors
                  </li>
                  <li>
                    <strong>Poor error logging</strong> - Missing important
                    error context
                  </li>
                  <li>
                    <strong>No recovery mechanism</strong> - Users stuck with
                    error state
                  </li>
                  <li>
                    <strong>Over-nesting boundaries</strong> - Performance
                    impact and complexity
                  </li>
                  <li>
                    <strong>Ignoring error boundaries</strong> - No graceful
                    error handling
                  </li>
                  <li>
                    <strong>Not testing error scenarios</strong> - Errors only
                    discovered in production
                  </li>
                  <li>
                    <strong>Poor fallback UI</strong> - Bad user experience
                    during errors
                  </li>
                </ul>
              </div>
            </div>

            {/* Error Handling Libraries */}
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
                    <strong>Sentry</strong> - Error monitoring and reporting
                  </li>
                  <li>
                    <strong>LogRocket</strong> - Session replay and error
                    tracking
                  </li>
                  <li>
                    <strong>Bugsnag</strong> - Error monitoring platform
                  </li>
                  <li>
                    <strong>React Error Boundary</strong> - Community error
                    boundary library
                  </li>
                  <li>
                    <strong>React Testing Library</strong> - Testing error
                    scenarios
                  </li>
                  <li>
                    <strong>Jest</strong> - Unit testing error boundaries
                  </li>
                  <li>
                    <strong>TypeScript</strong> - Type safety for error handling
                  </li>
                  <li>
                    <strong>Custom error reporting</strong> - Building your own
                    error system
                  </li>
                </ul>
              </div>
            </div>

            {/* Error Boundary Patterns */}
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
                🎨 Error Boundary Patterns
              </h3>
              <div
                style={{
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                }}
              >
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>Top-level Boundary</strong> - Catch all app errors
                  </li>
                  <li>
                    <strong>Feature Boundaries</strong> - Protect specific
                    features
                  </li>
                  <li>
                    <strong>Component Boundaries</strong> - Protect individual
                    components
                  </li>
                  <li>
                    <strong>Recovery Boundaries</strong> - Allow error recovery
                  </li>
                  <li>
                    <strong>Logging Boundaries</strong> - Focus on error
                    reporting
                  </li>
                  <li>
                    <strong>Graceful Degradation</strong> - Show alternative UI
                  </li>
                  <li>
                    <strong>Error Retry</strong> - Automatic retry mechanisms
                  </li>
                  <li>
                    <strong>Error Prevention</strong> - Proactive error handling
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
          Error Boundaries Examples
        </h3>
        <pre style={{ margin: 0 }}>
          {`// 1. Basic Error Boundary (Must be Class Component)
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// 2. Modern Function Component Wrapper
const ErrorBoundaryWrapper = ({ children, fallback, onError }: Props) => {
  return (
    <ErrorBoundary fallback={fallback} onError={onError}>
      {children}
    </ErrorBoundary>
  );
};

// 3. Error Boundary with Custom Fallback
class ErrorBoundary extends Component<Props, State> {
  // ... constructor and lifecycle methods

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultFallback />;
    }
    return this.props.children;
  }
}

// 4. Error Boundary with Error Reporting
class ErrorBoundary extends Component<Props, State> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Send to error reporting service
    this.props.onError?.(error, errorInfo);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
    }
  }
}

// 5. Using Error Boundaries
const App = () => {
  return (
    <ErrorBoundaryWrapper fallback={<AppErrorFallback />}>
      <Header />
      <ErrorBoundaryWrapper fallback={<FeatureErrorFallback />}>
        <FeatureComponent />
      </ErrorBoundaryWrapper>
      <Footer />
    </ErrorBoundaryWrapper>
  );
};

// 6. Error Boundary with Recovery
class RecoverableErrorBoundary extends Component<Props, State> {
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// 7. Error Boundary for Specific Errors
class SpecificErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    if (error.message.includes('API')) {
      return { hasError: true, error, errorType: 'API_ERROR' };
    }
    if (error.message.includes('Network')) {
      return { hasError: true, error, errorType: 'NETWORK_ERROR' };
    }
    return { hasError: true, error, errorType: 'UNKNOWN_ERROR' };
  }

  render() {
    if (this.state.hasError) {
      switch (this.state.errorType) {
        case 'API_ERROR':
          return <ApiErrorFallback />;
        case 'NETWORK_ERROR':
          return <NetworkErrorFallback />;
        default:
          return <GenericErrorFallback />;
      }
    }
    return this.props.children;
  }
}

// 8. Error Boundary with Context
class ErrorBoundaryWithContext extends Component<Props, State> {
  static contextType = ErrorContext;

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.context.reportError(error, errorInfo);
  }
}

// 9. Testing Error Boundaries
const TestComponent = () => {
  throw new Error('Test error');
};

// In test
render(
  <ErrorBoundaryWrapper>
    <TestComponent />
  </ErrorBoundaryWrapper>
);

// 10. Error Boundary with Suspense
const App = () => (
  <ErrorBoundaryWrapper>
    <Suspense fallback={<Loading />}>
      <AsyncComponent />
    </Suspense>
  </ErrorBoundaryWrapper>
);

// 11. Modern Error Handling Hook (for function components)
const useErrorBoundary = () => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const resetError = useCallback(() => {
    setHasError(false);
    setError(null);
  }, []);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setError(event.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return { hasError, error, resetError };
};`}
        </pre>
      </ResizableCodePanel>
    </div>
  );
};

export default ErrorBoundaries;
