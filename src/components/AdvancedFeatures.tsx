import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from './NotificationSystem';

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Voice Commands Component
export const VoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = event => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          setTranscript(finalTranscript + interimTranscript);

          // Process commands
          if (finalTranscript) {
            processVoiceCommand(finalTranscript.toLowerCase());
          }
        };

        recognitionRef.current.onerror = event => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          addNotification({
            type: 'error',
            title: 'Voice Command Error',
            message: `Error: ${event.error}`,
          });
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, [addNotification]);

  const processVoiceCommand = useCallback(
    (command: string) => {
      const commands = {
        'go home': () => navigate('/component-lifecycle'),
        'go to hooks': () => navigate('/hooks'),
        'go to state': () => navigate('/state-management'),
        'go to forms': () => navigate('/forms'),
        'go to context': () => navigate('/context-api'),
        search: () => {
          const searchInput = document.querySelector(
            'input[placeholder*="Search"]'
          ) as HTMLInputElement;
          if (searchInput) searchInput.focus();
        },
        'toggle theme': () => {
          const themeToggle = document.querySelector(
            '[title*="theme"]'
          ) as HTMLButtonElement;
          if (themeToggle) themeToggle.click();
        },
        'show shortcuts': () => {
          const event = new CustomEvent('toggle-shortcuts');
          window.dispatchEvent(event);
        },
        'stop listening': () => stopListening(),
      };

      for (const [key, action] of Object.entries(commands)) {
        if (command.includes(key)) {
          action();
          addNotification({
            type: 'info',
            title: 'Voice Command',
            message: `Executed: ${key}`,
          });
          break;
        }
      }
    },
    [navigate, addNotification]
  );

  const startListening = () => {
    if (recognitionRef.current && isSupported) {
      recognitionRef.current.start();
      setIsListening(true);
      addNotification({
        type: 'info',
        title: 'Voice Commands',
        message: 'Listening for voice commands...',
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscript('');
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000,
      }}
    >
      <button
        onClick={isListening ? stopListening : startListening}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: 'none',
          background: isListening
            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
            : 'linear-gradient(135deg, #3b82f6, #2563eb)',
          color: 'white',
          fontSize: '1.5rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title={isListening ? 'Stop Voice Commands' : 'Start Voice Commands'}
      >
        {isListening ? '🎤' : '🎙️'}
      </button>

      {isListening && (
        <div
          style={{
            position: 'absolute',
            bottom: '70px',
            right: '0',
            background: 'white',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            minWidth: '200px',
            border: '1px solid var(--border-color)',
          }}
        >
          <div
            style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
            }}
          >
            Listening...
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {transcript || 'Say a command...'}
          </div>
        </div>
      )}
    </div>
  );
};

// Accessibility Enhancement Component
export const AccessibilityEnhancer = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [focusIndicator, setFocusIndicator] = useState(true);

  useEffect(() => {
    // Apply accessibility settings
    document.documentElement.style.setProperty(
      '--high-contrast',
      highContrast ? '1' : '0'
    );

    document.documentElement.style.setProperty(
      '--large-text',
      largeText ? '1.2' : '1'
    );

    document.documentElement.style.setProperty(
      '--reduced-motion',
      reducedMotion ? '1' : '0'
    );

    document.documentElement.style.setProperty(
      '--focus-indicator',
      focusIndicator ? '1' : '0'
    );
  }, [highContrast, largeText, reducedMotion, focusIndicator]);

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        background: 'white',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: '1px solid var(--border-color)',
        zIndex: 1000,
        minWidth: '200px',
      }}
    >
      <h4
        style={{
          margin: '0 0 1rem 0',
          fontSize: '0.875rem',
          fontWeight: '600',
        }}
      >
        ♿ Accessibility
      </h4>

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.75rem',
          }}
        >
          <input
            type="checkbox"
            checked={highContrast}
            onChange={e => setHighContrast(e.target.checked)}
          />
          High Contrast
        </label>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.75rem',
          }}
        >
          <input
            type="checkbox"
            checked={largeText}
            onChange={e => setLargeText(e.target.checked)}
          />
          Large Text
        </label>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.75rem',
          }}
        >
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={e => setReducedMotion(e.target.checked)}
          />
          Reduced Motion
        </label>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.75rem',
          }}
        >
          <input
            type="checkbox"
            checked={focusIndicator}
            onChange={e => setFocusIndicator(e.target.checked)}
          />
          Focus Indicator
        </label>
      </div>
    </div>
  );
};

// Gesture Recognition Component
export const GestureRecognition = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startGestureRecognition = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setIsEnabled(true);
    } catch (error) {
      console.error('Failed to start gesture recognition:', error);
    }
  };

  const stopGestureRecognition = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsEnabled(false);
  };

  useEffect(() => {
    return () => {
      stopGestureRecognition();
    };
  }, []);

  if (!isEnabled) {
    return (
      <button
        onClick={startGestureRecognition}
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '2rem',
          padding: '0.75rem 1rem',
          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '600',
          zIndex: 1000,
        }}
      >
        🖐️ Enable Gestures
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '2rem',
        background: 'white',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: '1px solid var(--border-color)',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '600',
        }}
      >
        Gesture Recognition
      </div>
      <video
        ref={videoRef}
        style={{
          width: '200px',
          height: '150px',
          borderRadius: '4px',
          marginBottom: '0.5rem',
        }}
        muted
      />
      <canvas
        ref={canvasRef}
        style={{
          width: '200px',
          height: '150px',
          borderRadius: '4px',
          border: '1px solid var(--border-color)',
        }}
      />
      <button
        onClick={stopGestureRecognition}
        style={{
          width: '100%',
          padding: '0.5rem',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.75rem',
          marginTop: '0.5rem',
        }}
      >
        Stop
      </button>
    </div>
  );
};

// Advanced Interactions Component
export const AdvancedInteractions = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { addNotification } = useNotifications();

  const handleMouseGesture = useCallback(
    (event: MouseEvent) => {
      // Simple mouse gesture detection
      const gesture = detectMouseGesture(event);
      if (gesture) {
        addNotification({
          type: 'info',
          title: 'Mouse Gesture',
          message: `Detected: ${gesture}`,
        });
      }
    },
    [addNotification]
  );

  const detectMouseGesture = (_event: MouseEvent): string | null => {
    // This is a simplified gesture detection
    // In a real implementation, you'd track mouse movement patterns
    return null;
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('mousemove', handleMouseGesture);
      return () => {
        document.removeEventListener('mousemove', handleMouseGesture);
      };
    }
  }, [isVisible, handleMouseGesture]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '0.75rem 1rem',
          background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '600',
          zIndex: 1000,
        }}
      >
        🚀 Advanced Features
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        border: '1px solid var(--border-color)',
        zIndex: 1000,
        minWidth: '300px',
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
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
          🚀 Advanced Features
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        <VoiceCommands />
        <AccessibilityEnhancer />
        <GestureRecognition />
      </div>
    </div>
  );
};

const AdvancedFeatures = () => {
  return (
    <div>
      <AdvancedInteractions />
    </div>
  );
};

export default AdvancedFeatures;
