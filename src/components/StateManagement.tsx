import { useState, useReducer } from 'react';
import ResizableCodePanel from './ResizableCodePanel';

// Reducer for complex state management
const todoReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: Date.now(), text: action.payload, completed: false },
        ],
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map((todo: any) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter((todo: any) => todo.id !== action.payload),
      };
    default:
      return state;
  }
};

// Shopping Cart Reducer
const cartReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(
        (item: any) => item.id === action.payload.id
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item: any) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item: any) => item.id !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item: any) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    default:
      return state;
  }
};

// Form State Management
const formReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.payload,
      };
    case 'RESET_FORM':
      return {
        name: '',
        email: '',
        password: '',
        errors: {},
      };
    default:
      return state;
  }
};

const StateManagement = () => {
  // Todo List State
  const [inputValue, setInputValue] = useState('');
  const [todoState, dispatch] = useReducer(todoReducer, { todos: [] });

  // Shopping Cart State
  const [cartState, cartDispatch] = useReducer(cartReducer, { items: [] });

  // Form State
  const [formState, formDispatch] = useReducer(formReducer, {
    name: '',
    email: '',
    password: '',
    errors: {},
  });

  // Counter State
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  // Theme State
  const [theme, setTheme] = useState('light');

  // Todo Functions
  const addTodo = () => {
    if (inputValue.trim()) {
      dispatch({ type: 'ADD_TODO', payload: inputValue });
      setInputValue('');
    }
  };

  const toggleTodo = (id: number) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  };

  const deleteTodo = (id: number) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  // Cart Functions
  const addToCart = (item: any) => {
    cartDispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeFromCart = (id: number) => {
    cartDispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: number, quantity: number) => {
    cartDispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  // Form Functions
  const handleFormChange = (field: string, value: string) => {
    formDispatch({ type: 'UPDATE_FIELD', payload: { field, value } });
  };

  const validateForm = () => {
    const errors: any = {};
    if (!formState.name) errors.name = 'Name is required';
    if (!formState.email) errors.email = 'Email is required';
    if (!formState.password) errors.password = 'Password is required';
    if (formState.password && formState.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    formDispatch({ type: 'SET_ERRORS', payload: errors });
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      alert('Form submitted successfully!');
      formDispatch({ type: 'RESET_FORM' });
    }
  };

  // Sample products for cart
  const products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 25 },
    { id: 3, name: 'Keyboard', price: 75 },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left side - Content */}
      <div style={{ flex: 1, padding: '2rem' }}>
        <h1 className="heading-primary">State Management in React</h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
          }}
        >
          Learn different approaches to manage state in React applications using
          useState and useReducer.
        </p>

        {/* Important State Management Concepts */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">
            🎯 Important State Management Concepts
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
              marginTop: '1rem',
            }}
          >
            {/* useState vs useReducer */}
            <div
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                borderRadius: '12px',
                border: '2px solid #3b82f6',
              }}
            >
              <h3
                style={{
                  color: '#1e40af',
                  marginBottom: '1rem',
                  fontSize: '1.125rem',
                }}
              >
                🔄 useState vs useReducer
              </h3>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <p
                  style={{
                    marginBottom: '0.75rem',
                    fontWeight: '600',
                    color: '#1e40af',
                  }}
                >
                  useState:
                </p>
                <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
                  <li>Simple state management</li>
                  <li>Single value or object</li>
                  <li>Direct state updates</li>
                  <li>Good for simple state</li>
                </ul>
                <p
                  style={{
                    marginBottom: '0.75rem',
                    fontWeight: '600',
                    color: '#059669',
                  }}
                >
                  useReducer:
                </p>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>Complex state logic</li>
                  <li>Multiple related state updates</li>
                  <li>Predictable state transitions</li>
                  <li>Better for complex state</li>
                </ul>
              </div>
            </div>

            {/* Immutable Updates */}
            <div
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%)',
                borderRadius: '12px',
                border: '2px solid #10b981',
              }}
            >
              <h3
                style={{
                  color: '#047857',
                  marginBottom: '1rem',
                  fontSize: '1.125rem',
                }}
              >
                🛡️ Immutable Updates
              </h3>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>Never mutate state directly:</strong> Always create
                    new objects/arrays
                  </li>
                  <li>
                    <strong>Spread operator:</strong> Use ... to copy
                    objects/arrays
                  </li>
                  <li>
                    <strong>Array methods:</strong> map, filter, reduce for
                    updates
                  </li>
                  <li>
                    <strong>Object updates:</strong> Combine spread with new
                    properties
                  </li>
                  <li>
                    <strong>Nested updates:</strong> Use deep cloning or
                    immutable libraries
                  </li>
                  <li>
                    <strong>Performance:</strong> Helps React detect changes
                    efficiently
                  </li>
                </ul>
              </div>
            </div>

            {/* State Patterns */}
            <div
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
                borderRadius: '12px',
                border: '2px solid #ef4444',
              }}
            >
              <h3
                style={{
                  color: '#dc2626',
                  marginBottom: '1rem',
                  fontSize: '1.125rem',
                }}
              >
                📊 State Patterns
              </h3>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>Local State:</strong> Component-specific state
                  </li>
                  <li>
                    <strong>Lifted State:</strong> Shared state between
                    components
                  </li>
                  <li>
                    <strong>Derived State:</strong> Computed from other state
                  </li>
                  <li>
                    <strong>Form State:</strong> Input values and validation
                  </li>
                  <li>
                    <strong>UI State:</strong> Loading, error, modal states
                  </li>
                  <li>
                    <strong>Business Logic:</strong> Application data and rules
                  </li>
                </ul>
              </div>
            </div>

            {/* Performance Optimization */}
            <div
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #fffbeb 0%, #fed7aa 100%)',
                borderRadius: '12px',
                border: '2px solid #f59e0b',
              }}
            >
              <h3
                style={{
                  color: '#92400e',
                  marginBottom: '1rem',
                  fontSize: '1.125rem',
                }}
              >
                ⚡ Performance Tips
              </h3>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>Batch updates:</strong> Group multiple state updates
                  </li>
                  <li>
                    <strong>Functional updates:</strong> Use updater functions
                    for dependent state
                  </li>
                  <li>
                    <strong>Memoization:</strong> Use useMemo for expensive
                    calculations
                  </li>
                  <li>
                    <strong>Callback optimization:</strong> Use useCallback for
                    event handlers
                  </li>
                  <li>
                    <strong>State splitting:</strong> Split large state objects
                  </li>
                  <li>
                    <strong>Lazy initialization:</strong> Use function for
                    initial state
                  </li>
                </ul>
              </div>
            </div>

            {/* State Management Libraries */}
            <div
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                borderRadius: '12px',
                border: '2px solid #8b5cf6',
              }}
            >
              <h3
                style={{
                  color: '#7c3aed',
                  marginBottom: '1rem',
                  fontSize: '1.125rem',
                }}
              >
                📚 State Libraries
              </h3>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>Redux:</strong> Predictable state container
                  </li>
                  <li>
                    <strong>Zustand:</strong> Lightweight state management
                  </li>
                  <li>
                    <strong>Context API:</strong> Built-in React state sharing
                  </li>
                  <li>
                    <strong>Recoil:</strong> Facebook's experimental state
                    library
                  </li>
                  <li>
                    <strong>Jotai:</strong> Atomic state management
                  </li>
                  <li>
                    <strong>Valtio:</strong> Proxy-based state management
                  </li>
                </ul>
              </div>
            </div>

            {/* Best Practices */}
            <div
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                borderRadius: '12px',
                border: '2px solid #10b981',
              }}
            >
              <h3
                style={{
                  color: '#047857',
                  marginBottom: '1rem',
                  fontSize: '1.125rem',
                }}
              >
                ✅ Best Practices
              </h3>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>Single source of truth:</strong> Avoid duplicate
                    state
                  </li>
                  <li>
                    <strong>Normalize state:</strong> Structure data efficiently
                  </li>
                  <li>
                    <strong>Keep state minimal:</strong> Don't store derived
                    data
                  </li>
                  <li>
                    <strong>Use appropriate patterns:</strong> Choose right tool
                    for job
                  </li>
                  <li>
                    <strong>Handle loading states:</strong> Show loading
                    indicators
                  </li>
                  <li>
                    <strong>Error boundaries:</strong> Handle state errors
                    gracefully
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">State Management Overview</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginTop: '1rem',
            }}
          >
            <div
              style={{
                padding: '1rem',
                background: '#eff6ff',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>
                📊 useState
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                Simple state management for components
              </p>
            </div>
            <div
              style={{
                padding: '1rem',
                background: '#f0fdf4',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>
                🔄 useReducer
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                Complex state logic with reducers
              </p>
            </div>
            <div
              style={{
                padding: '1rem',
                background: '#fef2f2',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>
                🌐 Context API
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                Global state sharing between components
              </p>
            </div>
            <div
              style={{
                padding: '1rem',
                background: '#fffbeb',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ color: '#92400e', marginBottom: '0.5rem' }}>
                📚 External Libraries
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                Redux, Zustand, Recoil for complex apps
              </p>
            </div>
          </div>
        </div>

        {/* Todo List Demo */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#1e40af' }}>
            🔄 Todo List with useReducer
          </h3>
          <p
            style={{
              marginBottom: '1rem',
              fontSize: '0.875rem',
              color: '#6b7280',
            }}
          >
            Demonstrates complex state management with add, toggle, and delete
            operations.
          </p>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Enter a new todo..."
                className="input"
                style={{ flex: 1 }}
                onKeyPress={e => e.key === 'Enter' && addTodo()}
              />
              <button className="btn btn-primary" onClick={addTodo}>
                Add Todo
              </button>
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '1rem' }}>
              Todo List ({todoState.todos.length} items):
            </h4>
            {todoState.todos.length === 0 ? (
              <p
                style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}
              >
                No todos yet. Add one above!
              </p>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {todoState.todos.map((todo: any) => (
                  <div
                    key={todo.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.75rem',
                      background: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      style={{ transform: 'scale(1.2)' }}
                    />
                    <span
                      style={{
                        flex: 1,
                        textDecoration: todo.completed
                          ? 'line-through'
                          : 'none',
                        color: todo.completed
                          ? 'var(--text-secondary)'
                          : 'var(--text-primary)',
                      }}
                    >
                      {todo.text}
                    </span>
                    <button
                      className="btn"
                      onClick={() => deleteTodo(todo.id)}
                      style={{
                        background: 'var(--error-color)',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Shopping Cart Demo */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#059669' }}>
            🛒 Shopping Cart with useReducer
          </h3>
          <p
            style={{
              marginBottom: '1rem',
              fontSize: '0.875rem',
              color: '#6b7280',
            }}
          >
            Demonstrates complex state with nested objects and array operations.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
            }}
          >
            {/* Products */}
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Available Products:</h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {products.map(product => (
                  <div
                    key={product.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      background: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '500' }}>{product.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        ${product.price}
                      </div>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => addToCart(product)}
                      style={{ fontSize: '0.875rem' }}
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart */}
            <div>
              <h4 style={{ marginBottom: '1rem' }}>
                Shopping Cart ({cartState.items.length} items):
              </h4>
              {cartState.items.length === 0 ? (
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic',
                  }}
                >
                  Cart is empty. Add some products!
                </p>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  {cartState.items.map((item: any) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '0.75rem',
                        background: '#f0fdf4',
                        borderRadius: '8px',
                        border: '1px solid #bbf7d0',
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
                        <div style={{ fontWeight: '500' }}>{item.name}</div>
                        <button
                          className="btn"
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            background: 'var(--error-color)',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.75rem',
                          }}
                        >
                          Remove
                        </button>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          ${item.price} × {item.quantity} = $
                          {item.price * item.quantity}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                        >
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(0, item.quantity - 1)
                              )
                            }
                            style={{
                              padding: '0.25rem 0.5rem',
                              background: '#6b7280',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                          >
                            -
                          </button>
                          <span
                            style={{ minWidth: '2rem', textAlign: 'center' }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            style={{
                              padding: '0.25rem 0.5rem',
                              background: '#059669',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div
                    style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      background: '#fef3c7',
                      borderRadius: '8px',
                      textAlign: 'center',
                    }}
                  >
                    <strong>
                      Total: $
                      {cartState.items.reduce(
                        (sum: number, item: any) =>
                          sum + item.price * item.quantity,
                        0
                      )}
                    </strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Demo */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#7c3aed' }}>
            📝 Form with useReducer
          </h3>
          <p
            style={{
              marginBottom: '1rem',
              fontSize: '0.875rem',
              color: '#6b7280',
            }}
          >
            Demonstrates form state management with validation and error
            handling.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
            }}
          >
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Registration Form:</h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                    }}
                  >
                    Name:
                  </label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={e => handleFormChange('name', e.target.value)}
                    className="input"
                    style={{ width: '100%' }}
                  />
                  {formState.errors.name && (
                    <div
                      style={{
                        color: 'var(--error-color)',
                        fontSize: '0.875rem',
                        marginTop: '0.25rem',
                      }}
                    >
                      {formState.errors.name}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                    }}
                  >
                    Email:
                  </label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={e => handleFormChange('email', e.target.value)}
                    className="input"
                    style={{ width: '100%' }}
                  />
                  {formState.errors.email && (
                    <div
                      style={{
                        color: 'var(--error-color)',
                        fontSize: '0.875rem',
                        marginTop: '0.25rem',
                      }}
                    >
                      {formState.errors.email}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                    }}
                  >
                    Password:
                  </label>
                  <input
                    type="password"
                    value={formState.password}
                    onChange={e => handleFormChange('password', e.target.value)}
                    className="input"
                    style={{ width: '100%' }}
                  />
                  {formState.errors.password && (
                    <div
                      style={{
                        color: 'var(--error-color)',
                        fontSize: '0.875rem',
                        marginTop: '0.25rem',
                      }}
                    >
                      {formState.errors.password}
                    </div>
                  )}
                </div>

                <button className="btn btn-primary" onClick={handleSubmit}>
                  Submit Form
                </button>
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '1rem' }}>Form State:</h4>
              <div
                style={{
                  padding: '1rem',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                }}
              >
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(formState, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Simple State Examples */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#dc2626' }}>
            📊 Simple State with useState
          </h3>
          <p
            style={{
              marginBottom: '1rem',
              fontSize: '0.875rem',
              color: '#6b7280',
            }}
          >
            Demonstrates simple state management for counters and toggles.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
            }}
          >
            {/* Counter */}
            <div
              style={{
                textAlign: 'center',
                padding: '1rem',
                background: '#eff6ff',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ marginBottom: '1rem' }}>Counter</h4>
              <div
                style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                }}
              >
                {count}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <button
                  className="btn btn-primary"
                  onClick={() => setCount(prev => prev - step)}
                >
                  -{step}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setCount(prev => prev + step)}
                >
                  +{step}
                </button>
              </div>
              <div>
                <label style={{ fontSize: '0.875rem' }}>Step: </label>
                <input
                  type="number"
                  value={step}
                  onChange={e => setStep(Number(e.target.value))}
                  style={{
                    width: '60px',
                    padding: '0.25rem',
                    textAlign: 'center',
                  }}
                />
              </div>
            </div>

            {/* Theme Toggle */}
            <div
              style={{
                textAlign: 'center',
                padding: '1rem',
                background: theme === 'light' ? '#fef3c7' : '#1f2937',
                borderRadius: '8px',
              }}
            >
              <h4
                style={{
                  marginBottom: '1rem',
                  color: theme === 'light' ? '#92400e' : '#fbbf24',
                }}
              >
                Theme Toggle
              </h4>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                {theme === 'light' ? '☀️' : '🌙'}
              </div>
              <button
                className="btn"
                onClick={() =>
                  setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
                }
                style={{
                  background: theme === 'light' ? '#92400e' : '#fbbf24',
                  color: theme === 'light' ? '#fef3c7' : '#1f2937',
                }}
              >
                Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
              </button>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>
            🎯 State Management Best Practices
          </h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div
              style={{
                padding: '1rem',
                background: '#eff6ff',
                borderRadius: '8px',
              }}
            >
              <strong style={{ color: '#1e40af' }}>🔒 Immutability:</strong>{' '}
              Never modify state directly. Always create new objects/arrays.
            </div>
            <div
              style={{
                padding: '1rem',
                background: '#f0fdf4',
                borderRadius: '8px',
              }}
            >
              <strong style={{ color: '#059669' }}>🏷️ Action Types:</strong> Use
              descriptive action type strings and follow naming conventions.
            </div>
            <div
              style={{
                padding: '1rem',
                background: '#fef2f2',
                borderRadius: '8px',
              }}
            >
              <strong style={{ color: '#dc2626' }}>🔄 Pure Reducers:</strong>{' '}
              Keep reducers pure with no side effects or API calls.
            </div>
            <div
              style={{
                padding: '1rem',
                background: '#fef3c7',
                borderRadius: '8px',
              }}
            >
              <strong style={{ color: '#92400e' }}>📊 State Structure:</strong>{' '}
              Normalize complex data and avoid deeply nested objects.
            </div>
            <div
              style={{
                padding: '1rem',
                background: '#f3e8ff',
                borderRadius: '8px',
              }}
            >
              <strong style={{ color: '#7c3aed' }}>⚡ Performance:</strong> Use
              useState for simple state and useReducer for complex state logic.
            </div>
          </div>
        </div>

        {/* Quick Reference - Best Practices */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#1e40af' }}>
            📚 Quick Reference - Best Practices
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* useState Patterns */}
            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ color: '#1e40af', marginBottom: '0.75rem' }}>
                📊 useState Patterns
              </h4>
              <pre
                style={{
                  fontSize: '0.75rem',
                  background: '#1e293b',
                  color: '#e2e8f0',
                  padding: '1rem',
                  borderRadius: '6px',
                  overflow: 'auto',
                }}
              >
                {`// ✅ Functional updates for dependent state
const [count, setCount] = useState(0);
setCount(prev => prev + 1);

// ✅ Lazy initialization
const [state, setState] = useState(() => {
  return expensiveCalculation();
});

// ✅ Object state updates
const [user, setUser] = useState({ name: '', email: '' });
setUser(prev => ({ ...prev, name: 'John' }));

// ❌ Avoid direct mutation
setUser(prev => {
  prev.name = 'John'; // Don't do this!
  return prev;
});`}
              </pre>
            </div>

            {/* useReducer Patterns */}
            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ color: '#059669', marginBottom: '0.75rem' }}>
                🔄 useReducer Patterns
              </h4>
              <pre
                style={{
                  fontSize: '0.75rem',
                  background: '#1e293b',
                  color: '#e2e8f0',
                  padding: '1rem',
                  borderRadius: '6px',
                  overflow: 'auto',
                }}
              >
                {`// ✅ Action creators
const addTodo = (text) => ({ type: 'ADD_TODO', payload: text });
const toggleTodo = (id) => ({ type: 'TOGGLE_TODO', payload: id });

// ✅ Pure reducer function
const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, { id: Date.now(), text: action.payload, completed: false }] };
    case 'TOGGLE_TODO':
      return { ...state, todos: state.todos.map(todo => todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo) };
    default:
      return state;
  }
};

// ✅ Initial state
const initialState = { todos: [], loading: false, error: null };`}
              </pre>
            </div>

            {/* Immutable Updates */}
            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ color: '#ef4444', marginBottom: '0.75rem' }}>
                🛡️ Immutable Updates
              </h4>
              <pre
                style={{
                  fontSize: '0.75rem',
                  background: '#1e293b',
                  color: '#e2e8f0',
                  padding: '1rem',
                  borderRadius: '6px',
                  overflow: 'auto',
                }}
              >
                {`// ✅ Array updates
const addItem = (newItem) => {
  setItems(prev => [...prev, newItem]);
};

// ✅ Object updates
const updateUser = (updates) => {
  setUser(prev => ({ ...prev, ...updates }));
};

// ✅ Nested object updates
const updateNested = (path, value) => {
  setState(prev => ({
    ...prev,
    nested: {
      ...prev.nested,
      [path]: value
    }
  }));
};

// ❌ Direct mutation
items.push(newItem); // Don't do this!`}
              </pre>
            </div>

            {/* Performance Optimization */}
            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ color: '#7c3aed', marginBottom: '0.75rem' }}>
                ⚡ Performance Tips
              </h4>
              <pre
                style={{
                  fontSize: '0.75rem',
                  background: '#1e293b',
                  color: '#e2e8f0',
                  padding: '1rem',
                  borderRadius: '6px',
                  overflow: 'auto',
                }}
              >
                {`// ✅ Batch updates
const handleMultipleUpdates = () => {
  ReactDOM.flushSync(() => {
    setCount(c => c + 1);
    setFlag(f => !f);
  });
};

// ✅ Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(state);
}, [state]);

// ✅ Split large state objects
const [user, setUser] = useState(null);
const [preferences, setPreferences] = useState({});

// ✅ Use reducer for complex state
const [state, dispatch] = useReducer(complexReducer, initialState);`}
              </pre>
            </div>
          </div>
        </div>

        {/* Interview Tips */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#059669' }}>
            💡 Interview Tips & Common Questions
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '1rem',
            }}
          >
            <div
              style={{
                padding: '1rem',
                background: '#f0fdf4',
                borderRadius: '8px',
                border: '1px solid #bbf7d0',
              }}
            >
              <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>
                🤔 Common Questions
              </h4>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>When should you use useState vs useReducer?</li>
                <li>How do you handle complex state updates?</li>
                <li>What are the benefits of immutable state updates?</li>
                <li>How do you prevent unnecessary re-renders?</li>
                <li>What's the difference between local and global state?</li>
                <li>How do you manage form state in React?</li>
                <li>What are the best practices for state normalization?</li>
                <li>How do you handle async state updates?</li>
              </ul>
            </div>

            <div
              style={{
                padding: '1rem',
                background: '#fef3c7',
                borderRadius: '8px',
                border: '1px solid #fde68a',
              }}
            >
              <h4 style={{ color: '#92400e', marginBottom: '0.5rem' }}>
                🎯 Key Points to Remember
              </h4>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>Always use immutable updates for state</li>
                <li>Use functional updates for dependent state</li>
                <li>
                  Choose useState for simple state, useReducer for complex logic
                </li>
                <li>Normalize complex data structures</li>
                <li>Keep state minimal and avoid derived state</li>
                <li>Use batch updates for multiple state changes</li>
                <li>Implement proper error handling for state updates</li>
                <li>Consider performance implications of state structure</li>
              </ul>
            </div>

            <div
              style={{
                padding: '1rem',
                background: '#dbeafe',
                borderRadius: '8px',
                border: '1px solid #93c5fd',
              }}
            >
              <h4 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>
                🚀 Advanced Topics
              </h4>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>State machines and finite state automata</li>
                <li>Optimistic updates and rollback strategies</li>
                <li>State persistence and hydration</li>
                <li>State synchronization across components</li>
                <li>Custom state management hooks</li>
                <li>State testing strategies</li>
                <li>State debugging and DevTools integration</li>
                <li>State migration and versioning</li>
              </ul>
            </div>

            <div
              style={{
                padding: '1rem',
                background: '#fef2f2',
                borderRadius: '8px',
                border: '1px solid #fecaca',
              }}
            >
              <h4 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>
                ⚠️ Common Pitfalls
              </h4>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>Mutating state directly instead of creating new objects</li>
                <li>Not using functional updates for dependent state</li>
                <li>Creating deeply nested state objects</li>
                <li>Storing derived state instead of computing it</li>
                <li>Not handling loading and error states</li>
                <li>Forgetting to clean up subscriptions and timers</li>
                <li>Using useState for complex state logic</li>
                <li>Not considering state structure for performance</li>
              </ul>
            </div>

            <div
              style={{
                padding: '1rem',
                background: '#f3e8ff',
                borderRadius: '8px',
                border: '1px solid #e9d5ff',
              }}
            >
              <h4 style={{ color: '#7c3aed', marginBottom: '0.5rem' }}>
                🔧 State Management Libraries
              </h4>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>
                  <strong>Redux:</strong> Predictable state container for
                  complex apps
                </li>
                <li>
                  <strong>Zustand:</strong> Lightweight state management
                </li>
                <li>
                  <strong>Recoil:</strong> Facebook's experimental state library
                </li>
                <li>
                  <strong>Jotai:</strong> Atomic state management
                </li>
                <li>
                  <strong>Valtio:</strong> Proxy-based state management
                </li>
                <li>
                  <strong>Context API:</strong> Built-in React state sharing
                </li>
                <li>
                  <strong>SWR/React Query:</strong> Server state management
                </li>
                <li>
                  <strong>XState:</strong> State machines and statecharts
                </li>
              </ul>
            </div>

            <div
              style={{
                padding: '1rem',
                background: '#ecfdf5',
                borderRadius: '8px',
                border: '1px solid #d1fae5',
              }}
            >
              <h4 style={{ color: '#047857', marginBottom: '0.5rem' }}>
                📊 State Patterns
              </h4>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>
                  <strong>Container/Presentational:</strong> Separate logic from
                  presentation
                </li>
                <li>
                  <strong>Render Props:</strong> Share state through render
                  functions
                </li>
                <li>
                  <strong>Higher-Order Components:</strong> Wrap components with
                  state logic
                </li>
                <li>
                  <strong>Custom Hooks:</strong> Extract reusable state logic
                </li>
                <li>
                  <strong>Compound Components:</strong> Share state between
                  related components
                </li>
                <li>
                  <strong>Provider Pattern:</strong> Provide state through
                  context
                </li>
                <li>
                  <strong>Observer Pattern:</strong> Subscribe to state changes
                </li>
                <li>
                  <strong>Command Pattern:</strong> Encapsulate state changes in
                  actions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Resizable Code Example */}
      <ResizableCodePanel>
        <h3 style={{ color: '#569cd6', marginBottom: '1rem' }}>
          State Management Code Examples
        </h3>
        <pre style={{ margin: 0 }}>
          {`
// State Management Example
import { useState, useReducer } from 'react';

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, { id: Date.now(), text: action.payload, completed: false }] };
    case 'TOGGLE_TODO':
      return { ...state, todos: state.todos.map(todo => todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo) };
    case 'DELETE_TODO':
      return { ...state, todos: state.todos.filter(todo => todo.id !== action.payload) };
    default:
      return state;
  }
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return { ...state, items: state.items.map(item => item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item) };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    case 'UPDATE_QUANTITY':
      return { ...state, items: state.items.map(item => item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item) };
    default:
      return state;
  }
};

const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.payload.field]: action.payload.value };
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    case 'RESET_FORM':
      return { name: '', email: '', password: '', errors: {} };
    default:
      return state;
  }
};

// ... (component logic and UI rendering as shown in the left panel) ...
`}
        </pre>
      </ResizableCodePanel>
    </div>
  );
};

export default StateManagement;
