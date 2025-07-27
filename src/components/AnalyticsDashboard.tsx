import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface AnalyticsData {
  totalTimeSpent: number;
  sectionsCompleted: number;
  totalSections: number;
  averageTimePerSection: number;
  mostTimeSpentSection: string;
  lastStudySession: string;
  studyStreak: number;
  weeklyProgress: {
    date: string;
    timeSpent: number;
    sectionsCompleted: number;
  }[];
  sectionProgress: {
    name: string;
    timeSpent: number;
    completed: boolean;
    lastVisited: string;
  }[];
}

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalTimeSpent: 0,
    sectionsCompleted: 0,
    totalSections: 14,
    averageTimePerSection: 0,
    mostTimeSpentSection: '',
    lastStudySession: '',
    studyStreak: 0,
    weeklyProgress: [],
    sectionProgress: [],
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    loadAnalytics();
  }, [location.pathname]);

  const loadAnalytics = () => {
    const savedProgress = localStorage.getItem('react-interview-progress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        calculateAnalytics(progress);
      } catch (error) {
        console.error('Error loading analytics:', error);
      }
    }
  };

  const calculateAnalytics = (progress: any) => {
    const sectionNames = [
      'Component Lifecycle',
      'State Management',
      'React Hooks',
      'Event Handling',
      'Forms & Validation',
      'Context API',
      'Custom Hooks',
      'Refs & DOM',
      'Error Boundaries',
      'React.memo & Optimization',
      'Performance Optimization',
      'Higher-Order Components',
      'Render Props',
      'Advanced Patterns',
    ];

    const sectionProgress = sectionNames.map(name => ({
      name,
      timeSpent: progress.timeSpent?.[name] || 0,
      completed: progress.completedSections?.includes(name) || false,
      lastVisited: progress.lastVisited || '',
    }));

    const totalTimeSpent = progress.totalTimeSpent || 0;
    const sectionsCompleted = progress.completedSections?.length || 0;
    const averageTimePerSection =
      sectionsCompleted > 0 ? totalTimeSpent / sectionsCompleted : 0;

    // Find most time spent section
    const mostTimeSpentSection = sectionProgress.reduce((max, section) =>
      section.timeSpent > max.timeSpent ? section : max
    ).name;

    // Calculate study streak (simplified)
    const studyStreak = Math.floor(Math.random() * 7) + 1; // Mock data

    // Generate weekly progress (mock data)
    const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toISOString().split('T')[0],
        timeSpent: Math.floor(Math.random() * 120) + 10,
        sectionsCompleted: Math.floor(Math.random() * 3),
      };
    });

    setAnalytics({
      totalTimeSpent,
      sectionsCompleted,
      totalSections: 14,
      averageTimePerSection,
      mostTimeSpentSection,
      lastStudySession: progress.startedAt || new Date().toISOString(),
      studyStreak,
      weeklyProgress,
      sectionProgress,
    });
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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const getProgressPercentage = (): number => {
    return Math.round(
      (analytics.sectionsCompleted / analytics.totalSections) * 100
    );
  };

  const getWeeklyChartData = () => {
    return analytics.weeklyProgress.map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', {
        weekday: 'short',
      }),
      timeSpent: day.timeSpent,
      sectionsCompleted: day.sectionsCompleted,
    }));
  };

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1rem',
        border: '1px solid var(--border-color)',
      }}
    >
      {/* Dashboard Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: '1.125rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
          }}
        >
          📊 Learning Analytics
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

      {/* Key Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Progress */}
        <div
          style={{
            background:
              'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
            color: 'white',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
            }}
          >
            {getProgressPercentage()}%
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
            {analytics.sectionsCompleted} of {analytics.totalSections} completed
          </div>
        </div>

        {/* Total Time */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid var(--border-color)',
          }}
        >
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'var(--primary-color)',
              marginBottom: '0.5rem',
            }}
          >
            {formatTime(analytics.totalTimeSpent)}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Total Time Spent
          </div>
        </div>

        {/* Study Streak */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid var(--border-color)',
          }}
        >
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'var(--success-color)',
              marginBottom: '0.5rem',
            }}
          >
            🔥 {analytics.studyStreak}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Day Streak
          </div>
        </div>

        {/* Average Time */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid var(--border-color)',
          }}
        >
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'var(--warning-color)',
              marginBottom: '0.5rem',
            }}
          >
            {formatTime(analytics.averageTimePerSection)}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Avg. Time/Section
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
          }}
        >
          {/* Weekly Progress Chart */}
          <div style={{ marginBottom: '2rem' }}>
            <h4
              style={{
                margin: '0 0 1rem 0',
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
              }}
            >
              📈 Weekly Activity
            </h4>
            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                gap: '0.5rem',
                height: '120px',
                padding: '1rem 0',
              }}
            >
              {getWeeklyChartData().map((day, index) => (
                <div key={index} style={{ flex: 1, textAlign: 'center' }}>
                  <div
                    style={{
                      background: 'var(--primary-color)',
                      height: `${(day.timeSpent / 120) * 80}px`,
                      borderRadius: '4px 4px 0 0',
                      marginBottom: '0.5rem',
                      minHeight: '4px',
                    }}
                  />
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      fontWeight: '500',
                    }}
                  >
                    {day.date}
                  </div>
                  <div
                    style={{
                      fontSize: '0.625rem',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {day.timeSpent}m
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Progress */}
          <div style={{ marginBottom: '2rem' }}>
            <h4
              style={{
                margin: '0 0 1rem 0',
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
              }}
            >
              📚 Section Progress
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1rem',
              }}
            >
              {analytics.sectionProgress.map((section, index) => (
                <div
                  key={index}
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                  }}
                >
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
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {section.name}
                    </span>
                    {section.completed ? (
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
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        ⏳ In Progress
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Time: {formatTime(section.timeSpent)}
                  </div>
                  {section.lastVisited && (
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      Last visited: {formatDate(section.lastVisited)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div>
            <h4
              style={{
                margin: '0 0 1rem 0',
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
              }}
            >
              💡 Insights
            </h4>
            <div
              style={{
                background: 'var(--bg-secondary)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
              }}
            >
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '1.5rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6',
                }}
              >
                <li>
                  You've spent the most time on{' '}
                  <strong>{analytics.mostTimeSpentSection}</strong>
                </li>
                <li>
                  Your study streak is {analytics.studyStreak} days - keep it
                  up!
                </li>
                <li>
                  You're {getProgressPercentage()}% through the React interview
                  prep course
                </li>
                <li>
                  On average, you spend{' '}
                  {formatTime(analytics.averageTimePerSection)} per section
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
