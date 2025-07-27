import { useState } from 'react';

interface DocumentationProps {
  title: string;
  children: React.ReactNode;
  sections?: {
    title: string;
    content: React.ReactNode;
    icon?: string;
  }[];
}

const Documentation = ({
  title,
  children,
  sections = [],
}: DocumentationProps) => {
  const [activeSection, setActiveSection] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        border: '1px solid var(--border-color)',
      }}
    >
      {/* Documentation Header */}
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
          📚 {title}
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

      {/* Main Content */}
      <div
        style={{
          opacity: isExpanded ? 1 : 0.7,
          transition: 'opacity 0.3s ease',
        }}
      >
        {children}
      </div>

      {/* Expandable Sections */}
      {isExpanded && sections.length > 0 && (
        <div
          style={{
            marginTop: '2rem',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
          }}
        >
          {/* Section Navigation */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => setActiveSection(index)}
                style={{
                  background:
                    activeSection === index
                      ? 'var(--primary-color)'
                      : 'transparent',
                  color:
                    activeSection === index ? 'white' : 'var(--text-secondary)',
                  border: `1px solid ${
                    activeSection === index
                      ? 'var(--primary-color)'
                      : 'var(--border-color)'
                  }`,
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: activeSection === index ? '600' : '500',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                {section.icon && <span>{section.icon}</span>}
                {section.title}
              </button>
            ))}
          </div>

          {/* Section Content */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              padding: '1.5rem',
              border: '1px solid var(--border-color)',
            }}
          >
            {sections[activeSection]?.content}
          </div>
        </div>
      )}
    </div>
  );
};

// Quick Start Guide Component
export const QuickStartGuide = () => {
  const sections = [
    {
      title: 'Getting Started',
      icon: '🚀',
      content: (
        <div>
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
            Welcome to React Interview Prep!
          </h4>
          <p
            style={{
              margin: '0 0 1rem 0',
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
            }}
          >
            This interactive learning platform is designed to help you master
            React concepts through hands-on examples and comprehensive
            explanations.
          </p>
          <div
            style={{
              background: 'var(--bg-primary)',
              padding: '1rem',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
            }}
          >
            <h5
              style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}
            >
              Quick Tips:
            </h5>
            <ul
              style={{
                margin: 0,
                paddingLeft: '1.5rem',
                color: 'var(--text-secondary)',
              }}
            >
              <li>Use the search bar to find specific concepts</li>
              <li>Track your progress with the progress tracker</li>
              <li>Try the interactive demos to see code in action</li>
              <li>Use keyboard shortcuts for faster navigation</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: 'Navigation',
      icon: '🧭',
      content: (
        <div>
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
            How to Navigate
          </h4>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: 'var(--bg-primary)',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🔍</span>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>
                  Search:
                </strong>
                <span
                  style={{
                    color: 'var(--text-secondary)',
                    marginLeft: '0.5rem',
                  }}
                >
                  Use the search bar to find specific concepts and components
                </span>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: 'var(--bg-primary)',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>⌨️</span>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>
                  Keyboard Shortcuts:
                </strong>
                <span
                  style={{
                    color: 'var(--text-secondary)',
                    marginLeft: '0.5rem',
                  }}
                >
                  Press{' '}
                  <kbd
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '3px',
                      padding: '0.125rem 0.25rem',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                    }}
                  >
                    ?
                  </kbd>{' '}
                  to see all available shortcuts
                </span>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: 'var(--bg-primary)',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>📊</span>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>
                  Progress Tracking:
                </strong>
                <span
                  style={{
                    color: 'var(--text-secondary)',
                    marginLeft: '0.5rem',
                  }}
                >
                  Monitor your learning progress and time spent on each section
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Learning Path',
      icon: '🛤️',
      content: (
        <div>
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
            Recommended Learning Path
          </h4>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {[
              {
                level: '🟢 Beginner',
                topics: [
                  'Component Lifecycle',
                  'State Management',
                  'Event Handling',
                  'Forms & Validation',
                ],
              },
              {
                level: '🟡 Intermediate',
                topics: [
                  'React Hooks',
                  'Context API',
                  'Custom Hooks',
                  'Refs & DOM',
                ],
              },
              {
                level: '🔴 Advanced',
                topics: [
                  'Error Boundaries',
                  'React.memo',
                  'Performance Optimization',
                ],
              },
              {
                level: '🟣 Expert',
                topics: [
                  'Higher-Order Components',
                  'Render Props',
                  'Advanced Patterns',
                ],
              },
            ].map((stage, index) => (
              <div
                key={index}
                style={{
                  padding: '1rem',
                  background: 'var(--bg-primary)',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                }}
              >
                <h5
                  style={{
                    margin: '0 0 0.5rem 0',
                    color: 'var(--text-primary)',
                  }}
                >
                  {stage.level}
                </h5>
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                  }}
                >
                  {stage.topics.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Features',
      icon: '✨',
      content: (
        <div>
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
            Platform Features
          </h4>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              {
                icon: '🎯',
                title: 'Interactive Demos',
                desc: 'Live code examples with real-time execution',
              },
              {
                icon: '📝',
                title: 'Comprehensive Documentation',
                desc: 'Detailed explanations and best practices',
              },
              {
                icon: '🎨',
                title: 'Multiple Themes',
                desc: 'Light, dark, and high-contrast themes',
              },
              {
                icon: '📱',
                title: 'Mobile Responsive',
                desc: 'Optimized for all device sizes',
              },
              {
                icon: '🔔',
                title: 'Smart Notifications',
                desc: 'Contextual feedback and alerts',
              },
              {
                icon: '📊',
                title: 'Progress Analytics',
                desc: 'Track your learning journey',
              },
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'var(--bg-primary)',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{feature.icon}</span>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>
                    {feature.title}
                  </strong>
                  <div
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {feature.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <Documentation title="Quick Start Guide" sections={sections}>
      <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
        Welcome to your React interview preparation journey! This platform
        provides comprehensive learning materials, interactive examples, and
        progress tracking to help you master React concepts.
      </p>
    </Documentation>
  );
};

// FAQ Component
export const FAQ = () => {
  const faqs = [
    {
      question: 'How do I track my progress?',
      answer:
        'Use the Progress Tracker in the sidebar to mark sections as complete and view your learning statistics.',
    },
    {
      question: 'Can I use keyboard shortcuts?',
      answer:
        'Yes! Press "?" to see all available keyboard shortcuts for quick navigation.',
    },
    {
      question: 'How do I search for specific concepts?',
      answer:
        'Use the search bar in the sidebar to find components, concepts, and keywords across all sections.',
    },
    {
      question: 'Are the examples interactive?',
      answer:
        'Yes! Most sections include live demos where you can modify code and see the results in real-time.',
    },
    {
      question: 'How do I change themes?',
      answer:
        'Click the theme toggle button in the sidebar footer to switch between light, dark, and high-contrast themes.',
    },
    {
      question: 'Is this mobile-friendly?',
      answer:
        'Absolutely! The platform is fully responsive and optimized for mobile devices with touch-friendly controls.',
    },
  ];

  return (
    <Documentation title="Frequently Asked Questions">
      <div style={{ display: 'grid', gap: '1rem' }}>
        {faqs.map((faq, index) => (
          <details
            key={index}
            style={{
              background: 'var(--bg-secondary)',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
            }}
          >
            <summary
              style={{
                padding: '1rem',
                cursor: 'pointer',
                fontWeight: '600',
                color: 'var(--text-primary)',
                background: 'var(--bg-primary)',
              }}
            >
              {faq.question}
            </summary>
            <div
              style={{
                padding: '1rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
              }}
            >
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </Documentation>
  );
};

export default Documentation;
