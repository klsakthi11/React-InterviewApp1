import {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import ResizableCodePanel from './ResizableCodePanel';

// Forwarded Ref Component
interface VideoPlayerRef {
  play: () => void;
  pause: () => void;
  reset: () => void;
}

const VideoPlayer = forwardRef<VideoPlayerRef>((_props, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useImperativeHandle(ref, () => ({
    play: () => {
      videoRef.current?.play();
      setIsPlaying(true);
    },
    pause: () => {
      videoRef.current?.pause();
      setIsPlaying(false);
    },
    reset: () => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.pause();
        setIsPlaying(false);
      }
    },
  }));

  return (
    <div style={{ textAlign: 'center' }}>
      <video
        ref={videoRef}
        width="300"
        height="200"
        style={{ border: '1px solid #d1d5db', borderRadius: '8px' }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://www.w3schools.com/html/mov_bbb.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <p>Status: {isPlaying ? 'Playing' : 'Paused'}</p>
    </div>
  );
});

// Canvas Drawing Component
const CanvasDrawing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 300;
    canvas.height = 200;

    // Set drawing styles
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          cursor: 'crosshair',
        }}
      />
      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={clearCanvas}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Clear Canvas
        </button>
      </div>
    </div>
  );
};

// Auto-focus Input Component
const AutoFocusInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="This input will be focused automatically"
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

// Element Measurement Component
const ElementMeasurement = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [measurements, setMeasurements] = useState({
    width: 0,
    height: 0,
    offsetTop: 0,
    offsetLeft: 0,
  });

  const measureElement = () => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setMeasurements({
        width: rect.width,
        height: rect.height,
        offsetTop: elementRef.current.offsetTop,
        offsetLeft: elementRef.current.offsetLeft,
      });
    }
  };

  useEffect(() => {
    measureElement();
    window.addEventListener('resize', measureElement);
    return () => window.removeEventListener('resize', measureElement);
  }, []);

  return (
    <div>
      <div
        ref={elementRef}
        style={{
          width: '200px',
          height: '100px',
          backgroundColor: '#3b82f6',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          marginBottom: '1rem',
        }}
      >
        Measurable Element
      </div>

      <div style={{ fontSize: '0.875rem' }}>
        <p>
          <strong>Width:</strong> {measurements.width}px
        </p>
        <p>
          <strong>Height:</strong> {measurements.height}px
        </p>
        <p>
          <strong>Offset Top:</strong> {measurements.offsetTop}px
        </p>
        <p>
          <strong>Offset Left:</strong> {measurements.offsetLeft}px
        </p>
      </div>

      <button
        onClick={measureElement}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '0.5rem',
        }}
      >
        Re-measure
      </button>
    </div>
  );
};

// Scroll to Element Component
const ScrollToElement = () => {
  const targetRef = useRef<HTMLDivElement>(null);

  const scrollToTarget = () => {
    targetRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  return (
    <div>
      <button
        onClick={scrollToTarget}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem',
          marginBottom: '2rem',
        }}
      >
        Scroll to Target
      </button>

      <div
        style={{
          height: '300px',
          overflow: 'auto',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          padding: '1rem',
        }}
      >
        <div
          style={{
            height: '200px',
            backgroundColor: '#f3f4f6',
            marginBottom: '1rem',
          }}
        >
          Scroll down to see the target element...
        </div>

        <div
          ref={targetRef}
          style={{
            height: '100px',
            backgroundColor: '#10b981',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            fontSize: '1.125rem',
            fontWeight: 'bold',
          }}
        >
          🎯 Target Element
        </div>

        <div
          style={{
            height: '200px',
            backgroundColor: '#f3f4f6',
            marginTop: '1rem',
          }}
        >
          More content below...
        </div>
      </div>
    </div>
  );
};

const RefsAndDOM = () => {
  const videoPlayerRef = useRef<VideoPlayerRef>(null);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left side - Content */}
      <div style={{ flex: 1, padding: '2rem' }}>
        <h1 className="heading-primary">Refs & DOM in React</h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
          }}
        >
          Learn how to use refs to access DOM elements and imperative methods in
          React components.
        </p>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">What are Refs?</h2>
          <p style={{ marginBottom: '1rem' }}>
            Refs provide a way to access DOM nodes or React elements created in
            the render method. They are useful for:
          </p>
          <ul style={{ listStyle: 'disc', paddingLeft: '2rem' }}>
            <li>Managing focus, text selection, or media playback</li>
            <li>Triggering imperative animations</li>
            <li>Integrating with third-party DOM libraries</li>
            <li>Measuring DOM elements</li>
            <li>Accessing imperative methods on child components</li>
          </ul>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">
            Video Player with Imperative Handle
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            This video player exposes imperative methods through
            useImperativeHandle.
          </p>
          <VideoPlayer ref={videoPlayerRef} />
          <div
            style={{
              marginTop: '1rem',
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => videoPlayerRef.current?.play()}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Play
            </button>
            <button
              onClick={() => videoPlayerRef.current?.pause()}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Pause
            </button>
            <button
              onClick={() => videoPlayerRef.current?.reset()}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">Canvas Drawing</h2>
          <p style={{ marginBottom: '1rem' }}>
            Draw on the canvas using mouse events and refs to access the canvas
            context.
          </p>
          <CanvasDrawing />
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">Auto-focus Input</h2>
          <p style={{ marginBottom: '1rem' }}>
            This input is automatically focused when the component mounts.
          </p>
          <AutoFocusInput />
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">Element Measurement</h2>
          <p style={{ marginBottom: '1rem' }}>
            Measure DOM element dimensions and position using refs.
          </p>
          <ElementMeasurement />
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">Scroll to Element</h2>
          <p style={{ marginBottom: '1rem' }}>
            Programmatically scroll to a specific element using refs.
          </p>
          <ScrollToElement />
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
                    <strong>What is a ref in React?</strong> - A way to access
                    DOM nodes or React elements directly
                  </li>
                  <li>
                    <strong>When should you use refs?</strong> - For imperative
                    actions: focus, selection, media playback, measuring,
                    integrating with non-React libraries
                  </li>
                  <li>
                    <strong>What is useRef?</strong> - A React hook to create a
                    mutable ref object
                  </li>
                  <li>
                    <strong>
                      How do you forward refs to child components?
                    </strong>{' '}
                    - Use React.forwardRef
                  </li>
                  <li>
                    <strong>What is useImperativeHandle?</strong> - Customizes
                    the instance value exposed to parent refs
                  </li>
                  <li>
                    <strong>How do you auto-focus an input?</strong> - Use ref
                    and call .focus() in useEffect
                  </li>
                  <li>
                    <strong>How do you measure a DOM element?</strong> - Use ref
                    and read properties like getBoundingClientRect
                  </li>
                  <li>
                    <strong>What are the risks of using refs?</strong> - Can
                    break React's declarative model, lead to bugs
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
                    <strong>Refs are for imperative code</strong> - Use for
                    direct DOM access
                  </li>
                  <li>
                    <strong>Don't overuse refs</strong> - Prefer declarative
                    code when possible
                  </li>
                  <li>
                    <strong>Always check ref.current</strong> - It may be null
                  </li>
                  <li>
                    <strong>Use forwardRef for custom components</strong> - To
                    pass refs down
                  </li>
                  <li>
                    <strong>useImperativeHandle for custom APIs</strong> -
                    Expose imperative methods
                  </li>
                  <li>
                    <strong>Refs don't trigger re-renders</strong> - Mutating
                    ref.current doesn't cause updates
                  </li>
                  <li>
                    <strong>Can be used for animations</strong> - Triggering
                    transitions, measuring
                  </li>
                  <li>
                    <strong>Type refs in TypeScript</strong> - Use correct types
                    for DOM elements
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
                    <strong>Custom imperative handles</strong> - Expose custom
                    methods to parent
                  </li>
                  <li>
                    <strong>Integrating with third-party libraries</strong> -
                    Use refs to access DOM for plugins
                  </li>
                  <li>
                    <strong>Measuring and animations</strong> - Use refs for
                    layout, transitions
                  </li>
                  <li>
                    <strong>Refs with portals</strong> - Accessing DOM outside
                    the root
                  </li>
                  <li>
                    <strong>Refs in class components</strong> - Use
                    React.createRef
                  </li>
                  <li>
                    <strong>Refs and context</strong> - Combine for advanced
                    patterns
                  </li>
                  <li>
                    <strong>Refs and accessibility</strong> - Manage focus for
                    a11y
                  </li>
                  <li>
                    <strong>Testing refs</strong> - Simulate DOM access in tests
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
                    <strong>Overusing refs</strong> - Makes code less
                    declarative
                  </li>
                  <li>
                    <strong>Not checking ref.current</strong> - Can cause
                    runtime errors
                  </li>
                  <li>
                    <strong>Mutating DOM directly</strong> - Can break React's
                    rendering
                  </li>
                  <li>
                    <strong>Memory leaks</strong> - Not cleaning up event
                    listeners
                  </li>
                  <li>
                    <strong>Forgetting to use forwardRef</strong> - Custom
                    components can't receive refs
                  </li>
                  <li>
                    <strong>Not using useImperativeHandle</strong> - Can't
                    expose custom methods
                  </li>
                  <li>
                    <strong>Refs in SSR</strong> - Not available on the server
                  </li>
                  <li>
                    <strong>Accessibility issues</strong> - Not managing focus
                    properly
                  </li>
                </ul>
              </div>
            </div>

            {/* Related Libraries & Patterns */}
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
                📚 Related Libraries & Patterns
              </h3>
              <div
                style={{
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                }}
              >
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>React Spring</strong> - Animation library using refs
                  </li>
                  <li>
                    <strong>React Transition Group</strong> - Animation and
                    transitions
                  </li>
                  <li>
                    <strong>React Portal</strong> - Render outside the root DOM
                  </li>
                  <li>
                    <strong>React Testing Library</strong> - Testing refs and
                    DOM
                  </li>
                  <li>
                    <strong>React DnD</strong> - Drag and drop with refs
                  </li>
                  <li>
                    <strong>Custom hooks</strong> - Encapsulate ref logic
                  </li>
                  <li>
                    <strong>Compound components</strong> - Advanced composition
                  </li>
                  <li>
                    <strong>Context API</strong> - Share refs across components
                  </li>
                </ul>
              </div>
            </div>

            {/* Refs & DOM Patterns & Best Practices */}
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
                🎨 Refs & DOM Patterns & Best Practices
              </h3>
              <div
                style={{
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                }}
              >
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>Use refs for imperative actions only</strong> -
                    Prefer declarative code
                  </li>
                  <li>
                    <strong>Encapsulate ref logic in hooks</strong> - Custom
                    hooks for reuse
                  </li>
                  <li>
                    <strong>Combine refs with context</strong> - Share refs
                    across components
                  </li>
                  <li>
                    <strong>Use forwardRef for custom components</strong> - Pass
                    refs down the tree
                  </li>
                  <li>
                    <strong>Clean up event listeners</strong> - Prevent memory
                    leaks
                  </li>
                  <li>
                    <strong>Type refs properly</strong> - Use TypeScript for
                    type safety
                  </li>
                  <li>
                    <strong>Test imperative logic</strong> - Simulate DOM access
                    in tests
                  </li>
                  <li>
                    <strong>Document custom imperative handles</strong> - Make
                    API clear for consumers
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
          Refs & DOM Examples
        </h3>
        <pre style={{ margin: 0 }}>
          {`// 1. Basic useRef
const MyComponent = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
};

// 2. forwardRef with useImperativeHandle
interface VideoPlayerRef {
  play: () => void;
  pause: () => void;
}

const VideoPlayer = forwardRef<VideoPlayerRef>((props, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useImperativeHandle(ref, () => ({
    play: () => videoRef.current?.play(),
    pause: () => videoRef.current?.pause()
  }));

  return <video ref={videoRef} />;
});

// 3. Canvas Drawing with Refs
const CanvasDrawing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 200;
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
  }, []);

  const draw = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={draw}
      style={{ border: '1px solid #ccc' }}
    />
  );
};

// 4. Auto-focus Input
const AutoFocusInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} type="text" />;
};

// 5. Element Measurement
const ElementMeasurement = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [measurements, setMeasurements] = useState({});

  const measureElement = () => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setMeasurements({
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left
      });
    }
  };

  useEffect(() => {
    measureElement();
  }, []);

  return (
    <div>
      <div ref={elementRef}>Measurable Element</div>
      <pre>{JSON.stringify(measurements, null, 2)}</pre>
    </div>
  );
};

// 6. Scroll to Element
const ScrollToElement = () => {
  const targetRef = useRef<HTMLDivElement>(null);

  const scrollToTarget = () => {
    targetRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  return (
    <div>
      <button onClick={scrollToTarget}>Scroll to Target</button>
      <div ref={targetRef}>Target Element</div>
    </div>
  );
};

// 7. Ref with Callback
const RefCallback = () => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref) {
      console.log('Element mounted:', ref);
    }
  }, [ref]);

  return <div ref={setRef}>Callback Ref</div>;
};

// 8. Multiple Refs
const MultipleRefs = () => {
  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);

  const focusNext = () => {
    if (document.activeElement === input1Ref.current) {
      input2Ref.current?.focus();
    } else {
      input1Ref.current?.focus();
    }
  };

  return (
    <div>
      <input ref={input1Ref} placeholder="Input 1" />
      <input ref={input2Ref} placeholder="Input 2" />
      <button onClick={focusNext}>Focus Next</button>
    </div>
  );
};

// 9. Ref with useCallback
const RefWithCallback = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus</button>
    </div>
  );
};

// 10. Ref for Animation
const AnimatedElement = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  const animate = () => {
    if (elementRef.current) {
      elementRef.current.style.transform = 'translateX(100px)';
      elementRef.current.style.transition = 'transform 0.5s ease';
    }
  };

  return (
    <div>
      <div
        ref={elementRef}
        style={{
          width: '50px',
          height: '50px',
          backgroundColor: '#3b82f6',
          transition: 'transform 0.5s ease'
        }}
      />
      <button onClick={animate}>Animate</button>
    </div>
  );
};

// 11. Ref for Third-party Library
const ThirdPartyIntegration = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Initialize third-party library
      // thirdPartyLib.init(containerRef.current);
    }
  }, []);

  return <div ref={containerRef} />;
};

// 12. Ref with Event Listeners
const RefWithEvents = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleClick = () => console.log('Clicked!');
    element.addEventListener('click', handleClick);

    return () => {
      element.removeEventListener('click', handleClick);
    };
  }, []);

  return <div ref={elementRef}>Click me</div>;
}`}
        </pre>
      </ResizableCodePanel>
    </div>
  );
};

export default RefsAndDOM;
