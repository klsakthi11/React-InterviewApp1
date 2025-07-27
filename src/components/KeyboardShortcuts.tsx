import { useEffect, useCallback, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  category: string;
}

interface KeyboardShortcutsProps {
  children: ReactNode;
}

const KeyboardShortcuts = ({ children }: KeyboardShortcutsProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Define navigation shortcuts
  const navigationShortcuts: Shortcut[] = [
    {
      key: 'g h',
      description: 'Go to Home (Component Lifecycle)',
      action: () => navigate('/component-lifecycle'),
      category: 'Navigation',
    },
    {
      key: 'g s',
      description: 'Go to State Management',
      action: () => navigate('/state-management'),
      category: 'Navigation',
    },
    {
      key: 'g k',
      description: 'Go to React Hooks',
      action: () => navigate('/hooks'),
      category: 'Navigation',
    },
    {
      key: 'g e',
      description: 'Go to Event Handling',
      action: () => navigate('/event-handling'),
      category: 'Navigation',
    },
    {
      key: 'g f',
      description: 'Go to Forms & Validation',
      action: () => navigate('/forms'),
      category: 'Navigation',
    },
    {
      key: 'g c',
      description: 'Go to Context API',
      action: () => navigate('/context-api'),
      category: 'Navigation',
    },
    {
      key: 'g u',
      description: 'Go to Custom Hooks',
      action: () => navigate('/custom-hooks'),
      category: 'Navigation',
    },
    {
      key: 'g r',
      description: 'Go to Refs & DOM',
      action: () => navigate('/refs-dom'),
      category: 'Navigation',
    },
    {
      key: 'g b',
      description: 'Go to Error Boundaries',
      action: () => navigate('/error-boundaries'),
      category: 'Navigation',
    },
    {
      key: 'g m',
      description: 'Go to React.memo',
      action: () => navigate('/react-memo'),
      category: 'Navigation',
    },
    {
      key: 'g p',
      description: 'Go to Performance',
      action: () => navigate('/performance'),
      category: 'Navigation',
    },
    {
      key: 'g o',
      description: 'Go to HOC',
      action: () => navigate('/hoc'),
      category: 'Navigation',
    },
    {
      key: 'g l',
      description: 'Go to Render Props',
      action: () => navigate('/render-props'),
      category: 'Navigation',
    },
    {
      key: 'g a',
      description: 'Go to Advanced Patterns',
      action: () => navigate('/advanced-patterns'),
      category: 'Navigation',
    },
  ];

  // Define utility shortcuts
  const utilityShortcuts: Shortcut[] = [
    {
      key: '?',
      description: 'Show/Hide Keyboard Shortcuts',
      action: () => {
        const event = new CustomEvent('toggle-shortcuts');
        window.dispatchEvent(event);
      },
      category: 'Utility',
    },
    {
      key: 's',
      description: 'Focus Search Bar',
      action: () => {
        const searchInput = document.querySelector(
          'input[placeholder*="Search"]'
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      },
      category: 'Utility',
    },
    {
      key: 't',
      description: 'Toggle Theme',
      action: () => {
        const themeToggle = document.querySelector(
          '[title*="theme"]'
        ) as HTMLButtonElement;
        if (themeToggle) {
          themeToggle.click();
        }
      },
      category: 'Utility',
    },
    {
      key: 'm',
      description: 'Toggle Mobile Menu',
      action: () => {
        const mobileToggle = document.querySelector(
          '.mobile-nav-toggle'
        ) as HTMLButtonElement;
        if (mobileToggle) {
          mobileToggle.click();
        }
      },
      category: 'Utility',
    },
    {
      key: 'Escape',
      description: 'Close Modals/Dropdowns',
      action: () => {
        // Close any open dropdowns or modals
        const event = new CustomEvent('escape-pressed');
        window.dispatchEvent(event);
      },
      category: 'Utility',
    },
  ];

  const allShortcuts = [...navigationShortcuts, ...utilityShortcuts];

  // Track pressed keys
  const pressedKeys = new Set<string>();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore if typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      pressedKeys.add(key);

      // Check for multi-key shortcuts
      const pressedKeysArray = Array.from(pressedKeys).sort();
      const pressedKeysString = pressedKeysArray.join(' ');

      // Find matching shortcut
      const shortcut = allShortcuts.find(s => {
        const shortcutKeys = s.key.toLowerCase().split(' ');
        return shortcutKeys.every(k => pressedKeysArray.includes(k));
      });

      if (shortcut) {
        event.preventDefault();
        shortcut.action();

        // Show visual feedback
        showShortcutFeedback(shortcut);
      }
    },
    [allShortcuts]
  );

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    pressedKeys.delete(key);
  }, []);

  const showShortcutFeedback = (shortcut: Shortcut) => {
    // Create a temporary visual feedback element
    const feedback = document.createElement('div');
    feedback.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      font-size: 0.875rem;
      z-index: 10000;
      animation: fadeIn 0.2s ease-out;
    `;
    feedback.textContent = `${shortcut.key.toUpperCase()} - ${shortcut.description}`;

    document.body.appendChild(feedback);

    setTimeout(() => {
      feedback.remove();
    }, 1500);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return <>{children}</>;
};

// Keyboard Shortcuts Help Modal
export const KeyboardShortcutsHelp = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsVisible(prev => !prev);
    window.addEventListener('toggle-shortcuts', handleToggle);

    return () => {
      window.removeEventListener('toggle-shortcuts', handleToggle);
    };
  }, []);

  if (!isVisible) return null;

  const shortcuts = [
    {
      category: 'Navigation',
      shortcuts: [
        { key: 'g h', description: 'Go to Home (Component Lifecycle)' },
        { key: 'g s', description: 'Go to State Management' },
        { key: 'g k', description: 'Go to React Hooks' },
        { key: 'g e', description: 'Go to Event Handling' },
        { key: 'g f', description: 'Go to Forms & Validation' },
        { key: 'g c', description: 'Go to Context API' },
        { key: 'g u', description: 'Go to Custom Hooks' },
        { key: 'g r', description: 'Go to Refs & DOM' },
        { key: 'g b', description: 'Go to Error Boundaries' },
        { key: 'g m', description: 'Go to React.memo' },
        { key: 'g p', description: 'Go to Performance' },
        { key: 'g o', description: 'Go to HOC' },
        { key: 'g l', description: 'Go to Render Props' },
        { key: 'g a', description: 'Go to Advanced Patterns' },
      ],
    },
    {
      category: 'Utility',
      shortcuts: [
        { key: '?', description: 'Show/Hide Keyboard Shortcuts' },
        { key: 's', description: 'Focus Search Bar' },
        { key: 't', description: 'Toggle Theme' },
        { key: 'm', description: 'Toggle Mobile Menu' },
        { key: 'Escape', description: 'Close Modals/Dropdowns' },
      ],
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '1rem',
      }}
      onClick={() => setIsVisible(false)}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
            }}
          >
            ⌨️ Keyboard Shortcuts
          </h2>
          <button
            onClick={() => setIsVisible(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
          >
            ✕
          </button>
        </div>

        {shortcuts.map(category => (
          <div key={category.category} style={{ marginBottom: '2rem' }}>
            <h3
              style={{
                margin: '0 0 1rem 0',
                fontSize: '1.125rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                borderBottom: '2px solid var(--border-color)',
                paddingBottom: '0.5rem',
              }}
            >
              {category.category}
            </h3>
            <div
              style={{
                display: 'grid',
                gap: '0.75rem',
              }}
            >
              {category.shortcuts.map(shortcut => (
                <div
                  key={shortcut.key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: '6px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {shortcut.description}
                  </span>
                  <kbd
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      color: 'var(--text-primary)',
                      fontWeight: '600',
                    }}
                  >
                    {shortcut.key.toUpperCase()}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div
          style={{
            background: 'var(--bg-secondary)',
            padding: '1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            textAlign: 'center',
          }}
        >
          💡 Tip: Press{' '}
          <kbd
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              padding: '0.125rem 0.25rem',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
            }}
          >
            ?
          </kbd>{' '}
          anytime to show this help
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
