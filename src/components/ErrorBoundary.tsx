import React, { Component, type ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    // Log to external service (in production)
    if (
      typeof process !== 'undefined' &&
      process.env &&
      process.env.NODE_ENV === 'production'
    ) {
      // Example: logErrorToService(error, errorInfo);
    }

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="error-boundary"
          style={{
            padding: '2rem',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            borderRadius: '12px',
            border: '2px solid #ef4444',
            margin: '1rem',
          }}
        >
          <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>
            🚨 Something went wrong
          </h2>
          <p style={{ color: '#7f1d1d', marginBottom: '1rem' }}>
            An error occurred while rendering this component.
          </p>
          <button
            onClick={() =>
              this.setState({
                hasError: false,
                error: undefined,
                errorInfo: undefined,
              })
            }
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
            }}
          >
            Try Again
          </button>
          {typeof process !== 'undefined' &&
            process.env &&
            process.env.NODE_ENV === 'development' &&
            this.state.error && (
              <details style={{ marginTop: '1rem', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', color: '#dc2626' }}>
                  Error Details (Development)
                </summary>
                <pre
                  style={{
                    background: '#1e293b',
                    color: '#e2e8f0',
                    padding: '1rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    overflow: 'auto',
                    marginTop: '0.5rem',
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Global Error Boundary for the entire app
export class GlobalErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Global error caught:', error, errorInfo);

    // In production, you would send this to an error reporting service
    if (
      typeof process !== 'undefined' &&
      process.env &&
      process.env.NODE_ENV === 'production'
    ) {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '3rem',
              textAlign: 'center',
              maxWidth: '500px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h1 style={{ color: '#dc2626', marginBottom: '1rem' }}>
              🚨 Application Error
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              Something went wrong with the application. Please refresh the page
              to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.4)',
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
