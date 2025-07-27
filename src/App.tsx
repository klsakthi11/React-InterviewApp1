import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import { GlobalErrorBoundary } from './components/ErrorBoundary';
import SearchBar from './components/SearchBar';
import ProgressTracker from './components/ProgressTracker';
import { ThemeProvider, ThemeToggle } from './components/ThemeProvider';
import { NotificationProvider } from './components/NotificationSystem';
import KeyboardShortcuts, {
  KeyboardShortcutsHelp,
} from './components/KeyboardShortcuts';

// Import components
import ComponentLifecycle from './components/ComponentLifecycle';
import StateManagement from './components/StateManagement';
import Hooks from './components/Hooks';
import PerformanceOptimization from './components/PerformanceOptimization';
import EventHandling from './components/EventHandling';
import Forms from './components/Forms';
import ContextAPI from './components/ContextAPI';
import ErrorBoundaries from './components/ErrorBoundaries';
import CustomHooks from './components/CustomHooks';
import RefsAndDOM from './components/RefsAndDOM';
import HigherOrderComponents from './components/HigherOrderComponents';
import RenderProps from './components/RenderProps';
import ReactMemo from './components/ReactMemo';
import AdvancedPatterns from './components/AdvancedPatterns';

// Navigation component
const Sidebar = () => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Check if we're on the root path and highlight the first item
  const isActive = (path: string) => {
    if (path === '/component-lifecycle' && location.pathname === '/') {
      return true;
    }
    return location.pathname === path;
  };

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const navItems = [
    {
      path: '/component-lifecycle',
      label: '🔄 Component Lifecycle',
      component: ComponentLifecycle,
    },
    {
      path: '/state-management',
      label: '📊 State Management',
      component: StateManagement,
    },
    { path: '/hooks', label: '🎣 React Hooks', component: Hooks },
    {
      path: '/event-handling',
      label: '🖱️ Event Handling',
      component: EventHandling,
    },
    {
      path: '/forms',
      label: '📝 Forms & Validation',
      component: Forms,
    },
    {
      path: '/context-api',
      label: '🌐 Context API',
      component: ContextAPI,
    },
    {
      path: '/custom-hooks',
      label: '🔧 Custom Hooks',
      component: CustomHooks,
    },
    {
      path: '/refs-dom',
      label: '🎯 Refs & DOM',
      component: RefsAndDOM,
    },
    {
      path: '/error-boundaries',
      label: '🛡️ Error Boundaries',
      component: ErrorBoundaries,
    },
    {
      path: '/react-memo',
      label: '🧠 React.memo & Optimization',
      component: ReactMemo,
    },
    {
      path: '/performance',
      label: '⚡ Performance Optimization',
      component: PerformanceOptimization,
    },
    {
      path: '/hoc',
      label: '🏗️ Higher-Order Components',
      component: HigherOrderComponents,
    },
    {
      path: '/render-props',
      label: '🎨 Render Props',
      component: RenderProps,
    },
    {
      path: '/advanced-patterns',
      label: '🚀 Advanced Patterns',
      component: AdvancedPatterns,
    },
  ];

  return (
    <>
      {/* Mobile Navigation Toggle */}
      <button
        className="mobile-nav-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle navigation menu"
      >
        {isMobileOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
          }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div
        className={`sidebar ${isMobileOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          width: '280px',
          background: 'white',
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
          padding: '2rem 1rem',
          zIndex: 999,
          overflowY: 'auto',
        }}
      >
        <div
          className="logo"
          style={{ marginBottom: '2rem', textAlign: 'center' }}
        >
          <h2
            className="text-gradient"
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
            }}
          >
            Interview App
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            React Practice
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '1rem' }}>
          <SearchBar />
        </div>

        {/* Progress Tracker */}
        <div style={{ marginBottom: '2rem' }}>
          <ProgressTracker />
        </div>

        <nav className="sidebar-nav">
          {/* Beginner Level */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#10b981',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.75rem',
                paddingLeft: '0.5rem',
              }}
            >
              🟢 Beginner Level
            </h4>
            {navItems.slice(0, 5).map(item => (
              <Link
                key={item.path}
                to={item.path}
                className="nav-item"
                style={{
                  display: 'block',
                  padding: '0.75rem 1rem',
                  marginBottom: '0.5rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive(item.path) ? '#1e40af' : '#6b7280',
                  background: isActive(item.path)
                    ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
                    : 'transparent',
                  fontWeight: isActive(item.path) ? '700' : '500',
                  transition: 'all 0.3s ease',
                  border: isActive(item.path)
                    ? '2px solid #3b82f6'
                    : '1px solid transparent',
                  boxShadow: isActive(item.path)
                    ? '0 4px 12px rgba(59, 130, 246, 0.15)'
                    : 'none',
                  transform: isActive(item.path)
                    ? 'translateX(4px)'
                    : 'translateX(0)',
                  fontSize: '0.875rem',
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Intermediate Level */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#f59e0b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.75rem',
                paddingLeft: '0.5rem',
              }}
            >
              🟡 Intermediate Level
            </h4>
            {navItems.slice(5, 9).map(item => (
              <Link
                key={item.path}
                to={item.path}
                className="nav-item"
                style={{
                  display: 'block',
                  padding: '0.75rem 1rem',
                  marginBottom: '0.5rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive(item.path) ? '#1e40af' : '#6b7280',
                  background: isActive(item.path)
                    ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
                    : 'transparent',
                  fontWeight: isActive(item.path) ? '700' : '500',
                  transition: 'all 0.3s ease',
                  border: isActive(item.path)
                    ? '2px solid #3b82f6'
                    : '1px solid transparent',
                  boxShadow: isActive(item.path)
                    ? '0 4px 12px rgba(59, 130, 246, 0.15)'
                    : 'none',
                  transform: isActive(item.path)
                    ? 'translateX(4px)'
                    : 'translateX(0)',
                  fontSize: '0.875rem',
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Advanced Level */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#ef4444',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.75rem',
                paddingLeft: '0.5rem',
              }}
            >
              🔴 Advanced Level
            </h4>
            {navItems.slice(9, 12).map(item => (
              <Link
                key={item.path}
                to={item.path}
                className="nav-item"
                style={{
                  display: 'block',
                  padding: '0.75rem 1rem',
                  marginBottom: '0.5rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive(item.path) ? '#1e40af' : '#6b7280',
                  background: isActive(item.path)
                    ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
                    : 'transparent',
                  fontWeight: isActive(item.path) ? '700' : '500',
                  transition: 'all 0.3s ease',
                  border: isActive(item.path)
                    ? '2px solid #3b82f6'
                    : '1px solid transparent',
                  boxShadow: isActive(item.path)
                    ? '0 4px 12px rgba(59, 130, 246, 0.15)'
                    : 'none',
                  transform: isActive(item.path)
                    ? 'translateX(4px)'
                    : 'translateX(0)',
                  fontSize: '0.875rem',
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Expert Level */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#8b5cf6',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.75rem',
                paddingLeft: '0.5rem',
              }}
            >
              🟣 Expert Level
            </h4>
            {navItems.slice(12).map(item => (
              <Link
                key={item.path}
                to={item.path}
                className="nav-item"
                style={{
                  display: 'block',
                  padding: '0.75rem 1rem',
                  marginBottom: '0.5rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive(item.path) ? '#1e40af' : '#6b7280',
                  background: isActive(item.path)
                    ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
                    : 'transparent',
                  fontWeight: isActive(item.path) ? '700' : '500',
                  transition: 'all 0.3s ease',
                  border: isActive(item.path)
                    ? '2px solid #3b82f6'
                    : '1px solid transparent',
                  boxShadow: isActive(item.path)
                    ? '0 4px 12px rgba(59, 130, 246, 0.15)'
                    : 'none',
                  transform: isActive(item.path)
                    ? 'translateX(4px)'
                    : 'translateX(0)',
                  fontSize: '0.875rem',
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div
          style={{
            marginTop: 'auto',
            padding: '1rem',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <ThemeToggle />
            <span style={{ fontSize: '0.75rem' }}>Theme</span>
          </div>
          <p>React Interview Prep</p>
          <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>v1.0.0</p>
        </div>
      </div>
    </>
  );
};

// Main content wrapper
const MainContent = () => {
  return (
    <div
      className="main-content"
      style={{ marginLeft: '280px', minHeight: '100vh' }}
    >
      <Routes>
        <Route path="/" element={<ComponentLifecycle />} />
        <Route path="/component-lifecycle" element={<ComponentLifecycle />} />
        <Route path="/state-management" element={<StateManagement />} />
        <Route path="/hooks" element={<Hooks />} />
        <Route path="/performance" element={<PerformanceOptimization />} />
        <Route path="/event-handling" element={<EventHandling />} />
        <Route path="/forms" element={<Forms />} />
        <Route path="/context-api" element={<ContextAPI />} />
        <Route path="/error-boundaries" element={<ErrorBoundaries />} />
        <Route path="/custom-hooks" element={<CustomHooks />} />
        <Route path="/refs-dom" element={<RefsAndDOM />} />
        <Route path="/hoc" element={<HigherOrderComponents />} />
        <Route path="/render-props" element={<RenderProps />} />
        <Route path="/react-memo" element={<ReactMemo />} />
        <Route path="/advanced-patterns" element={<AdvancedPatterns />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <GlobalErrorBoundary>
          <Router>
            <KeyboardShortcuts>
              <div
                className="min-h-screen"
                style={{ background: 'var(--bg-secondary)' }}
              >
                <Sidebar />
                <MainContent />
                <KeyboardShortcutsHelp />
              </div>
            </KeyboardShortcuts>
          </Router>
        </GlobalErrorBoundary>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
