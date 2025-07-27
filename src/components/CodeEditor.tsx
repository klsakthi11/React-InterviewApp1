import { useState, useEffect, useRef } from 'react';

interface CodeEditorProps {
  code: string;
  language?: string;
  onChange?: (code: string) => void;
  readOnly?: boolean;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  theme?: 'light' | 'dark';
  height?: string;
  placeholder?: string;
}

const CodeEditor = ({
  code,
  language = 'javascript',
  onChange,
  readOnly = false,
  showLineNumbers = true,
  showCopyButton = true,
  theme = 'dark',
  height = '300px',
  placeholder = 'Enter your code here...',
}: CodeEditorProps) => {
  const [internalCode, setInternalCode] = useState(code);
  const [copied, setCopied] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInternalCode(code);
  }, [code]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setInternalCode(newCode);
    if (onChange) {
      onChange(newCode);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;

    // Handle Tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      const newValue =
        value.substring(0, selectionStart) +
        '  ' +
        value.substring(selectionEnd);
      setInternalCode(newValue);
      if (onChange) onChange(newValue);

      // Set cursor position after tab
      setTimeout(() => {
        textarea.setSelectionRange(selectionStart + 2, selectionStart + 2);
      }, 0);
    }

    // Handle Enter key with auto-indentation
    if (e.key === 'Enter') {
      const currentLine =
        value.substring(0, selectionStart).split('\n').pop() || '';
      const indentMatch = currentLine.match(/^(\s*)/);
      const currentIndent = indentMatch ? indentMatch[1] : '';

      // Check if we should increase indentation
      const shouldIncreaseIndent =
        /{\s*$/.test(currentLine) ||
        /:\s*$/.test(currentLine) ||
        /=>\s*$/.test(currentLine);

      const newIndent = shouldIncreaseIndent
        ? currentIndent + '  '
        : currentIndent;

      setTimeout(() => {
        const newValue =
          value.substring(0, selectionStart) +
          '\n' +
          newIndent +
          value.substring(selectionEnd);
        setInternalCode(newValue);
        if (onChange) onChange(newValue);

        const newCursorPos = selectionStart + 1 + newIndent.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(internalCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const getLineNumbers = () => {
    const lines = internalCode.split('\n');
    return lines.map((_, index) => index + 1).join('\n');
  };

  const getSyntaxHighlightedCode = () => {
    // Simple syntax highlighting for common patterns
    let highlighted = internalCode
      // Keywords
      .replace(
        /\b(const|let|var|function|return|if|else|for|while|switch|case|default|break|continue|try|catch|finally|throw|class|extends|super|import|export|from|as|default|null|undefined|true|false|new|this|typeof|instanceof|delete|void|in|of|with|debugger|enum|interface|type|namespace|module|declare|abstract|static|readonly|public|private|protected|async|await|yield|generator|get|set)\b/g,
        '<span style="color: #ff6b6b; font-weight: 600;">$1</span>'
      )
      // Strings
      .replace(
        /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g,
        '<span style="color: #51cf66;">$1$2$1</span>'
      )
      // Numbers
      .replace(
        /\b(\d+(?:\.\d+)?)\b/g,
        '<span style="color: #339af0;">$1</span>'
      )
      // Comments
      .replace(
        /(\/\/.*$)/gm,
        '<span style="color: #868e96; font-style: italic;">$1</span>'
      )
      .replace(
        /(\/\*[\s\S]*?\*\/)/g,
        '<span style="color: #868e96; font-style: italic;">$1</span>'
      )
      // Template literals
      .replace(
        /\$\{([^}]+)\}/g,
        '<span style="color: #ffd43b;">${<span style="color: #339af0;">$1</span>}</span>'
      )
      // JSX tags
      .replace(
        /(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)([^&]*?)(\/?&gt;)/g,
        '<span style="color: #e64980;">$1$2$3$4</span>'
      );

    return highlighted;
  };

  const themes = {
    light: {
      background: '#f8f9fa',
      color: '#212529',
      border: '#dee2e6',
      selection: '#e3f2fd',
    },
    dark: {
      background: '#1e293b',
      color: '#e2e8f0',
      border: '#334155',
      selection: '#3b82f6',
    },
  };

  const currentTheme = themes[theme];

  return (
    <div
      style={{
        position: 'relative',
        border: `1px solid ${currentTheme.border}`,
        borderRadius: '8px',
        overflow: 'hidden',
        background: currentTheme.background,
      }}
    >
      {/* Editor Header */}
      <div
        style={{
          background: currentTheme.border,
          padding: '0.5rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: currentTheme.color,
        }}
      >
        <span style={{ fontWeight: '600' }}>{language.toUpperCase()}</span>
        {showCopyButton && (
          <button
            onClick={handleCopy}
            style={{
              background: 'transparent',
              border: 'none',
              color: currentTheme.color,
              cursor: 'pointer',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>
        )}
      </div>

      {/* Editor Content */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          height,
        }}
      >
        {/* Line Numbers */}
        {showLineNumbers && (
          <div
            ref={lineNumbersRef}
            style={{
              background: currentTheme.background,
              color: currentTheme.color,
              padding: '1rem 0.5rem 1rem 1rem',
              borderRight: `1px solid ${currentTheme.border}`,
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              lineHeight: '1.5',
              whiteSpace: 'pre',
              userSelect: 'none',
              minWidth: '3rem',
              textAlign: 'right',
              opacity: 0.7,
            }}
          >
            {getLineNumbers()}
          </div>
        )}

        {/* Code Area */}
        <div
          style={{
            flex: 1,
            position: 'relative',
          }}
        >
          {/* Syntax Highlighted Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              padding: '1rem',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              pointerEvents: 'none',
              color: 'transparent',
              overflow: 'hidden',
            }}
            dangerouslySetInnerHTML={{ __html: getSyntaxHighlightedCode() }}
          />

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={internalCode}
            onChange={handleCodeChange}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            placeholder={placeholder}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              padding: '1rem',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              lineHeight: '1.5',
              color: currentTheme.color,
              resize: 'none',
              caretColor: currentTheme.color,
            }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      </div>

      {/* Status Bar */}
      <div
        style={{
          background: currentTheme.border,
          padding: '0.25rem 1rem',
          fontSize: '0.75rem',
          color: currentTheme.color,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>
          Line {cursorPosition.line}, Column {cursorPosition.column}
        </span>
        <span>{internalCode.length} characters</span>
      </div>
    </div>
  );
};

export default CodeEditor;
