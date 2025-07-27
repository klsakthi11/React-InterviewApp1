import { useState, useCallback, useMemo, memo, useEffect } from 'react';
import ResizableCodePanel from './ResizableCodePanel';

// Memoized Components
interface ExpensiveComponentProps {
  value: number;
  onUpdate: (value: number) => void;
}

const ExpensiveComponent = memo<ExpensiveComponentProps>(
  ({ value, onUpdate }) => {
    // Simulate expensive computation
    const expensiveValue = useMemo(() => {
      console.log('ExpensiveComponent: Computing expensive value');
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
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          marginBottom: '1rem',
        }}
      >
        <h3>Expensive Component</h3>
        <p>Value: {value}</p>
        <p>Expensive computation: {expensiveValue.toFixed(2)}</p>
        <button
          onClick={() => onUpdate(value + 1)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Update Value
        </button>
      </div>
    );
  }
);

// Custom comparison function for memo
interface UserProps {
  user: {
    id: number;
    name: string;
    email: string;
  };
  onSelect: (id: number) => void;
}

const UserItem = memo<UserProps>(
  ({ user, onSelect }) => {
    console.log(`UserItem ${user.id} rendered`);

    return (
      <div
        onClick={() => onSelect(user.id)}
        style={{
          padding: '0.75rem',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          marginBottom: '0.5rem',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <h4 style={{ margin: '0 0 0.25rem 0' }}>{user.name}</h4>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
          {user.email}
        </p>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison: only re-render if id or name changes
    return (
      prevProps.user.id === nextProps.user.id &&
      prevProps.user.name === nextProps.user.name
    );
  }
);

// Todo List with memoized items
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem = memo<TodoItemProps>(({ todo, onToggle, onDelete }) => {
  console.log(`TodoItem ${todo.id} rendered`);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        marginBottom: '0.5rem',
        backgroundColor: todo.completed ? '#f0fdf4' : 'white',
      }}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        style={{ marginRight: '0.75rem' }}
      />
      <span
        style={{
          flex: 1,
          textDecoration: todo.completed ? 'line-through' : 'none',
          color: todo.completed ? '#6b7280' : '#1f2937',
        }}
      >
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        style={{
          padding: '0.25rem 0.5rem',
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.875rem',
        }}
      >
        Delete
      </button>
    </div>
  );
});

// Performance monitoring component
const PerformanceMonitor = () => {
  const [renderCount, setRenderCount] = useState(0);
  const [lastRenderTime, setLastRenderTime] = useState(Date.now());

  // Update render count only when component mounts
  useEffect(() => {
    setRenderCount(prev => prev + 1);
    setLastRenderTime(Date.now());
  }, []); // Empty dependency array - only run once

  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: '#fef3c7',
        border: '1px solid #f59e0b',
        borderRadius: '8px',
        marginBottom: '1rem',
      }}
    >
      <h4 style={{ margin: '0 0 0.5rem 0', color: '#92400e' }}>
        Performance Monitor
      </h4>
      <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>
        Render count: {renderCount}
      </p>
      <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>
        Last render: {new Date(lastRenderTime).toLocaleTimeString()}
      </p>
      <p
        style={{ margin: '0.25rem 0', fontSize: '0.875rem', color: '#92400e' }}
      >
        Note: This is a static monitor for demonstration purposes
      </p>
    </div>
  );
};

const ReactMemo = () => {
  const [count, setCount] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Learn React.memo', completed: false },
    { id: 2, text: 'Practice optimization', completed: false },
    { id: 3, text: 'Build performance app', completed: false },
  ]);
  const [newTodo, setNewTodo] = useState('');

  // Memoized callback functions
  const handleUpdateValue = useCallback((value: number) => {
    setCount(value);
  }, []);

  const handleUserSelect = useCallback((id: number) => {
    setSelectedUserId(id);
  }, []);

  const handleTodoToggle = useCallback((id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const handleTodoDelete = useCallback((id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  // Memoized data
  const users = useMemo(
    () => [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
    ],
    []
  );

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos(prev => [
        ...prev,
        {
          id: Date.now(),
          text: newTodo.trim(),
          completed: false,
        },
      ]);
      setNewTodo('');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left side - Content */}
      <div style={{ flex: 1, padding: '2rem' }}>
        <h1 className="heading-primary">React.memo & Optimization</h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
          }}
        >
          Learn how to optimize React components using React.memo, useMemo, and
          useCallback.
        </p>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">What is React.memo?</h2>
          <p style={{ marginBottom: '1rem' }}>
            React.memo is a higher-order component that memoizes your component,
            preventing unnecessary re-renders when props haven't changed.
          </p>
          <ul style={{ listStyle: 'disc', paddingLeft: '2rem' }}>
            <li>Prevents unnecessary re-renders</li>
            <li>Shallow comparison of props by default</li>
            <li>Custom comparison function support</li>
            <li>Works with useCallback and useMemo</li>
            <li>Performance optimization technique</li>
          </ul>
        </div>

        <PerformanceMonitor />

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">
            Expensive Component with React.memo
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            This component is memoized and only re-renders when its props
            change. Check the console to see when expensive computations run.
          </p>
          <ExpensiveComponent value={count} onUpdate={handleUpdateValue} />
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Try clicking the button above and notice that the expensive
            computation only runs when the value changes.
          </p>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">
            User List with Custom Comparison
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            These user items are memoized with a custom comparison function that
            only checks id and name.
          </p>
          <div style={{ marginBottom: '1rem' }}>
            <p>Selected user: {selectedUserId || 'None'}</p>
          </div>
          {users.map(user => (
            <UserItem key={user.id} user={user} onSelect={handleUserSelect} />
          ))}
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Check the console to see which UserItem components re-render when
            you click them.
          </p>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">Todo List with Memoized Items</h2>
          <p style={{ marginBottom: '1rem' }}>
            Each todo item is memoized and only re-renders when its specific
            props change.
          </p>
          <div style={{ marginBottom: '1rem' }}>
            <div
              style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}
            >
              <input
                type="text"
                value={newTodo}
                onChange={e => setNewTodo(e.target.value)}
                placeholder="Add new todo"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                }}
                onKeyPress={e => e.key === 'Enter' && addTodo()}
              />
              <button
                onClick={addTodo}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Add
              </button>
            </div>
            <p>
              Completed: {completedTodos} / {todos.length}
            </p>
          </div>
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleTodoToggle}
              onDelete={handleTodoDelete}
            />
          ))}
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Check the console to see which TodoItem components re-render when
            you interact with them.
          </p>
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
                    <strong>What is React.memo?</strong> - Higher-order
                    component that memoizes components to prevent unnecessary
                    re-renders
                  </li>
                  <li>
                    <strong>When should you use React.memo?</strong> - When
                    components re-render frequently with the same props
                  </li>
                  <li>
                    <strong>
                      What's the difference between React.memo and useMemo?
                    </strong>{' '}
                    - React.memo for components, useMemo for values
                  </li>
                  <li>
                    <strong>How does React.memo work?</strong> - Shallow
                    comparison of props, skips re-render if props haven't
                    changed
                  </li>
                  <li>
                    <strong>When should you NOT use React.memo?</strong> - When
                    props change frequently or component is simple
                  </li>
                  <li>
                    <strong>
                      How to use custom comparison with React.memo?
                    </strong>{' '}
                    - Pass comparison function as second argument
                  </li>
                  <li>
                    <strong>What's the relationship with useCallback?</strong> -
                    useCallback prevents function recreation, React.memo
                    prevents re-renders
                  </li>
                  <li>
                    <strong>
                      How to measure React.memo performance impact?
                    </strong>{' '}
                    - Use React DevTools Profiler or performance monitoring
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
                    <strong>Shallow comparison by default</strong> - Only
                    compares primitive values and object references
                  </li>
                  <li>
                    <strong>Custom comparison functions</strong> - Can override
                    default comparison logic
                  </li>
                  <li>
                    <strong>Works with useCallback</strong> - Prevents function
                    recreation that would cause re-renders
                  </li>
                  <li>
                    <strong>Performance overhead</strong> - Memoization itself
                    has a cost, don't overuse
                  </li>
                  <li>
                    <strong>Not always beneficial</strong> - Simple components
                    might be slower with memoization
                  </li>
                  <li>
                    <strong>Debugging considerations</strong> - Can make
                    debugging more complex
                  </li>
                  <li>
                    <strong>Memory usage</strong> - Stores previous props in
                    memory
                  </li>
                  <li>
                    <strong>React DevTools support</strong> - Can see memoized
                    components in profiler
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
                    <strong>Deep comparison strategies</strong> - Custom
                    comparison for nested objects
                  </li>
                  <li>
                    <strong>React.memo with TypeScript</strong> - Proper typing
                    for memoized components
                  </li>
                  <li>
                    <strong>Performance profiling</strong> - Measuring
                    memoization effectiveness
                  </li>
                  <li>
                    <strong>Memoization patterns</strong> - Common use cases and
                    implementations
                  </li>
                  <li>
                    <strong>React.memo vs PureComponent</strong> - Differences
                    and when to use each
                  </li>
                  <li>
                    <strong>Concurrent features</strong> - How memoization works
                    with React 18+
                  </li>
                  <li>
                    <strong>Server-side rendering</strong> - Memoization
                    considerations for SSR
                  </li>
                  <li>
                    <strong>Testing memoized components</strong> - Unit testing
                    strategies
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
                    <strong>Over-memoization</strong> - Memoizing everything
                    without measuring impact
                  </li>
                  <li>
                    <strong>Ignoring useCallback</strong> - Functions recreated
                    on every render
                  </li>
                  <li>
                    <strong>Complex comparison functions</strong> - Expensive
                    comparison logic
                  </li>
                  <li>
                    <strong>Not considering children</strong> - Children can
                    still cause re-renders
                  </li>
                  <li>
                    <strong>Missing dependencies</strong> - Incorrect dependency
                    arrays in hooks
                  </li>
                  <li>
                    <strong>Premature optimization</strong> - Optimizing before
                    identifying bottlenecks
                  </li>
                  <li>
                    <strong>Forgetting to measure</strong> - Not profiling
                    before and after optimization
                  </li>
                  <li>
                    <strong>Inconsistent memoization</strong> - Memoizing some
                    components but not others
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
                    <strong>React DevTools Profiler</strong> - Built-in
                    performance profiling
                  </li>
                  <li>
                    <strong>why-did-you-render</strong> - Library to detect
                    unnecessary re-renders
                  </li>
                  <li>
                    <strong>React Window</strong> - Virtualization for large
                    lists
                  </li>
                  <li>
                    <strong>React Virtualized</strong> - Efficient rendering of
                    large datasets
                  </li>
                  <li>
                    <strong>Lodash memoize</strong> - Utility for memoizing
                    functions
                  </li>
                  <li>
                    <strong>Reselect</strong> - Memoized selectors for Redux
                  </li>
                  <li>
                    <strong>React Query</strong> - Caching and memoization for
                    data fetching
                  </li>
                  <li>
                    <strong>Custom performance hooks</strong> - Building your
                    own optimization tools
                  </li>
                </ul>
              </div>
            </div>

            {/* Optimization Patterns */}
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
                🎨 Optimization Patterns
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
                    components into smaller ones
                  </li>
                  <li>
                    <strong>Props optimization</strong> - Minimizing prop
                    changes
                  </li>
                  <li>
                    <strong>State lifting</strong> - Moving state to appropriate
                    levels
                  </li>
                  <li>
                    <strong>Callback optimization</strong> - Using useCallback
                    for event handlers
                  </li>
                  <li>
                    <strong>Value memoization</strong> - Using useMemo for
                    expensive calculations
                  </li>
                  <li>
                    <strong>List optimization</strong> - Using keys and
                    virtualization
                  </li>
                  <li>
                    <strong>Context optimization</strong> - Splitting contexts
                    to prevent re-renders
                  </li>
                  <li>
                    <strong>Bundle optimization</strong> - Code splitting and
                    lazy loading
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
          React.memo & Optimization Examples
        </h3>
        <pre style={{ margin: 0 }}>
          {`// 1. Basic React.memo
const MyComponent = memo(({ name, age }) => {
  return (
    <div>
      <h3>{name}</h3>
      <p>Age: {age}</p>
    </div>
  );
});

// 2. React.memo with Custom Comparison
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

// 3. React.memo with useCallback
const ParentComponent = () => {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <MemoizedChild onUpdate={handleClick} />
    </div>
  );
};

const MemoizedChild = memo(({ onUpdate }) => {
  console.log('Child rendered');
  return <button onClick={onUpdate}>Update</button>;
});

// 4. React.memo with useMemo
const ExpensiveComponent = memo(({ data }) => {
  const expensiveValue = useMemo(() => {
    console.log('Computing expensive value');
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.random();
    }
    return result;
  }, [data]);

  return <div>Result: {expensiveValue}</div>;
});

// 5. React.memo with TypeScript
interface Props {
  name: string;
  age: number;
  onUpdate: (name: string) => void;
}

const TypedComponent = memo<Props>(({ name, age, onUpdate }) => {
  return (
    <div>
      <h3>{name}</h3>
      <p>Age: {age}</p>
      <button onClick={() => onUpdate(name)}>Update</button>
    </div>
  );
});

// 6. React.memo with Children
const Container = memo(({ children, title }) => {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
});

// 7. React.memo with Multiple Props
const ComplexComponent = memo(({ user, settings, onAction }) => {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>Theme: {settings.theme}</p>
      <button onClick={() => onAction(user.id)}>Action</button>
    </div>
  );
});

// 8. React.memo with Array Props
const ListComponent = memo(({ items, onItemClick }) => {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => onItemClick(item)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
});

// 9. React.memo with Object Props
const ConfigComponent = memo(({ config, onConfigChange }) => {
  return (
    <div>
      <h3>Configuration</h3>
      <p>Theme: {config.theme}</p>
      <p>Language: {config.language}</p>
      <button onClick={() => onConfigChange({ ...config, theme: 'dark' })}>
        Toggle Theme
      </button>
    </div>
  );
});

// 10. React.memo with Function Props
const ActionComponent = memo(({ onSave, onCancel, onDelete }) => {
  return (
    <div>
      <button onClick={onSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
});

// 11. React.memo with Conditional Rendering
const ConditionalComponent = memo(({ isVisible, data, onToggle }) => {
  if (!isVisible) return null;

  return (
    <div>
      <h3>Data: {data}</h3>
      <button onClick={onToggle}>Hide</button>
    </div>
  );
});

// 12. React.memo with Performance Monitoring
const MonitoredComponent = memo(({ data, onUpdate }) => {
  console.log('MonitoredComponent rendered');
  
  useEffect(() => {
    console.log('MonitoredComponent mounted');
    return () => console.log('MonitoredComponent unmounted');
  }, []);

  return (
    <div>
      <p>Data: {data}</p>
      <button onClick={onUpdate}>Update</button>
    </div>
  );
});

// 13. React.memo with Error Boundaries
const SafeComponent = memo(({ data, onError }) => {
  if (!data) {
    onError('No data provided');
    return null;
  }

  return <div>{data}</div>;
});

// 14. React.memo with Context
const ContextComponent = memo(() => {
  const theme = useContext(ThemeContext);
  
  return (
    <div style={{ color: theme.color }}>
      <h3>Themed Component</h3>
    </div>
  );
});

// 15. React.memo with Refs
const RefComponent = memo(forwardRef((props, ref) => {
  return (
    <div ref={ref}>
      <h3>Ref Component</h3>
    </div>
  );
}));

// 16. React.memo with Hooks
const HookComponent = memo(() => {
  const [state, setState] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    console.log('Component mounted');
  }, []);

  return (
    <div ref={ref}>
      <p>State: {state}</p>
      <button onClick={() => setState(prev => prev + 1)}>
        Increment
      </button>
    </div>
  );
});

// 17. React.memo with Custom Hooks
const useCustomHook = () => {
  const [value, setValue] = useState(0);
  return { value, setValue };
};

const CustomHookComponent = memo(() => {
  const { value, setValue } = useCustomHook();
  
  return (
    <div>
      <p>Value: {value}</p>
      <button onClick={() => setValue(prev => prev + 1)}>
        Update
      </button>
    </div>
  );
});

// 18. React.memo with Lazy Loading
const LazyComponent = memo(lazy(() => import('./LazyComponent')));

// 19. React.memo with Suspense
const SuspenseComponent = memo(() => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
});

// 20. React.memo with Portal
const PortalComponent = memo(() => {
  return createPortal(
    <div>Portal Content</div>,
    document.body
  );
});`}
        </pre>
      </ResizableCodePanel>
    </div>
  );
};

export default ReactMemo;
