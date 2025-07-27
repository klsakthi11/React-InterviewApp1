import { useState, useEffect, useRef } from 'react';

interface InteractiveDemoProps {
  title: string;
  description: string;
  initialCode: string;
  onCodeChange?: (code: string) => void;
  children: React.ReactNode;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags?: string[];
}

const InteractiveDemo = ({
  title,
  description,
  initialCode,
  onCodeChange,
  children,
  difficulty = 'beginner',
  tags = [],
}: InteractiveDemoProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState(initialCode);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  const difficultyColors = {
    beginner: '#10b981',
    intermediate: '#f59e0b',
    advanced: '#ef4444',
    expert: '#8b5cf6',
  };

  const handleRunDemo = () => {
    setIsRunning(true);
    setError(null);
    const startTime = performance.now();

    // Simulate demo execution
    setTimeout(() => {
      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
      setIsRunning(false);

      // Trigger any code change callbacks
      if (onCodeChange) {
        onCodeChange(code);
      }
    }, 500);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setError(null);
  };

  const resetDemo = () => {
    setCode(initialCode);
    setError(null);
    setExecutionTime(0);
    setIsRunning(false);
  };

  return (
    <div
      ref={demoRef}
      style={{
        background: 'white',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Demo Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1rem',
          }}
        >
          <div>
            <h3
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
              }}
            >
              {title}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.5',
              }}
            >
              {description}
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                background: difficultyColors[difficulty] + '20',
                color: difficultyColors[difficulty],
                fontWeight: '600',
              }}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.25rem',
              marginBottom: '1rem',
            }}
          >
            {tags.map((tag, index) => (
              <span
                key={index}
                style={{
                  fontSize: '0.625rem',
                  padding: '0.125rem 0.375rem',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  borderRadius: '4px',
                  fontWeight: '500',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Demo Controls */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
          }}
        >
          <button
            onClick={handleRunDemo}
            disabled={isRunning}
            style={{
              background: isRunning
                ? 'var(--text-secondary)'
                : 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
            }}
          >
            {isRunning ? (
              <>
                <span style={{ animation: 'spin 1s linear infinite' }}>⚡</span>
                Running...
              </>
            ) : (
              <>▶️ Run Demo</>
            )}
          </button>

          <button
            onClick={() => setShowCode(!showCode)}
            style={{
              background: 'transparent',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s ease',
            }}
          >
            {showCode ? '👁️ Hide Code' : '💻 Show Code'}
          </button>

          <button
            onClick={resetDemo}
            style={{
              background: 'transparent',
              color: 'var(--error-color)',
              border: '1px solid var(--error-color)',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s ease',
            }}
          >
            🔄 Reset
          </button>

          {executionTime > 0 && (
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                marginLeft: 'auto',
              }}
            >
              ⏱️ {executionTime.toFixed(2)}ms
            </span>
          )}
        </div>
      </div>

      {/* Code Editor */}
      {showCode && (
        <div
          style={{
            background: '#1e293b',
            padding: '1rem',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <textarea
            value={code}
            onChange={e => handleCodeChange(e.target.value)}
            style={{
              width: '100%',
              minHeight: '200px',
              background: 'transparent',
              color: '#e2e8f0',
              border: 'none',
              outline: 'none',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              lineHeight: '1.5',
              resize: 'vertical',
            }}
            placeholder="Enter your code here..."
          />
        </div>
      )}

      {/* Demo Content */}
      <div
        style={{
          padding: '2rem',
          background: 'var(--bg-primary)',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {error ? (
          <div
            style={{
              color: 'var(--error-color)',
              textAlign: 'center',
              padding: '1rem',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
            <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
              Error
            </div>
            <div style={{ fontSize: '0.875rem' }}>{error}</div>
          </div>
        ) : (
          <div
            style={{
              width: '100%',
              opacity: isRunning ? 0.7 : 1,
              transition: 'opacity 0.3s ease',
            }}
          >
            {children}
          </div>
        )}
      </div>

      {/* Demo Footer */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          padding: '1rem',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          textAlign: 'center',
        }}
      >
        💡 Tip: Click "Run Demo" to see the code in action, or modify the code
        and run it again!
      </div>
    </div>
  );
};

export default InteractiveDemo;
