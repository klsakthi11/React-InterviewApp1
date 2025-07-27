import { useState, useRef, useEffect, useCallback } from 'react';
import ResizableCodePanel from './ResizableCodePanel';

const EventHandling = () => {
  const [clickCount, setClickCount] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [keyPressed, setKeyPressed] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Basic click event
  const handleClick = () => {
    setClickCount(prev => prev + 1);
  };

  // Click with parameters
  const handleItemClick = (id: number) => {
    alert(`Clicked item with ID: ${id}`);
  };

  // Mouse events
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseEnter = () => {
    console.log('Mouse entered the area');
  };

  const handleMouseLeave = () => {
    console.log('Mouse left the area');
  };

  // Form events
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Form submitted: ${JSON.stringify(formData)}`);
  };

  // Keyboard events
  const handleKeyPress = (e: React.KeyboardEvent) => {
    setKeyPressed(e.key);
    if (e.key === 'Enter') {
      console.log('Enter key pressed!');
    }
  };

  // Focus events
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Preventing default behavior
  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('Link click prevented!');
  };

  // Event bubbling demonstration
  const handleParentClick = () => {
    console.log('Parent clicked');
  };

  const handleChildClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Child clicked (propagation stopped)');
  };

  // Custom click outside hook
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Memoized event handler
  const handleMemoizedClick = useCallback(() => {
    console.log('Memoized click handler called');
    setClickCount(prev => prev + 1);
  }, []);

  // Additional event handlers for comprehensive demo
  // Removed unused dragPosition state
  const [isDragging, setIsDragging] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [hoveredElement, setHoveredElement] = useState('');

  // Drag and drop events
  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', 'dragged item');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const data = e.dataTransfer.getData('text/plain');
    alert(`Dropped: ${data}`);
  };

  // Scroll events
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollPosition(e.currentTarget.scrollTop);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchPosition({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchPosition({ x: touch.clientX, y: touch.clientY });
  };

  // Context menu events
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  // Selection events
  const handleItemSelect = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Hover events
  const handleElementHover = (elementName: string) => {
    setHoveredElement(elementName);
  };

  const handleElementLeave = () => {
    setHoveredElement('');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left side - Content */}
      <div style={{ flex: 1, padding: '2rem' }}>
        <h1 className="heading-primary">Event Handling in React</h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
          }}
        >
          Learn how to handle user interactions and events in React components.
        </p>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">Click Events</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleClick}
              style={{
                padding: '1rem 2rem',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Click me! (Count: {clickCount})
            </button>
            <button
              onClick={handleMemoizedClick}
              style={{
                padding: '1rem 2rem',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Memoized Click
            </button>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <p>Click with parameters:</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1, 2, 3].map(id => (
                <button
                  key={id}
                  onClick={() => handleItemClick(id)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Item {id}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="card"
          style={{ padding: '2rem', marginBottom: '2rem' }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <h2 className="heading-secondary">Mouse Events</h2>
          <p>Move your mouse over this area to see coordinates:</p>
          <p>
            X: {mousePosition.x}, Y: {mousePosition.y}
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Check console for mouse enter/leave events
          </p>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">Keyboard Events</h2>
          <input
            type="text"
            placeholder="Type here to see key events..."
            onKeyPress={handleKeyPress}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              marginBottom: '1rem',
            }}
          />
          <p>
            Last key pressed: <strong>{keyPressed || 'None'}</strong>
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Press Enter to see console log
          </p>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">Focus Events</h2>
          <input
            type="text"
            placeholder="Click to focus..."
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `2px solid ${isFocused ? '#3b82f6' : '#d1d5db'}`,
              borderRadius: '8px',
              fontSize: '1rem',
              marginBottom: '1rem',
            }}
          />
          <p>
            Focus status:{' '}
            <strong>{isFocused ? 'Focused' : 'Not focused'}</strong>
          </p>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">Preventing Default Behavior</h2>
          <a
            href="https://example.com"
            onClick={handleLinkClick}
            style={{
              color: '#3b82f6',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            This link won't navigate (click prevented)
          </a>
        </div>

        <div
          className="card"
          style={{ padding: '2rem', marginBottom: '2rem' }}
          onClick={handleParentClick}
        >
          <h2 className="heading-secondary">Event Bubbling</h2>
          <p>Click the parent area or the child button:</p>
          <button
            onClick={handleChildClick}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Child Button (stops propagation)
          </button>
          <p
            style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginTop: '1rem',
            }}
          >
            Check console for event bubbling demonstration
          </p>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">Click Outside Detection</h2>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Toggle Dropdown
            </button>
            {showDropdown && (
              <div
                ref={dropdownRef}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginTop: '0.5rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  zIndex: 10,
                }}
              >
                <p>Dropdown content</p>
                <p>Click outside to close</p>
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">Form Events</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Name:
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                }}
              />
            </div>
            <button
              type="submit"
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
              Submit
            </button>
          </form>
        </div>

        {/* Drag and Drop Events */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">🖱️ Drag & Drop Events</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
            }}
          >
            <div>
              <h4 style={{ marginBottom: '1rem', color: '#1e40af' }}>
                Draggable Item
              </h4>
              <div
                draggable
                onDragStart={handleDragStart}
                style={{
                  padding: '2rem',
                  backgroundColor: isDragging ? '#fbbf24' : '#3b82f6',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'grab',
                  textAlign: 'center',
                  transition: 'background-color 0.3s ease',
                }}
              >
                {isDragging ? 'Dragging...' : 'Drag me to the drop zone!'}
              </div>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem', color: '#059669' }}>
                Drop Zone
              </h4>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{
                  padding: '2rem',
                  backgroundColor: '#f0fdf4',
                  border: '2px dashed #10b981',
                  borderRadius: '8px',
                  textAlign: 'center',
                  minHeight: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Drop here!
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Events */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">📜 Scroll Events</h2>
          <div
            onScroll={handleScroll}
            style={{
              height: '200px',
              overflow: 'auto',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '1rem',
            }}
          >
            <div style={{ height: '800px', padding: '1rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Scrollable Content</h4>
              {Array.from({ length: 20 }, (_, i) => (
                <p key={i} style={{ marginBottom: '1rem' }}>
                  Scroll position: {scrollPosition}px - Line {i + 1}
                </p>
              ))}
            </div>
          </div>
          <p
            style={{
              marginTop: '1rem',
              fontSize: '0.875rem',
              color: '#6b7280',
            }}
          >
            Current scroll position: {scrollPosition}px
          </p>
        </div>

        {/* Touch Events */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">📱 Touch Events</h2>
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            style={{
              padding: '2rem',
              backgroundColor: '#fef3c7',
              border: '2px solid #f59e0b',
              borderRadius: '8px',
              textAlign: 'center',
              minHeight: '150px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p style={{ marginBottom: '1rem' }}>
              Touch this area (mobile/tablet)
            </p>
            <p style={{ fontSize: '0.875rem', color: '#92400e' }}>
              Touch Position: X: {touchPosition.x}, Y: {touchPosition.y}
            </p>
          </div>
        </div>

        {/* Context Menu Events */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">🖱️ Context Menu Events</h2>
          <div
            onContextMenu={handleContextMenu}
            style={{
              padding: '2rem',
              backgroundColor: '#f3e8ff',
              border: '2px solid #8b5cf6',
              borderRadius: '8px',
              textAlign: 'center',
              cursor: 'context-menu',
            }}
          >
            <p>Right-click here to show custom context menu</p>
          </div>
          {showContextMenu && (
            <div
              style={{
                position: 'fixed',
                top: contextMenuPosition.y,
                left: contextMenuPosition.x,
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
              }}
            >
              <button
                onClick={() => setShowContextMenu(false)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                Custom Option 1
              </button>
              <button
                onClick={() => setShowContextMenu(false)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                Custom Option 2
              </button>
            </div>
          )}
        </div>

        {/* Selection Events */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">✅ Selection Events</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
            }}
          >
            {[1, 2, 3, 4, 5, 6].map(id => (
              <div
                key={id}
                onClick={() => handleItemSelect(id)}
                style={{
                  padding: '1rem',
                  backgroundColor: selectedItems.includes(id)
                    ? '#10b981'
                    : '#f3f4f6',
                  color: selectedItems.includes(id) ? 'white' : '#374151',
                  border: '2px solid',
                  borderColor: selectedItems.includes(id)
                    ? '#059669'
                    : '#d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                Item {id}
                {selectedItems.includes(id) && ' ✓'}
              </div>
            ))}
          </div>
          <p
            style={{
              marginTop: '1rem',
              fontSize: '0.875rem',
              color: '#6b7280',
            }}
          >
            Selected items:{' '}
            {selectedItems.length > 0 ? selectedItems.join(', ') : 'None'}
          </p>
        </div>

        {/* Hover Events */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">🖱️ Hover Events</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            {['Button', 'Card', 'Link', 'Image'].map(element => (
              <div
                key={element}
                onMouseEnter={() => handleElementHover(element)}
                onMouseLeave={handleElementLeave}
                style={{
                  padding: '1.5rem',
                  backgroundColor:
                    hoveredElement === element ? '#dbeafe' : '#f8fafc',
                  border: '2px solid',
                  borderColor:
                    hoveredElement === element ? '#3b82f6' : '#e2e8f0',
                  borderRadius: '8px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
              >
                {element}
                {hoveredElement === element && (
                  <div
                    style={{
                      marginTop: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#3b82f6',
                    }}
                  >
                    Hovering!
                  </div>
                )}
              </div>
            ))}
          </div>
          <p
            style={{
              marginTop: '1rem',
              fontSize: '0.875rem',
              color: '#6b7280',
            }}
          >
            Currently hovering: {hoveredElement || 'None'}
          </p>
        </div>

        {/* Important Event Handling Concepts */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#1e40af' }}>
            🎯 Important Event Handling Concepts
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '1.5rem',
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
              <h4 style={{ color: '#059669', marginBottom: '0.75rem' }}>
                🖱️ Synthetic Events
              </h4>
              <p
                style={{
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  marginBottom: '0.5rem',
                }}
              >
                React wraps native browser events in{' '}
                <strong style={{ color: '#059669' }}>SyntheticEvent</strong>{' '}
                objects for cross-browser compatibility.
              </p>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>Consistent API across different browsers</li>
                <li>Automatic event pooling for performance</li>
                <li>Normalized event properties</li>
                <li>Prevents memory leaks</li>
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
              <h4 style={{ color: '#92400e', marginBottom: '0.75rem' }}>
                🌊 Event Bubbling & Capturing
              </h4>
              <p
                style={{
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  marginBottom: '0.5rem',
                }}
              >
                Events propagate through the DOM tree in three phases.
              </p>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>
                  <strong style={{ color: '#92400e' }}>Capturing:</strong>{' '}
                  Events flow down from root to target
                </li>
                <li>
                  <strong style={{ color: '#92400e' }}>Target:</strong> Event
                  reaches the target element
                </li>
                <li>
                  <strong style={{ color: '#92400e' }}>Bubbling:</strong> Events
                  bubble up from target to root
                </li>
                <li>
                  Use{' '}
                  <code
                    style={{
                      background: '#fef3c7',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    stopPropagation()
                  </code>{' '}
                  to prevent bubbling
                </li>
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
              <h4 style={{ color: '#1e40af', marginBottom: '0.75rem' }}>
                ⚡ Event Handler Performance
              </h4>
              <p
                style={{
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  marginBottom: '0.5rem',
                }}
              >
                Optimize event handling for better performance and user
                experience.
              </p>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>
                  Use{' '}
                  <code
                    style={{
                      background: '#dbeafe',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    useCallback
                  </code>{' '}
                  for memoized handlers
                </li>
                <li>Implement event delegation for many elements</li>
                <li>Debounce rapid events (scroll, resize)</li>
                <li>Throttle expensive operations</li>
                <li>Use passive event listeners for scroll events</li>
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
              <h4 style={{ color: '#dc2626', marginBottom: '0.75rem' }}>
                ♿ Accessibility & Events
              </h4>
              <p
                style={{
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  marginBottom: '0.5rem',
                }}
              >
                Ensure events work for all users, including those using
                assistive technologies.
              </p>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>Support keyboard navigation (Enter, Space, Arrow keys)</li>
                <li>Provide proper ARIA attributes</li>
                <li>Handle focus management</li>
                <li>Support screen readers</li>
                <li>Test with keyboard-only navigation</li>
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
              <h4 style={{ color: '#7c3aed', marginBottom: '0.75rem' }}>
                🛡️ Event Handler Patterns
              </h4>
              <p
                style={{
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  marginBottom: '0.5rem',
                }}
              >
                Common patterns for handling different types of events.
              </p>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>
                  <strong style={{ color: '#7c3aed' }}>
                    Controlled Components:
                  </strong>{' '}
                  Form inputs with onChange
                </li>
                <li>
                  <strong style={{ color: '#7c3aed' }}>Custom Hooks:</strong>{' '}
                  Reusable event logic
                </li>
                <li>
                  <strong style={{ color: '#7c3aed' }}>
                    Event Delegation:
                  </strong>{' '}
                  Handle events at parent level
                </li>
                <li>
                  <strong style={{ color: '#7c3aed' }}>
                    Higher-Order Components:
                  </strong>{' '}
                  Wrap with event logic
                </li>
                <li>
                  <strong style={{ color: '#7c3aed' }}>Render Props:</strong>{' '}
                  Share event handlers
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
              <h4 style={{ color: '#047857', marginBottom: '0.75rem' }}>
                🧹 Cleanup & Memory Management
              </h4>
              <p
                style={{
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  marginBottom: '0.5rem',
                }}
              >
                Proper cleanup prevents memory leaks and improves performance.
              </p>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>Remove event listeners in useEffect cleanup</li>
                <li>Cancel timers and intervals</li>
                <li>Clear subscriptions and observers</li>
                <li>Abort fetch requests</li>
                <li>Reset state on component unmount</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Event Handling Methods Overview */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#059669' }}>
            📋 Event Handling Methods Overview
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
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ color: '#1e40af', marginBottom: '0.75rem' }}>
                🖱️ Mouse Events
              </h4>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onClick
                  </code>{' '}
                  - Element clicked
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onDoubleClick
                  </code>{' '}
                  - Element double-clicked
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onMouseEnter
                  </code>{' '}
                  - Mouse enters element
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onMouseLeave
                  </code>{' '}
                  - Mouse leaves element
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onMouseMove
                  </code>{' '}
                  - Mouse moves over element
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onMouseDown
                  </code>{' '}
                  - Mouse button pressed
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onMouseUp
                  </code>{' '}
                  - Mouse button released
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onContextMenu
                  </code>{' '}
                  - Right-click menu
                </li>
              </ul>
            </div>

            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ color: '#059669', marginBottom: '0.75rem' }}>
                ⌨️ Keyboard Events
              </h4>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onKeyDown
                  </code>{' '}
                  - Key pressed down
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onKeyUp
                  </code>{' '}
                  - Key released
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onKeyPress
                  </code>{' '}
                  - Character key pressed
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onCompositionStart
                  </code>{' '}
                  - IME composition starts
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onCompositionEnd
                  </code>{' '}
                  - IME composition ends
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onCompositionUpdate
                  </code>{' '}
                  - IME composition updates
                </li>
              </ul>
            </div>

            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ color: '#ef4444', marginBottom: '0.75rem' }}>
                📝 Form Events
              </h4>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onChange
                  </code>{' '}
                  - Input value changed
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onInput
                  </code>{' '}
                  - Input value changes (real-time)
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onSubmit
                  </code>{' '}
                  - Form submitted
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onReset
                  </code>{' '}
                  - Form reset
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onFocus
                  </code>{' '}
                  - Element gains focus
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onBlur
                  </code>{' '}
                  - Element loses focus
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onSelect
                  </code>{' '}
                  - Text selected
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onInvalid
                  </code>{' '}
                  - Form validation fails
                </li>
              </ul>
            </div>

            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ color: '#7c3aed', marginBottom: '0.75rem' }}>
                📱 Touch Events
              </h4>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onTouchStart
                  </code>{' '}
                  - Touch begins
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onTouchMove
                  </code>{' '}
                  - Touch moves
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onTouchEnd
                  </code>{' '}
                  - Touch ends
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onTouchCancel
                  </code>{' '}
                  - Touch cancelled
                </li>
              </ul>
            </div>

            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ color: '#92400e', marginBottom: '0.75rem' }}>
                🔄 Drag & Drop Events
              </h4>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onDragStart
                  </code>{' '}
                  - Drag operation starts
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onDrag
                  </code>{' '}
                  - Element being dragged
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onDragEnter
                  </code>{' '}
                  - Dragged element enters drop zone
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onDragOver
                  </code>{' '}
                  - Dragged element over drop zone
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onDragLeave
                  </code>{' '}
                  - Dragged element leaves drop zone
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onDrop
                  </code>{' '}
                  - Element dropped
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onDragEnd
                  </code>{' '}
                  - Drag operation ends
                </li>
              </ul>
            </div>

            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ color: '#dc2626', marginBottom: '0.75rem' }}>
                📜 UI Events
              </h4>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onScroll
                  </code>{' '}
                  - Element scrolled
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onResize
                  </code>{' '}
                  - Window/element resized
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onLoad
                  </code>{' '}
                  - Resource loaded
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onError
                  </code>{' '}
                  - Error occurred
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onAbort
                  </code>{' '}
                  - Request aborted
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onBeforeUnload
                  </code>{' '}
                  - Page unloading
                </li>
                <li>
                  <code
                    style={{
                      background: '#f1f5f9',
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                    }}
                  >
                    onUnload
                  </code>{' '}
                  - Page unloaded
                </li>
              </ul>
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
            {/* Event Handler Patterns */}
            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ color: '#1e40af', marginBottom: '0.75rem' }}>
                🎯 Event Handler Patterns
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
                {`// ✅ Descriptive naming
const handleUserClick = (userId: string) => {
  // Handle user click
};

// ✅ Arrow function for simple handlers
const handleClick = () => setCount(prev => prev + 1);

// ✅ Memoized handlers for performance
const handleClick = useCallback(() => {
  // Expensive operation
}, [dependency]);

// ✅ Event delegation
const handleItemClick = (e: React.MouseEvent) => {
  const itemId = e.currentTarget.dataset.id;
  // Handle item click
};

// ❌ Avoid inline functions
<button onClick={() => setCount(count + 1)}>Click</button>`}
              </pre>
            </div>

            {/* Event Prevention */}
            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ color: '#059669', marginBottom: '0.75rem' }}>
                🛡️ Event Prevention
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
                {`// ✅ Prevent default behavior
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // Custom submit logic
};

// ✅ Stop event propagation
const handleChildClick = (e: React.MouseEvent) => {
  e.stopPropagation();
  // Handle child click only
};

// ✅ Stop immediate propagation
const handleClick = (e: React.MouseEvent) => {
  e.stopImmediatePropagation();
  // Stop all other handlers
};

// ✅ Return false (not recommended)
const handleClick = () => {
  // Some logic
  return false; // Prevents default and stops propagation
};`}
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
              <h4 style={{ color: '#ef4444', marginBottom: '0.75rem' }}>
                ⚡ Performance Optimization
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
                {`// ✅ Debounce rapid events
const debouncedHandler = useMemo(
  () => debounce((value) => {
    // Handle debounced event
  }, 300),
  []
);

// ✅ Throttle expensive operations
const throttledHandler = useMemo(
  () => throttle((value) => {
    // Handle throttled event
  }, 100),
  []
);

// ✅ Passive event listeners
useEffect(() => {
  const handleScroll = () => {
    // Scroll handling
  };
  
  element.addEventListener('scroll', handleScroll, { passive: true });
  return () => element.removeEventListener('scroll', handleScroll);
}, []);

// ✅ Event delegation for many elements
const handleListClick = (e: React.MouseEvent) => {
  const item = e.target.closest('[data-item]');
  if (item) {
    const id = item.dataset.id;
    // Handle item click
  }
};`}
              </pre>
            </div>

            {/* Accessibility */}
            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ color: '#7c3aed', marginBottom: '0.75rem' }}>
                ♿ Accessibility
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
                {`// ✅ Keyboard support
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleClick();
  }
};

// ✅ Focus management
const handleModalOpen = () => {
  setModalOpen(true);
  // Focus first interactive element
  modalRef.current?.focus();
};

// ✅ ARIA attributes
<button
  onClick={handleClick}
  onKeyDown={handleKeyDown}
  aria-label="Close modal"
  aria-expanded={isExpanded}
>
  Close
</button>

// ✅ Screen reader support
const handleClick = () => {
  // Announce to screen readers
  announceToScreenReader('Item selected');
};`}
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
                <li>What are synthetic events in React?</li>
                <li>How does event bubbling work?</li>
                <li>When should you use useCallback with event handlers?</li>
                <li>How do you prevent event bubbling?</li>
                <li>What's the difference between onKeyDown and onKeyPress?</li>
                <li>How do you handle form submissions?</li>
                <li>What are the best practices for event handling?</li>
                <li>How do you implement drag and drop?</li>
                <li>How do you handle touch events for mobile?</li>
                <li>What's event delegation and when to use it?</li>
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
                <li>React events are synthetic and cross-browser compatible</li>
                <li>Always use preventDefault() for form submissions</li>
                <li>Use stopPropagation() to prevent event bubbling</li>
                <li>Memoize event handlers with useCallback when needed</li>
                <li>Implement proper keyboard navigation</li>
                <li>Handle cleanup in useEffect return function</li>
                <li>Use event delegation for performance</li>
                <li>Support touch events for mobile devices</li>
                <li>Provide proper ARIA attributes</li>
                <li>Test with screen readers and keyboard navigation</li>
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
                <li>Custom event systems and event buses</li>
                <li>Event-driven architecture patterns</li>
                <li>Real-time event handling with WebSockets</li>
                <li>Event sourcing and CQRS patterns</li>
                <li>Custom hook patterns for event handling</li>
                <li>Event testing strategies and mocking</li>
                <li>Performance profiling of event handlers</li>
                <li>Cross-component event communication</li>
                <li>Event persistence and replay</li>
                <li>Event-driven state management</li>
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
                <li>Creating new functions in render causing re-renders</li>
                <li>Forgetting to prevent default form behavior</li>
                <li>Not handling cleanup in useEffect</li>
                <li>Missing keyboard event handlers</li>
                <li>Not supporting touch events for mobile</li>
                <li>Ignoring accessibility requirements</li>
                <li>Not debouncing rapid events (scroll, resize)</li>
                <li>Forgetting to stop event propagation when needed</li>
                <li>Not handling errors in event handlers</li>
                <li>Creating memory leaks with event listeners</li>
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
                🔧 Event Handling Libraries
              </h4>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>
                  <strong>react-use:</strong> Collection of useful hooks
                  including event handlers
                </li>
                <li>
                  <strong>usehooks-ts:</strong> TypeScript hooks for common
                  patterns
                </li>
                <li>
                  <strong>react-hotkeys-hook:</strong> Keyboard shortcuts and
                  hotkeys
                </li>
                <li>
                  <strong>react-dnd:</strong> Drag and drop functionality
                </li>
                <li>
                  <strong>react-beautiful-dnd:</strong> Beautiful drag and drop
                </li>
                <li>
                  <strong>react-swipeable:</strong> Swipe gestures for mobile
                </li>
                <li>
                  <strong>react-use-gesture:</strong> Advanced gesture
                  recognition
                </li>
                <li>
                  <strong>framer-motion:</strong> Animation and gesture library
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
                📊 Event Patterns
              </h4>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>
                  <strong>Observer Pattern:</strong> Subscribe to event changes
                </li>
                <li>
                  <strong>Publisher/Subscriber:</strong> Decoupled event
                  communication
                </li>
                <li>
                  <strong>Event Delegation:</strong> Handle events at parent
                  level
                </li>
                <li>
                  <strong>Command Pattern:</strong> Encapsulate event actions
                </li>
                <li>
                  <strong>Chain of Responsibility:</strong> Event handling
                  pipeline
                </li>
                <li>
                  <strong>Mediator Pattern:</strong> Centralized event
                  coordination
                </li>
                <li>
                  <strong>State Machine:</strong> Event-driven state transitions
                </li>
                <li>
                  <strong>Event Sourcing:</strong> Store events instead of state
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Resizable Code Example */}
      <ResizableCodePanel>
        <h3 style={{ color: '#569cd6', marginBottom: '1rem' }}>
          Event Handling Examples
        </h3>
        <pre style={{ margin: 0 }}>
          {`/**
 * 🎯 EVENT HANDLING EXPLANATION
 * 
 * React events are synthetic events that wrap native DOM events.
 * They provide cross-browser compatibility and consistent behavior.
 * 
 * Key concepts:
 * - Events are camelCased (onClick, onMouseEnter)
 * - Event handlers receive synthetic event objects
 * - Events bubble up the component tree
 * - You can prevent default behavior and stop propagation
 */

// 1. Basic Click Event Handler
/**
 * 🖱️ Basic Click Event Explanation:
 * 
 * Purpose: Handle simple button clicks
 * Event object: Contains information about the event
 * Common use cases: Buttons, links, divs
 * 
 * The event object provides:
 * - target: The element that triggered the event
 * - currentTarget: The element the handler is attached to
 * - preventDefault(): Stop default browser behavior
 * - stopPropagation(): Stop event bubbling
 */
const handleClick = () => {
  console.log('Button clicked!');
  // You can access event object if needed: (e) => console.log(e)
};

<button onClick={handleClick}>Click me</button>

// 2. Event with Parameters (Closure Pattern)
/**
 * 🔗 Parameterized Event Handler Explanation:
 * 
 * Purpose: Pass data to event handlers
 * Pattern: Use arrow function to create closure
 * Benefits: Access component state/props in event handler
 * 
 * Why arrow function: Creates closure that captures current values
 * Alternative: useCallback for performance optimization
 */
const handleClick = (id: number) => {
  console.log('Clicked item:', id);
  // Can access component state/props here
};

<button onClick={() => handleClick(123)}>Click me</button>

// 3. Mouse Events - Multiple Event Types
/**
 * 🖱️ Mouse Events Explanation:
 * 
 * Common mouse events:
 * - onMouseMove: Fires continuously as mouse moves
 * - onMouseEnter: Fires when mouse enters element
 * - onMouseLeave: Fires when mouse leaves element
 * - onMouseDown/onMouseUp: Fires on mouse button press/release
 * 
 * Event object provides:
 * - clientX/clientY: Mouse position relative to viewport
 * - pageX/pageY: Mouse position relative to document
 * - button: Which mouse button was pressed
 */
const handleMouseMove = (e: React.MouseEvent) => {
  console.log('Mouse position:', e.clientX, e.clientY);
  // e.clientX: X coordinate relative to viewport
  // e.clientY: Y coordinate relative to viewport
};

<div onMouseMove={handleMouseMove}>
  Move mouse here
</div>

// 4. Form Events - Preventing Default Behavior
/**
 * 📝 Form Events Explanation:
 * 
 * Purpose: Handle form submissions and prevent default behavior
 * preventDefault(): Stops form from submitting and page reload
 * Common use cases: Form validation, custom submission logic
 * 
 * Other form events:
 * - onChange: Input value changes
 * - onFocus/onBlur: Input focus events
 * - onKeyPress: Keyboard input
 */
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault(); // Prevent form submission and page reload
  console.log('Form submitted');
  // Handle form data here
};

<form onSubmit={handleSubmit}>
  <button type="submit">Submit</button>
</form>

// 5. Input Change Events - Controlled Components
/**
 * 📊 Input Change Events Explanation:
 * 
 * Purpose: Create controlled components (React manages input state)
 * Event object: Contains new input value in e.target.value
 * Benefits: Real-time validation, immediate UI updates
 * 
 * Controlled vs Uncontrolled:
 * - Controlled: React manages input state
 * - Uncontrolled: DOM manages input state (use refs)
 */
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log('Input value:', e.target.value);
  // e.target.value contains the new input value
  // Update state with this value for controlled component
};

<input onChange={handleChange} />

// 6. Event with State Updates
/**
 * 🔄 State Updates in Event Handlers Explanation:
 * 
 * Purpose: Update component state based on user interactions
 * Functional updates: Use function form for state updates
 * Benefits: Access to previous state, avoid stale closures
 * 
 * Best practices:
 * - Use functional updates when new state depends on previous
 * - Avoid direct state mutations
 * - Consider useCallback for performance
 */
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount(prev => prev + 1); // Functional update
  // Alternative: setCount(count + 1) - but can have stale closure issues
};

<button onClick={handleClick}>Count: {count}</button>

// 7. Preventing Default Behavior
/**
 * 🛑 Preventing Default Behavior Explanation:
 * 
 * Purpose: Stop browser's default action for events
 * Common use cases: Custom navigation, form handling
 * preventDefault(): Stops default behavior but allows event bubbling
 * 
 * Examples:
 * - Links: Prevent navigation, handle with JavaScript
 * - Forms: Prevent submission, handle with custom logic
 * - Right-click: Prevent context menu, show custom menu
 */
const handleLinkClick = (e: React.MouseEvent) => {
  e.preventDefault(); // Prevent navigation to href
  console.log('Link clicked but navigation prevented');
  // Handle navigation with React Router or custom logic
};

<a href="/" onClick={handleLinkClick}>Click me</a>

// 8. Event Bubbling and stopPropagation
/**
 * 🌊 Event Bubbling Explanation:
 * 
 * Event bubbling: Events bubble up from child to parent elements
 * stopPropagation(): Stops event from bubbling up
 * Common use cases: Modal overlays, nested clickable elements
 * 
 * Event phases:
 * 1. Capture phase: Event goes down from root to target
 * 2. Target phase: Event reaches the target element
 * 3. Bubble phase: Event bubbles up from target to root
 */
const handleParentClick = () => {
  console.log('Parent clicked');
};

const handleChildClick = (e: React.MouseEvent) => {
  e.stopPropagation(); // Stop event from bubbling to parent
  console.log('Child clicked');
  // Parent click handler won't be called
};

<div onClick={handleParentClick}>
  <button onClick={handleChildClick}>Child Button</button>
</div>

// 9. Keyboard Events - Key Detection
/**
 * ⌨️ Keyboard Events Explanation:
 * 
 * Purpose: Handle keyboard input and shortcuts
 * Common events: onKeyPress, onKeyDown, onKeyUp
 * Event object: Contains key information
 * 
 * Key properties:
 * - e.key: The key that was pressed (Enter, Escape, etc.)
 * - e.code: Physical key code
 * - e.ctrlKey, e.shiftKey, e.altKey: Modifier keys
 */
const handleKeyPress = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter') {
    console.log('Enter pressed');
  }
  if (e.key === 'Escape') {
    console.log('Escape pressed');
  }
  // Check for modifier keys
  if (e.ctrlKey && e.key === 's') {
    console.log('Ctrl+S pressed');
  }
};

<input onKeyPress={handleKeyPress} />

// 10. Focus Events - Input State Management
/**
 * 🎯 Focus Events Explanation:
 * 
 * Purpose: Handle input focus and blur states
 * Common use cases: Form validation, UI state management
 * Focus management: Important for accessibility and UX
 * 
 * Focus events:
 * - onFocus: Element gains focus
 * - onBlur: Element loses focus
 * - onFocusIn/onFocusOut: Similar but bubble
 */
const handleFocus = () => {
  console.log('Input focused');
  // Good for: Showing validation messages, highlighting
};

const handleBlur = () => {
  console.log('Input lost focus');
  // Good for: Hiding validation messages, saving data
};

<input onFocus={handleFocus} onBlur={handleBlur} />

// 11. Custom Event Handlers - Reusable Logic
/**
 * 🔧 Custom Event Handlers Explanation:
 * 
 * Purpose: Create reusable event handling logic
 * Pattern: Custom hooks for complex event handling
 * Benefits: Code reusability, separation of concerns
 * 
 * Common custom handlers:
 * - Click outside detection
 * - Keyboard shortcuts
 * - Scroll handling
 * - Resize handling
 */
const useClickOutside = (ref: RefObject<HTMLElement>, handler: () => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      // Check if click is outside the referenced element
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return; // Click is inside, do nothing
      }
      handler(); // Click is outside, call handler
    };

    // Add event listener to document
    document.addEventListener('mousedown', listener);
    
    // Cleanup: remove event listener on unmount
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
};

// 12. Event Handler with useCallback - Performance Optimization
/**
 * ⚡ useCallback with Event Handlers Explanation:
 * 
 * Purpose: Optimize performance by memoizing event handlers
 * When to use: When handler is passed to child components
 * Benefits: Prevents unnecessary re-renders of child components
 * 
 * useCallback memoizes the function:
 * - Returns same function reference if dependencies don't change
 * - Child components can use React.memo effectively
 * - Reduces unnecessary re-renders
 */
const handleClick = useCallback(() => {
  console.log('Button clicked');
}, []); // Empty dependency array = function never changes

<button onClick={handleClick}>Click me</button>

/**
 * 🎯 EVENT HANDLING BEST PRACTICES:
 * 
 * 1. 🏷️ EVENT NAMING
 *    - Use descriptive names: handleSubmit, handleUserClick
 *    - Follow camelCase convention: onClick, onMouseEnter
 *    - Be specific about what the handler does
 * 
 * 2. ⚡ PERFORMANCE
 *    - Use useCallback for handlers passed to child components
 *    - Avoid creating functions in render
 *    - Use event delegation for many similar elements
 * 
 * 3. ♿ ACCESSIBILITY
 *    - Support keyboard navigation
 *    - Provide proper ARIA attributes
 *    - Handle focus management
 * 
 * 4. 🛡️ ERROR HANDLING
 *    - Wrap event handlers in try-catch when needed
 *    - Provide fallback behavior
 *    - Log errors appropriately
 * 
 * 5. 🧹 CLEANUP
 *    - Remove event listeners in useEffect cleanup
 *    - Cancel timers and subscriptions
 *    - Clear intervals and timeouts
 * 
 * 6. 🔒 TYPE SAFETY
 *    - Use proper TypeScript event types
 *    - Type event handler parameters
 *    - Use generic types for reusable handlers
 */`}
        </pre>
      </ResizableCodePanel>
    </div>
  );
};

export default EventHandling;
