import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newNotification = { ...notification, id };

      setNotifications(prev => [...prev, newNotification]);

      // Auto-remove notification after duration
      if (notification.duration !== 0) {
        setTimeout(() => {
          removeNotification(id);
        }, notification.duration || 5000);
      }
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAll,
      }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
};

// Notification Container Component
const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getNotificationStyles = (type: NotificationType) => {
    const baseStyles = {
      background: 'white',
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '0.75rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      maxWidth: '400px',
      animation: 'slideInRight 0.3s ease-out',
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyles,
          borderLeft: '4px solid var(--success-color)',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        };
      case 'error':
        return {
          ...baseStyles,
          borderLeft: '4px solid var(--error-color)',
          background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
        };
      case 'warning':
        return {
          ...baseStyles,
          borderLeft: '4px solid var(--warning-color)',
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
        };
      case 'info':
        return {
          ...baseStyles,
          borderLeft: '4px solid var(--info-color)',
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        };
      default:
        return baseStyles;
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      {notifications.map(notification => (
        <div
          key={notification.id}
          style={getNotificationStyles(notification.type)}
          className="notification-slide"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
            }}
          >
            <div
              style={{
                fontSize: '1.25rem',
                flexShrink: 0,
                marginTop: '0.125rem',
              }}
            >
              {getNotificationIcon(notification.type)}
            </div>

            <div style={{ flex: 1 }}>
              <h4
                style={{
                  margin: '0 0 0.25rem 0',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                }}
              >
                {notification.title}
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.4',
                }}
              >
                {notification.message}
              </p>

              {notification.action && (
                <button
                  onClick={notification.action.onClick}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.625rem',
                    cursor: 'pointer',
                    marginTop: '0.5rem',
                    color: 'var(--text-secondary)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {notification.action.label}
                </button>
              )}
            </div>

            <button
              onClick={() => removeNotification(notification.id)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                color: 'var(--text-secondary)',
                padding: '0.25rem',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Hook for easy notification creation
export const useNotificationHelpers = () => {
  const { addNotification } = useNotifications();

  const showSuccess = useCallback(
    (title: string, message: string, options?: Partial<Notification>) => {
      addNotification({
        type: 'success',
        title,
        message,
        ...options,
      });
    },
    [addNotification]
  );

  const showError = useCallback(
    (title: string, message: string, options?: Partial<Notification>) => {
      addNotification({
        type: 'error',
        title,
        message,
        ...options,
      });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (title: string, message: string, options?: Partial<Notification>) => {
      addNotification({
        type: 'warning',
        title,
        message,
        ...options,
      });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (title: string, message: string, options?: Partial<Notification>) => {
      addNotification({
        type: 'info',
        title,
        message,
        ...options,
      });
    },
    [addNotification]
  );

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default NotificationProvider;
