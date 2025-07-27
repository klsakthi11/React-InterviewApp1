import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  ThemeProvider,
  ThemeToggle,
  useTheme,
} from '../../components/ThemeProvider';

// Test component to access theme context
const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button data-testid="toggle-theme" onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('should render children', () => {
    render(
      <ThemeProvider>
        <div data-testid="test-child">Test Content</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('should default to light theme when no preference is stored', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  it('should load saved theme from localStorage', () => {
    localStorage.setItem('react-interview-theme', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  it('should toggle theme when toggleTheme is called', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-theme');
    const themeDisplay = screen.getByTestId('current-theme');

    expect(themeDisplay).toHaveTextContent('light');

    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(themeDisplay).toHaveTextContent('dark');
    });

    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(themeDisplay).toHaveTextContent('high-contrast');
    });

    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(themeDisplay).toHaveTextContent('light');
    });
  });

  it('should save theme to localStorage when changed', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-theme');
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'react-interview-theme',
        'dark'
      );
    });
  });

  it('should apply theme classes to body', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-theme');
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(document.body).toHaveClass('theme-dark');
    });
  });
});

describe('ThemeToggle', () => {
  it('should render theme toggle button', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should show correct theme icon', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('☀️'); // Light theme icon
  });

  it('should change icon when theme changes', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toHaveTextContent('🌙'); // Dark theme icon
    });
  });

  it('should have correct title attribute', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Switch to dark theme');
  });
});
