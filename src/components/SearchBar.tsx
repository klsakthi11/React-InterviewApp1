import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  path: string;
  category: string;
  keywords: string[];
}

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Search data - all components and their content
  const searchData: SearchResult[] = [
    {
      id: 'component-lifecycle',
      title: 'Component Lifecycle',
      description: 'Learn about React component lifecycle phases and methods',
      path: '/component-lifecycle',
      category: 'Beginner',
      keywords: [
        'useEffect',
        'mounting',
        'unmounting',
        'lifecycle',
        'componentDidMount',
        'componentWillUnmount',
      ],
    },
    {
      id: 'state-management',
      title: 'State Management',
      description:
        'Understanding useState, useReducer, and state management patterns',
      path: '/state-management',
      category: 'Beginner',
      keywords: [
        'useState',
        'useReducer',
        'state',
        'immutable',
        'reducer',
        'actions',
      ],
    },
    {
      id: 'hooks',
      title: 'React Hooks',
      description: 'Comprehensive guide to all React hooks and their usage',
      path: '/hooks',
      category: 'Intermediate',
      keywords: [
        'useState',
        'useEffect',
        'useCallback',
        'useMemo',
        'useRef',
        'useContext',
        'custom hooks',
      ],
    },
    {
      id: 'event-handling',
      title: 'Event Handling',
      description: 'Handling user interactions and events in React',
      path: '/event-handling',
      category: 'Beginner',
      keywords: [
        'onClick',
        'onChange',
        'onSubmit',
        'events',
        'synthetic events',
        'event delegation',
      ],
    },
    {
      id: 'forms',
      title: 'Forms & Validation',
      description: 'Building forms with validation and user input handling',
      path: '/forms',
      category: 'Beginner',
      keywords: [
        'forms',
        'validation',
        'controlled components',
        'uncontrolled',
        'form handling',
      ],
    },
    {
      id: 'context-api',
      title: 'Context API',
      description: 'Sharing state across components using React Context',
      path: '/context-api',
      category: 'Intermediate',
      keywords: [
        'context',
        'useContext',
        'provider',
        'consumer',
        'global state',
      ],
    },
    {
      id: 'custom-hooks',
      title: 'Custom Hooks',
      description: 'Creating reusable custom hooks for shared logic',
      path: '/custom-hooks',
      category: 'Intermediate',
      keywords: [
        'custom hooks',
        'useCustom',
        'reusable logic',
        'hook composition',
      ],
    },
    {
      id: 'refs-dom',
      title: 'Refs & DOM',
      description: 'Direct DOM manipulation and refs in React',
      path: '/refs-dom',
      category: 'Intermediate',
      keywords: [
        'useRef',
        'forwardRef',
        'DOM',
        'imperative',
        'direct manipulation',
      ],
    },
    {
      id: 'error-boundaries',
      title: 'Error Boundaries',
      description: 'Catching and handling errors in React components',
      path: '/error-boundaries',
      category: 'Advanced',
      keywords: [
        'error boundaries',
        'componentDidCatch',
        'error handling',
        'fallback UI',
      ],
    },
    {
      id: 'react-memo',
      title: 'React.memo & Optimization',
      description:
        'Performance optimization with React.memo and other techniques',
      path: '/react-memo',
      category: 'Advanced',
      keywords: [
        'React.memo',
        'optimization',
        'performance',
        're-renders',
        'memoization',
      ],
    },
    {
      id: 'performance',
      title: 'Performance Optimization',
      description: 'Advanced performance optimization techniques',
      path: '/performance',
      category: 'Advanced',
      keywords: [
        'performance',
        'optimization',
        'lazy loading',
        'code splitting',
        'virtualization',
      ],
    },
    {
      id: 'hoc',
      title: 'Higher-Order Components',
      description: 'Creating and using Higher-Order Components',
      path: '/hoc',
      category: 'Expert',
      keywords: [
        'HOC',
        'higher-order components',
        'composition',
        'enhancement',
      ],
    },
    {
      id: 'render-props',
      title: 'Render Props',
      description: 'Sharing code between components using render props',
      path: '/render-props',
      category: 'Expert',
      keywords: [
        'render props',
        'children as function',
        'code sharing',
        'composition',
      ],
    },
    {
      id: 'advanced-patterns',
      title: 'Advanced Patterns',
      description: 'Advanced React patterns and techniques',
      path: '/advanced-patterns',
      category: 'Expert',
      keywords: [
        'patterns',
        'compound components',
        'portals',
        'fragments',
        'advanced',
      ],
    },
  ];

  // Search function
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = searchData.filter(
      item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
        item.category.toLowerCase().includes(query)
    );

    setResults(filtered);
  };

  // Handle search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            navigate(results[selectedIndex].path);
            setIsOpen(false);
            setQuery('');
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setQuery('');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, navigate]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
    setIsOpen(false);
    setQuery('');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Beginner':
        return '#10b981';
      case 'Intermediate':
        return '#f59e0b';
      case 'Advanced':
        return '#ef4444';
      case 'Expert':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  return (
    <div
      ref={searchRef}
      style={{ position: 'relative', width: '100%', maxWidth: '400px' }}
    >
      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Search components and concepts..."
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem 0.75rem 2.5rem',
            border: '2px solid var(--border-color)',
            borderRadius: '8px',
            fontSize: '0.875rem',
            background: 'white',
            outline: 'none',
            transition: 'all 0.2s ease',
          }}
        />
        <span
          style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-secondary)',
            fontSize: '1rem',
          }}
        >
          🔍
        </span>
      </div>

      {/* Search Results */}
      {isOpen && results.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 1000,
            marginTop: '0.5rem',
          }}
        >
          {results.map((result, index) => (
            <div
              key={result.id}
              onClick={() => handleResultClick(result)}
              style={{
                padding: '1rem',
                cursor: 'pointer',
                borderBottom: '1px solid var(--border-color)',
                background:
                  selectedIndex === index
                    ? 'var(--bg-secondary)'
                    : 'transparent',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.5rem',
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                  }}
                >
                  {result.title}
                </h4>
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    background: getCategoryColor(result.category) + '20',
                    color: getCategoryColor(result.category),
                    fontWeight: '600',
                  }}
                >
                  {result.category}
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.4',
                }}
              >
                {result.description}
              </p>
              <div
                style={{
                  marginTop: '0.5rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.25rem',
                }}
              >
                {result.keywords.slice(0, 3).map((keyword, keywordIndex) => (
                  <span
                    key={keywordIndex}
                    style={{
                      fontSize: '0.625rem',
                      padding: '0.125rem 0.375rem',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)',
                      borderRadius: '4px',
                    }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && query && results.length === 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '1rem',
            marginTop: '0.5rem',
            zIndex: 1000,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              textAlign: 'center',
            }}
          >
            No results found for "{query}"
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
