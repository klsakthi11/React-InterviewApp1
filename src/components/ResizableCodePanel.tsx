import { useState, useRef, useEffect, useCallback } from 'react';

interface ResizableCodePanelProps {
  children: React.ReactNode;
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number;
}

const ResizableCodePanel = ({
  children,
  minWidth = 300,
  maxWidth = 800,
  defaultWidth = 400,
}: ResizableCodePanelProps) => {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const resizerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Throttled resize function using requestAnimationFrame
  const throttledResize = useCallback((newWidth: number) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      setWidth(newWidth);
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = e.clientX - startX;
      const newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, startWidth - deltaX)
      );
      throttledResize(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove, {
        passive: true,
      });
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.body.style.overflow = '';
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isResizing, startX, startWidth, minWidth, maxWidth, throttledResize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setStartX(e.clientX);
    setStartWidth(width);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Resizer handle */}
      <div
        ref={resizerRef}
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          left: '-6px',
          top: 0,
          bottom: 0,
          width: '12px',
          cursor: 'col-resize',
          backgroundColor: 'transparent',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'none',
        }}
      >
        <div
          style={{
            width: '3px',
            height: '50px',
            backgroundColor: isResizing ? '#3b82f6' : '#e5e7eb',
            borderRadius: '2px',
            transition: isResizing ? 'none' : 'all 0.2s ease',
            transform: isResizing ? 'scaleX(1.5)' : 'scaleX(1)',
            boxShadow: isResizing ? '0 0 8px rgba(59, 130, 246, 0.3)' : 'none',
          }}
          onMouseEnter={e => {
            if (!isResizing) {
              e.currentTarget.style.backgroundColor = '#3b82f6';
              e.currentTarget.style.transform = 'scaleX(1.2)';
            }
          }}
          onMouseLeave={e => {
            if (!isResizing) {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
              e.currentTarget.style.transform = 'scaleX(1)';
            }
          }}
        />
      </div>

      {/* Code panel */}
      <div
        style={{
          width: `${width}px`,
          background: '#1e1e1e',
          color: '#d4d4d4',
          padding: '2rem',
          marginRight: '2rem',
          overflowY: 'auto',
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          fontSize: '14px',
          lineHeight: '1.5',
          userSelect: isResizing ? 'none' : 'auto',
          transition: isResizing
            ? 'none'
            : 'width 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: isResizing ? 'width' : 'auto',
          transform: isResizing ? 'translateZ(0)' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ResizableCodePanel;
