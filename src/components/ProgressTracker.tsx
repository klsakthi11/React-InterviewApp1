import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ProgressData {
  completedSections: string[];
  timeSpent: Record<string, number>;
  lastVisited: string;
  totalTimeSpent: number;
  startedAt: string;
}

const ProgressTracker = () => {
  const [progress, setProgress] = useState<ProgressData>({
    completedSections: [],
    timeSpent: {},
    lastVisited: '',
    totalTimeSpent: 0,
    startedAt: new Date().toISOString(),
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSectionStart, setCurrentSectionStart] = useState<number>(
    Date.now()
  );
  const location = useLocation();

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('react-interview-progress');
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('react-interview-progress', JSON.stringify(progress));
  }, [progress]);

  // Track time spent on current section
  useEffect(() => {
    const currentPath = location.pathname;
    setCurrentSectionStart(Date.now());

    // Update last visited
    setProgress(prev => ({
      ...prev,
      lastVisited: currentPath,
    }));

    // Cleanup function to save time spent when leaving section
    return () => {
      const timeSpent = Date.now() - currentSectionStart;
      const sectionName = getSectionName(currentPath);

      setProgress(prev => ({
        ...prev,
        timeSpent: {
          ...prev.timeSpent,
          [sectionName]: (prev.timeSpent[sectionName] || 0) + timeSpent,
        },
        totalTimeSpent: prev.totalTimeSpent + timeSpent,
      }));
    };
  }, [location.pathname]);

  const getSectionName = (path: string): string => {
    const sectionMap: Record<string, string> = {
      '/': 'Component Lifecycle',
      '/component-lifecycle': 'Component Lifecycle',
      '/state-management': 'State Management',
      '/hooks': 'React Hooks',
      '/event-handling': 'Event Handling',
      '/forms': 'Forms & Validation',
      '/context-api': 'Context API',
      '/custom-hooks': 'Custom Hooks',
      '/refs-dom': 'Refs & DOM',
      '/error-boundaries': 'Error Boundaries',
      '/react-memo': 'React.memo & Optimization',
      '/performance': 'Performance Optimization',
      '/hoc': 'Higher-Order Components',
      '/render-props': 'Render Props',
      '/advanced-patterns': 'Advanced Patterns',
    };
    return sectionMap[path] || 'Unknown Section';
  };

  const markSectionComplete = (sectionName: string) => {
    if (!progress.completedSections.includes(sectionName)) {
      setProgress(prev => ({
        ...prev,
        completedSections: [...prev.completedSections, sectionName],
      }));
    }
  };

  const resetProgress = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all progress? This cannot be undone.'
      )
    ) {
      const newProgress: ProgressData = {
        completedSections: [],
        timeSpent: {},
        lastVisited: '',
        totalTimeSpent: 0,
        startedAt: new Date().toISOString(),
      };
      setProgress(newProgress);
      localStorage.removeItem('react-interview-progress');
    }
  };

  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getProgressPercentage = (): number => {
    const totalSections = 14; // Total number of sections
    return Math.round(
      (progress.completedSections.length / totalSections) * 100
    );
  };

  const getCurrentSection = (): string => {
    return getSectionName(location.pathname);
  };

  const isCurrentSectionComplete = (): boolean => {
    return progress.completedSections.includes(getCurrentSection());
  };

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '1rem',
        border: '1px solid var(--border-color)',
      }}
    >
      {/* Progress Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
          }}
        >
          📊 Progress Tracker
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            color: 'var(--text-secondary)',
          }}
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
            }}
          >
            {progress.completedSections.length} of 14 sections completed
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'var(--primary-color)',
            }}
          >
            {getProgressPercentage()}%
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            background: 'var(--bg-secondary)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${getProgressPercentage()}%`,
              height: '100%',
              background:
                'linear-gradient(90deg, var(--primary-color), var(--secondary-color))',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Current Section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
          }}
        >
          Current: {getCurrentSection()}
        </span>
        {isCurrentSectionComplete() ? (
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--success-color)',
              fontWeight: '600',
            }}
          >
            ✅ Complete
          </span>
        ) : (
          <button
            onClick={() => markSectionComplete(getCurrentSection())}
            style={{
              background: 'var(--success-color)',
              color: 'white',
              border: 'none',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.625rem',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Mark Complete
          </button>
        )}
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '0.75rem',
          }}
        >
          {/* Total Time */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
              }}
            >
              Total Time Spent:
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
              }}
            >
              {formatTime(progress.totalTimeSpent)}
            </span>
          </div>

          {/* Started Date */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.75rem',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
              }}
            >
              Started:
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-primary)',
              }}
            >
              {new Date(progress.startedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Completed Sections */}
          {progress.completedSections.length > 0 && (
            <div style={{ marginBottom: '0.75rem' }}>
              <h4
                style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                }}
              >
                Completed Sections:
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.25rem',
                }}
              >
                {progress.completedSections.map((section, index) => (
                  <span
                    key={index}
                    style={{
                      fontSize: '0.625rem',
                      padding: '0.125rem 0.375rem',
                      background: 'var(--success-color)',
                      color: 'white',
                      borderRadius: '4px',
                      fontWeight: '600',
                    }}
                  >
                    {section}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reset Button */}
          <button
            onClick={resetProgress}
            style={{
              background: 'var(--error-color)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              cursor: 'pointer',
              fontWeight: '600',
              width: '100%',
            }}
          >
            Reset Progress
          </button>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
