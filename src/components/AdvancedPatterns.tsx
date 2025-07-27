import { useState, createContext, useContext, Fragment, useRef } from 'react';
import { createPortal } from 'react-dom';
import ResizableCodePanel from './ResizableCodePanel';

// Compound Components Pattern
interface AccordionContextType {
  activeItem: string | null;
  toggleItem: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(
  undefined
);

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within Accordion');
  }
  return context;
};

interface AccordionProps {
  children: React.ReactNode;
  defaultActive?: string | null;
}

const Accordion = ({ children, defaultActive = null }: AccordionProps) => {
  const [activeItem, setActiveItem] = useState<string | null>(defaultActive);

  const toggleItem = (id: string) => {
    setActiveItem(prev => (prev === id ? null : id));
  };

  return (
    <AccordionContext.Provider value={{ activeItem, toggleItem }}>
      <div
        style={{
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

interface AccordionItemProps {
  id: string;
  children: React.ReactNode;
}

const AccordionItem = ({ id, children }: AccordionItemProps) => {
  const { activeItem, toggleItem } = useAccordion();
  const isActive = activeItem === id;

  return (
    <div style={{ borderBottom: '1px solid #d1d5db' }}>
      <button
        onClick={() => toggleItem(id)}
        style={{
          width: '100%',
          padding: '1rem',
          backgroundColor: isActive ? '#f3f4f6' : 'white',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: '1rem',
          fontWeight: '500',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>{children}</span>
        <span
          style={{
            fontSize: '1.5rem',
            transition: 'transform 0.2s',
            transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          ▼
        </span>
      </button>
      {isActive && (
        <div style={{ padding: '1rem', backgroundColor: '#f9fafb' }}>
          <p>This is the content for {id}. You can put any content here.</p>
        </div>
      )}
    </div>
  );
};

// Controlled vs Uncontrolled Components
interface ControlledInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ControlledInput = ({
  value,
  onChange,
  placeholder,
}: ControlledInputProps) => {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '1rem',
      }}
    />
  );
};

interface UncontrolledInputProps {
  defaultValue: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
}

const UncontrolledInput = ({
  defaultValue,
  placeholder,
  onValueChange,
}: UncontrolledInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = () => {
    if (onValueChange && inputRef.current) {
      onValueChange(inputRef.current.value);
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      defaultValue={defaultValue}
      onChange={handleChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '1rem',
      }}
    />
  );
};

// Portal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <h2 style={{ margin: 0 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem',
            }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};

// Fragment Component
const FragmentExample = () => {
  return (
    <Fragment>
      <h3>Fragment Example</h3>
      <p>This content is rendered without an extra DOM element.</p>
      <p>Multiple elements can be grouped together.</p>
    </Fragment>
  );
};

// Render Props with Children
interface ToggleProps {
  children: (props: { isOn: boolean; toggle: () => void }) => React.ReactNode;
}

const Toggle = ({ children }: ToggleProps) => {
  const [isOn, setIsOn] = useState(false);

  const toggle = () => setIsOn(prev => !prev);

  return <>{children({ isOn, toggle })}</>;
};

// Custom Hook Pattern
const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);
  const setValue = (value: number) => setCount(value);

  return { count, increment, decrement, reset, setValue };
};

// Context with Custom Hook

// Demo Components
const CompoundComponentsDemo = () => {
  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h3>Compound Components Pattern</h3>
      <p style={{ marginBottom: '1rem' }}>
        Compound components allow you to create components that work together
        while maintaining a clean API.
      </p>

      <Accordion defaultActive="item1">
        <AccordionItem id="item1">Section 1: Introduction</AccordionItem>
        <AccordionItem id="item2">Section 2: Getting Started</AccordionItem>
        <AccordionItem id="item3">Section 3: Advanced Topics</AccordionItem>
        <AccordionItem id="item4">Section 4: Best Practices</AccordionItem>
      </Accordion>
    </div>
  );
};

const ControlledUncontrolledDemo = () => {
  const [controlledValue, setControlledValue] = useState('');
  const [uncontrolledValue, setUncontrolledValue] = useState('');

  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h3>Controlled vs Uncontrolled Components</h3>

      <div style={{ marginBottom: '2rem' }}>
        <h4>Controlled Input</h4>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '0.5rem',
          }}
        >
          Value is controlled by React state
        </p>
        <ControlledInput
          value={controlledValue}
          onChange={setControlledValue}
          placeholder="Type something..."
        />
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
          Current value: <strong>{controlledValue || '(empty)'}</strong>
        </p>
      </div>

      <div>
        <h4>Uncontrolled Input</h4>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '0.5rem',
          }}
        >
          Value is managed by the DOM
        </p>
        <UncontrolledInput
          defaultValue="Default value"
          placeholder="Type something..."
          onValueChange={setUncontrolledValue}
        />
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
          Current value: <strong>{uncontrolledValue || '(not tracked)'}</strong>
        </p>
      </div>
    </div>
  );
};

const PortalDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h3>Portal Example</h3>
      <p style={{ marginBottom: '1rem' }}>
        Portals allow you to render children into a DOM node that exists outside
        the parent component's DOM hierarchy.
      </p>

      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        Open Modal
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Portal Modal"
      >
        <p>
          This modal is rendered using a portal, which means it's rendered
          outside the normal DOM hierarchy.
        </p>
        <p>This is useful for modals, tooltips, and other overlays.</p>
        <button
          onClick={() => setIsModalOpen(false)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '1rem',
          }}
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

const RenderPropsDemo = () => {
  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h3>Render Props Pattern</h3>
      <p style={{ marginBottom: '1rem' }}>
        Render props is a technique for sharing code between React components
        using a prop whose value is a function.
      </p>

      <Toggle>
        {({ isOn, toggle }) => (
          <div style={{ textAlign: 'center' }}>
            <h4>Toggle State: {isOn ? 'ON' : 'OFF'}</h4>
            <button
              onClick={toggle}
              style={{
                padding: '1rem 2rem',
                backgroundColor: isOn ? '#10b981' : '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              {isOn ? 'ON' : 'OFF'}
            </button>
          </div>
        )}
      </Toggle>
    </div>
  );
};

const CustomHookDemo = () => {
  const { count, increment, decrement, reset, setValue } = useCounter(0);

  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h3>Custom Hook Pattern</h3>
      <p style={{ marginBottom: '1rem' }}>
        Custom hooks allow you to extract component logic into reusable
        functions.
      </p>

      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{count}</h2>
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
        >
          <button
            onClick={increment}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            +
          </button>
          <button
            onClick={decrement}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            -
          </button>
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Reset
          </button>
        </div>
        <div>
          <input
            type="number"
            value={count}
            onChange={e => setValue(Number(e.target.value))}
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              width: '100px',
              textAlign: 'center',
            }}
          />
        </div>
      </div>
    </div>
  );
};

const AdvancedPatterns = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left side - Content */}
      <div style={{ flex: 1, padding: '2rem' }}>
        <h1 className="heading-primary">Advanced React Patterns</h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
          }}
        >
          Learn advanced React patterns and techniques for building scalable and
          maintainable applications.
        </p>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">Advanced Patterns Overview</h2>
          <p style={{ marginBottom: '1rem' }}>
            These patterns help you write more flexible, reusable, and
            maintainable React code.
          </p>
          <ul style={{ listStyle: 'disc', paddingLeft: '2rem' }}>
            <li>Compound Components - Components that work together</li>
            <li>
              Controlled vs Uncontrolled - Different ways to manage form state
            </li>
            <li>Portals - Render outside DOM hierarchy</li>
            <li>Fragments - Group elements without extra DOM nodes</li>
            <li>Render Props - Share logic between components</li>
            <li>Custom Hooks - Extract and reuse component logic</li>
          </ul>
        </div>

        <CompoundComponentsDemo />
        <ControlledUncontrolledDemo />
        <PortalDemo />
        <RenderPropsDemo />
        <CustomHookDemo />

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3>Fragment Example</h3>
          <FragmentExample />
        </div>

        {/* Important Advanced Patterns Concepts */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">
            🎯 Important Advanced Patterns Concepts
          </h2>
          <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>
                🏗️ Compound Components
              </h4>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Purpose:</strong> Create components that work together
                while maintaining a clean API
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Benefits:</strong> Flexible composition, shared state,
                clean JSX
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Use cases:</strong> Accordions, form fields, navigation
                menus
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>
                📊 Controlled vs Uncontrolled
              </h4>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Controlled:</strong> Component state is managed by
                parent, single source of truth
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Uncontrolled:</strong> Component manages its own state
                internally
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>When to use:</strong> Controlled for complex forms,
                uncontrolled for simple inputs
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>
                🚪 Portals
              </h4>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Purpose:</strong> Render children into a DOM node
                outside the parent component
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Benefits:</strong> Escape CSS stacking context, render
                outside DOM hierarchy
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Use cases:</strong> Modals, tooltips, overlays, global
                notifications
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>
                🧩 Fragments
              </h4>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Purpose:</strong> Group multiple elements without adding
                extra DOM nodes
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Benefits:</strong> Clean DOM structure, avoid wrapper
                elements
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Use cases:</strong> Returning multiple elements,
                conditional rendering
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>
                🎨 Render Props
              </h4>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Purpose:</strong> Share logic between components using a
                prop that renders
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Benefits:</strong> Code reuse, flexible rendering,
                inversion of control
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Use cases:</strong> Data fetching, mouse tracking, form
                validation
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>
                🔧 Custom Hooks
              </h4>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Purpose:</strong> Extract and reuse stateful logic
                between components
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Benefits:</strong> Logic reuse, cleaner components,
                better testing
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Use cases:</strong> Form handling, API calls,
                subscriptions, animations
              </p>
            </div>
          </div>
        </div>

        {/* Advanced Patterns Overview */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">📋 Advanced Patterns Overview</h2>
          <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>
                🏗️ Compound Components
              </h4>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li>Use Context API for shared state</li>
                <li>Provide flexible composition patterns</li>
                <li>Keep API simple and intuitive</li>
                <li>Handle prop drilling automatically</li>
              </ul>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>
                📊 Controlled vs Uncontrolled
              </h4>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li>Controlled: State managed by parent component</li>
                <li>Uncontrolled: State managed internally with refs</li>
                <li>Consider performance implications</li>
                <li>Choose based on complexity and requirements</li>
              </ul>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>
                🚪 Portals
              </h4>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li>Use createPortal for rendering outside DOM hierarchy</li>
                <li>Handle focus management and accessibility</li>
                <li>Consider event bubbling behavior</li>
                <li>Clean up portals on unmount</li>
              </ul>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>
                🧩 Fragments
              </h4>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li>Use React.Fragment or shorthand syntax</li>
                <li>Avoid unnecessary wrapper elements</li>
                <li>Consider key props for lists</li>
                <li>Keep DOM structure clean</li>
              </ul>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>
                🎨 Render Props
              </h4>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li>Share logic between components</li>
                <li>Provide flexible rendering options</li>
                <li>Consider performance with inline functions</li>
                <li>Use TypeScript for better type safety</li>
              </ul>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>
                🔧 Custom Hooks
              </h4>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li>Extract reusable stateful logic</li>
                <li>Follow naming conventions (use prefix)</li>
                <li>Handle cleanup properly with useEffect</li>
                <li>Return values and functions as needed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Reference - Best Practices */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">
            ⚡ Quick Reference - Best Practices
          </h2>
          <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>
                🚫 Common Pitfalls
              </h4>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li>Over-engineering simple components</li>
                <li>Not handling cleanup in custom hooks</li>
                <li>Forgetting accessibility in portals</li>
                <li>Using render props for everything</li>
                <li>Not considering performance implications</li>
              </ul>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>
                ✅ Best Practices
              </h4>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li>Start simple, add complexity when needed</li>
                <li>Use TypeScript for better type safety</li>
                <li>Handle edge cases and error states</li>
                <li>Consider accessibility from the start</li>
                <li>Test patterns in isolation</li>
                <li>Document complex patterns clearly</li>
              </ul>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: '#7c3aed', marginBottom: '0.5rem' }}>
                🎯 Performance Tips
              </h4>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li>Memoize expensive calculations in custom hooks</li>
                <li>Use React.memo for render prop components</li>
                <li>Optimize portal rendering with useMemo</li>
                <li>Consider code splitting for complex patterns</li>
                <li>Profile performance before optimization</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Interview Tips & Common Questions */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">
            🎯 Interview Tips & Common Questions
          </h2>
          <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
            {/* Common Interview Questions */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>
                ❓ Common Interview Questions
              </h3>
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>
                  🏗️ Compound Components
                </h4>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>Q:</strong> How do you implement compound
                    components?
                  </li>
                  <li>
                    <strong>A:</strong> Use Context API to share state between
                    parent and child components
                  </li>
                  <li>
                    <strong>Q:</strong> What are the benefits of compound
                    components?
                  </li>
                  <li>
                    <strong>A:</strong> Flexible composition, shared state,
                    clean API, better developer experience
                  </li>
                  <li>
                    <strong>Q:</strong> How do you handle prop drilling in
                    compound components?
                  </li>
                  <li>
                    <strong>A:</strong> Context API automatically handles prop
                    drilling between related components
                  </li>
                </ul>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>
                  📊 Controlled vs Uncontrolled
                </h4>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>Q:</strong> When would you use controlled vs
                    uncontrolled components?
                  </li>
                  <li>
                    <strong>A:</strong> Controlled for complex forms with
                    validation, uncontrolled for simple inputs
                  </li>
                  <li>
                    <strong>Q:</strong> How do you convert between controlled
                    and uncontrolled?
                  </li>
                  <li>
                    <strong>A:</strong> Use defaultValue for uncontrolled, value
                    + onChange for controlled
                  </li>
                  <li>
                    <strong>Q:</strong> What are the performance implications?
                  </li>
                  <li>
                    <strong>A:</strong> Controlled components re-render on every
                    keystroke, uncontrolled don't
                  </li>
                </ul>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>
                  🚪 Portals
                </h4>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>Q:</strong> What are React portals and when do you
                    use them?
                  </li>
                  <li>
                    <strong>A:</strong> Render children outside DOM hierarchy,
                    used for modals, tooltips, overlays
                  </li>
                  <li>
                    <strong>Q:</strong> How do you handle event bubbling with
                    portals?
                  </li>
                  <li>
                    <strong>A:</strong> Events bubble up to the portal
                    container, not the parent component
                  </li>
                  <li>
                    <strong>Q:</strong> What are accessibility considerations
                    for portals?
                  </li>
                  <li>
                    <strong>A:</strong> Focus management, ARIA attributes,
                    keyboard navigation
                  </li>
                </ul>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>
                  🎨 Render Props
                </h4>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>Q:</strong> What are render props and how do they
                    work?
                  </li>
                  <li>
                    <strong>A:</strong> Props that render content, share logic
                    between components
                  </li>
                  <li>
                    <strong>Q:</strong> What are the alternatives to render
                    props?
                  </li>
                  <li>
                    <strong>A:</strong> Custom hooks, HOCs, Context API
                  </li>
                  <li>
                    <strong>Q:</strong> How do you optimize render props
                    performance?
                  </li>
                  <li>
                    <strong>A:</strong> Memoize the render function, use
                    React.memo for child components
                  </li>
                </ul>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>
                  🔧 Custom Hooks
                </h4>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>Q:</strong> What are the rules for custom hooks?
                  </li>
                  <li>
                    <strong>A:</strong> Must start with 'use', can only call
                    other hooks at the top level
                  </li>
                  <li>
                    <strong>Q:</strong> How do you handle cleanup in custom
                    hooks?
                  </li>
                  <li>
                    <strong>A:</strong> Return cleanup function from useEffect,
                    handle subscriptions
                  </li>
                  <li>
                    <strong>Q:</strong> How do you test custom hooks?
                  </li>
                  <li>
                    <strong>A:</strong> Use @testing-library/react-hooks or
                    renderHook
                  </li>
                </ul>
              </div>
            </div>

            {/* Key Points to Remember */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>
                🔑 Key Points to Remember
              </h3>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li>
                  <strong>Compound Components:</strong> Use Context for shared
                  state, keep API simple
                </li>
                <li>
                  <strong>Controlled Components:</strong> Single source of
                  truth, better for complex forms
                </li>
                <li>
                  <strong>Uncontrolled Components:</strong> Use refs, better
                  performance for simple inputs
                </li>
                <li>
                  <strong>Portals:</strong> Escape DOM hierarchy, handle focus
                  and accessibility
                </li>
                <li>
                  <strong>Fragments:</strong> Group elements without extra DOM
                  nodes
                </li>
                <li>
                  <strong>Render Props:</strong> Share logic, provide flexible
                  rendering
                </li>
                <li>
                  <strong>Custom Hooks:</strong> Extract reusable logic, follow
                  naming conventions
                </li>
                <li>
                  <strong>Performance:</strong> Consider re-renders,
                  memoization, and optimization
                </li>
              </ul>
            </div>

            {/* Advanced Topics */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>
                🚀 Advanced Topics
              </h3>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li>
                  <strong>Pattern Composition:</strong> Combining multiple
                  patterns for complex solutions
                </li>
                <li>
                  <strong>Performance Optimization:</strong> React.memo,
                  useMemo, useCallback with patterns
                </li>
                <li>
                  <strong>TypeScript Integration:</strong> Generic types,
                  utility types, pattern-specific types
                </li>
                <li>
                  <strong>Testing Strategies:</strong> Unit testing patterns,
                  integration testing, mocking
                </li>
                <li>
                  <strong>Accessibility:</strong> ARIA attributes, keyboard
                  navigation, screen readers
                </li>
                <li>
                  <strong>Error Boundaries:</strong> Handling errors in complex
                  pattern implementations
                </li>
                <li>
                  <strong>Code Splitting:</strong> Lazy loading patterns,
                  dynamic imports
                </li>
                <li>
                  <strong>State Machines:</strong> Complex state management with
                  patterns
                </li>
              </ul>
            </div>

            {/* Common Pitfalls */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>
                ⚠️ Common Pitfalls to Avoid
              </h3>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li>
                  <strong>Over-engineering:</strong> Using complex patterns for
                  simple problems
                </li>
                <li>
                  <strong>Performance Issues:</strong> Not considering re-render
                  implications
                </li>
                <li>
                  <strong>Accessibility Neglect:</strong> Forgetting keyboard
                  navigation and ARIA
                </li>
                <li>
                  <strong>Memory Leaks:</strong> Not cleaning up subscriptions
                  and event listeners
                </li>
                <li>
                  <strong>Type Safety:</strong> Not using TypeScript for complex
                  patterns
                </li>
                <li>
                  <strong>Testing Complexity:</strong> Making patterns hard to
                  test
                </li>
                <li>
                  <strong>Documentation:</strong> Not documenting complex
                  pattern usage
                </li>
                <li>
                  <strong>Breaking Changes:</strong> Not considering backward
                  compatibility
                </li>
              </ul>
            </div>

            {/* Related Libraries & Patterns */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>
                📚 Related Libraries & Patterns
              </h3>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li>
                  <strong>Compound Components:</strong> React Bootstrap,
                  Material-UI, Ant Design
                </li>
                <li>
                  <strong>Render Props:</strong> React Router, Formik, React
                  Motion
                </li>
                <li>
                  <strong>Custom Hooks:</strong> React Query, SWR, React Hook
                  Form
                </li>
                <li>
                  <strong>Portals:</strong> React Portal, React Modal, Floating
                  UI
                </li>
                <li>
                  <strong>State Management:</strong> Redux Toolkit, Zustand,
                  Jotai
                </li>
                <li>
                  <strong>Form Libraries:</strong> React Hook Form, Formik,
                  Final Form
                </li>
                <li>
                  <strong>Animation:</strong> Framer Motion, React Spring, React
                  Transition Group
                </li>
                <li>
                  <strong>Testing:</strong> React Testing Library, Jest, Cypress
                </li>
              </ul>
            </div>

            {/* Advanced Patterns & Best Practices */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>
                🎨 Advanced Patterns & Best Practices
              </h3>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li>
                  <strong>Pattern Composition:</strong> Combine multiple
                  patterns for complex solutions
                </li>
                <li>
                  <strong>Performance Patterns:</strong> Use React.memo,
                  useMemo, useCallback strategically
                </li>
                <li>
                  <strong>Error Handling:</strong> Implement error boundaries
                  for pattern failures
                </li>
                <li>
                  <strong>Type Safety:</strong> Use TypeScript generics and
                  utility types
                </li>
                <li>
                  <strong>Testing Patterns:</strong> Create testable pattern
                  implementations
                </li>
                <li>
                  <strong>Documentation:</strong> Document pattern usage and
                  examples
                </li>
                <li>
                  <strong>Accessibility:</strong> Ensure patterns work with
                  assistive technologies
                </li>
                <li>
                  <strong>Performance Monitoring:</strong> Track pattern
                  performance in production
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Resizable Code Example */}
      <ResizableCodePanel>
        <h3 style={{ color: '#569cd6', marginBottom: '1rem' }}>
          Advanced Patterns Examples
        </h3>
        <pre style={{ margin: 0 }}>
          {`/**
 * 🎯 ADVANCED REACT PATTERNS EXPLANATION
 * 
 * These patterns help you write more flexible, reusable, and maintainable React code.
 * Each pattern solves specific problems and provides different benefits.
 */

// 1. 🏗️ Compound Components Pattern
/**
 * Purpose: Create components that work together while maintaining a clean API
 * Benefits: Flexible composition, shared state, clean JSX
 * Use cases: Accordions, form fields, navigation menus
 */
interface AccordionContextType {
  activeItem: string | null;
  toggleItem: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within Accordion');
  }
  return context;
};

const Accordion = ({ children, defaultActive = null }) => {
  const [activeItem, setActiveItem] = useState(defaultActive);

  const toggleItem = (id: string) => {
    setActiveItem(prev => prev === id ? null : id);
  };

  return (
    <AccordionContext.Provider value={{ activeItem, toggleItem }}>
      <div>{children}</div>
    </AccordionContext.Provider>
  );
};

const AccordionItem = ({ id, children }) => {
  const { activeItem, toggleItem } = useAccordion();
  const isActive = activeItem === id;

  return (
    <div>
      <button onClick={() => toggleItem(id)}>
        {children}
      </button>
      {isActive && <div>Content</div>}
    </div>
  );
};

// 2. 📊 Controlled vs Uncontrolled Components
/**
 * Purpose: Different approaches to managing form state
 * Controlled: React manages state, better for validation
 * Uncontrolled: DOM manages state, better for performance
 */
const ControlledInput = ({ value, onChange, placeholder }) => {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};

const UncontrolledInput = ({ defaultValue, onValueChange }) => {
  const inputRef = useRef();

  const handleChange = () => {
    if (onValueChange && inputRef.current) {
      onValueChange(inputRef.current.value);
    }
  };

  return (
    <input
      ref={inputRef}
      defaultValue={defaultValue}
      onChange={handleChange}
    />
  );
};

// 3. 🚪 Portal Component
/**
 * Purpose: Render children into a DOM node outside parent hierarchy
 * Benefits: Modals, tooltips, overlays that break out of containers
 * Use cases: Modals, dropdowns, notifications
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div>
        <h2>{title}</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
};

// 4. 🧩 Fragment Component
/**
 * Purpose: Group elements without adding extra DOM nodes
 * Benefits: Cleaner HTML, no unnecessary wrapper elements
 * Use cases: Returning multiple elements from components
 */
const FragmentExample = () => {
  return (
    <Fragment>
      <h3>Fragment Example</h3>
      <p>This content is rendered without an extra DOM element.</p>
    </Fragment>
  );
};

// 5. 🎨 Render Props Pattern
/**
 * Purpose: Share code between components using a prop whose value is a function
 * Benefits: Code reusability, flexible rendering, state sharing
 * Use cases: Data fetching, form handling, state management
 */
const Toggle = ({ children }) => {
  const [isOn, setIsOn] = useState(false);

  const toggle = () => setIsOn(prev => !prev);

  return children({ isOn, toggle });
};

// 6. 🔧 Custom Hook Pattern
/**
 * Purpose: Extract and reuse component logic
 * Benefits: Code reusability, separation of concerns, testing
 * Use cases: Form handling, API calls, state management
 */
const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);
  const setValue = (value) => setCount(value);

  return { count, increment, decrement, reset, setValue };
};

// 7. 🌐 Context with Custom Hook
/**
 * Purpose: Provide global state with custom hook for better API
 * Benefits: Cleaner API, error handling, type safety
 * Use cases: Theme, authentication, global state
 */
const ThemeContext = createContext();

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// 8. 🏗️ Using Compound Components
const App = () => (
  <Accordion defaultActive="item1">
    <AccordionItem id="item1">Section 1</AccordionItem>
    <AccordionItem id="item2">Section 2</AccordionItem>
  </Accordion>
);

// 9. 📊 Using Controlled Components
const Form = () => {
  const [value, setValue] = useState('');

  return (
    <ControlledInput
      value={value}
      onChange={setValue}
      placeholder="Type something..."
    />
  );
};

// 10. 🚪 Using Portals
const AppWithModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="My Modal">
        <p>Modal content</p>
      </Modal>
    </div>
  );
};

// 11. 🎨 Using Render Props
const ToggleExample = () => (
  <Toggle>
    {({ isOn, toggle }) => (
      <div>
        <h4>State: {isOn ? 'ON' : 'OFF'}</h4>
        <button onClick={toggle}>{isOn ? 'ON' : 'OFF'}</button>
      </div>
    )}
  </Toggle>
);

// 12. 🔧 Using Custom Hooks
const CounterComponent = () => {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <div>
      <h2>{count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

// 13. 🏗️ Higher-Order Component with Render Props
/**
 * Purpose: Enhance components with additional functionality
 * Benefits: Code reuse, separation of concerns, composition
 * Use cases: Data fetching, authentication, logging
 */
const withData = (WrappedComponent) => {
  return function WithDataComponent(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Fetch data
      setData({ message: 'Hello from HOC' });
      setLoading(false);
    }, []);

    return (
      <WrappedComponent
        {...props}
        data={data}
        loading={loading}
      />
    );
  };
};

// 14. 🧩 Composition Pattern
/**
 * Purpose: Build complex components from simple, reusable pieces
 * Benefits: Reusability, flexibility, maintainability
 * Use cases: Button variants, form fields, layout components
 */
const Button = ({ children, ...props }) => (
  <button {...props}>{children}</button>
);

const PrimaryButton = (props) => (
  <Button {...props} style={{ backgroundColor: 'blue', color: 'white' }} />
);

const SecondaryButton = (props) => (
  <Button {...props} style={{ backgroundColor: 'gray', color: 'white' }} />
);

// 15. 🌐 Provider Pattern
/**
 * Purpose: Provide global state or configuration to component tree
 * Benefits: Global state management, configuration sharing
 * Use cases: Theme, authentication, internationalization
 */
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 16. 🔗 Using All Patterns Together
/**
 * Purpose: Demonstrate how different patterns can work together
 * Benefits: Comprehensive solution, best practices
 * Use cases: Complex applications, component libraries
 */
const AdvancedApp = () => (
  <ThemeProvider>
    <div>
      <Accordion>
        <AccordionItem id="section1">Advanced Patterns</AccordionItem>
      </Accordion>
      
      <Toggle>
        {({ isOn, toggle }) => (
          <button onClick={toggle}>{isOn ? 'ON' : 'OFF'}</button>
        )}
      </Toggle>
      
      <CounterComponent />
    </div>
  </ThemeProvider>
);

/**
 * 🎯 ADVANCED PATTERNS BEST PRACTICES:
 * 
 * 1. 🏗️ COMPOUND COMPONENTS
 *    - Use context for shared state
 *    - Provide flexible composition
 *    - Keep API simple and intuitive
 * 
 * 2. 📊 CONTROLLED VS UNCONTROLLED
 *    - Use controlled for complex forms
 *    - Use uncontrolled for simple inputs
 *    - Consider performance implications
 * 
 * 3. 🚪 PORTALS
 *    - Use for modals and overlays
 *    - Handle focus management
 *    - Consider accessibility
 * 
 * 4. 🧩 FRAGMENTS
 *    - Use to avoid wrapper elements
 *    - Keep DOM structure clean
 *    - Consider key props for lists
 * 
 * 5. 🎨 RENDER PROPS
 *    - Share logic between components
 *    - Provide flexible rendering
 *    - Consider performance with inline functions
 * 
 * 6. 🔧 CUSTOM HOOKS
 *    - Extract reusable logic
 *    - Follow naming conventions
 *    - Handle cleanup properly
 * 
 * 7. 🌐 CONTEXT
 *    - Use for global state
 *    - Provide custom hooks for API
 *    - Consider performance with large state
 * 
 * 8. 🏗️ COMPOSITION
 *    - Build from simple pieces
 *    - Use prop spreading carefully
 *    - Maintain clear interfaces
 */`}
        </pre>
      </ResizableCodePanel>
    </div>
  );
};

export default AdvancedPatterns;
