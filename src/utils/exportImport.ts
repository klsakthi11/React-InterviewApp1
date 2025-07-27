import { useCallback } from 'react';

// Data types for export/import
export interface ExportData {
  version: string;
  timestamp: string;
  progress: {
    completedSections: string[];
    timeSpent: Record<string, number>;
    lastVisited: string;
    totalTimeSpent: number;
    startedAt: string;
  };
  settings: {
    theme: string;
    notifications: boolean;
    autoSave: boolean;
  };
  notes: Record<string, string>;
  bookmarks: string[];
  customData?: Record<string, any>;
}

// Export utilities
export const exportUserData = (): ExportData => {
  const progress = localStorage.getItem('react-interview-progress');
  const theme = localStorage.getItem('react-interview-theme');
  const notes = localStorage.getItem('react-interview-notes');
  const bookmarks = localStorage.getItem('react-interview-bookmarks');

  const exportData: ExportData = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    progress: progress
      ? JSON.parse(progress)
      : {
          completedSections: [],
          timeSpent: {},
          lastVisited: '',
          totalTimeSpent: 0,
          startedAt: new Date().toISOString(),
        },
    settings: {
      theme: theme || 'light',
      notifications: true,
      autoSave: true,
    },
    notes: notes ? JSON.parse(notes) : {},
    bookmarks: bookmarks ? JSON.parse(bookmarks) : [],
  };

  return exportData;
};

export const exportToFile = (data: ExportData, filename?: string): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download =
    filename ||
    `react-interview-data-${new Date().toISOString().split('T')[0]}.json`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export const exportToClipboard = async (data: ExportData): Promise<boolean> => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await navigator.clipboard.writeText(jsonString);
    return true;
  } catch (error) {
    console.error('Failed to export to clipboard:', error);
    return false;
  }
};

// Import utilities
export const importFromFile = (file: File): Promise<ExportData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = event => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content) as ExportData;

        // Validate data structure
        if (!validateImportData(data)) {
          throw new Error('Invalid data format');
        }

        resolve(data);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};

export const importFromClipboard = async (): Promise<ExportData> => {
  try {
    const text = await navigator.clipboard.readText();
    const data = JSON.parse(text) as ExportData;

    if (!validateImportData(data)) {
      throw new Error('Invalid data format');
    }

    return data;
  } catch (error) {
    throw new Error('Failed to import from clipboard');
  }
};

export const importUserData = (data: ExportData): void => {
  // Import progress
  if (data.progress) {
    localStorage.setItem(
      'react-interview-progress',
      JSON.stringify(data.progress)
    );
  }

  // Import settings
  if (data.settings) {
    if (data.settings.theme) {
      localStorage.setItem('react-interview-theme', data.settings.theme);
    }
    localStorage.setItem(
      'react-interview-settings',
      JSON.stringify(data.settings)
    );
  }

  // Import notes
  if (data.notes) {
    localStorage.setItem('react-interview-notes', JSON.stringify(data.notes));
  }

  // Import bookmarks
  if (data.bookmarks) {
    localStorage.setItem(
      'react-interview-bookmarks',
      JSON.stringify(data.bookmarks)
    );
  }

  // Import custom data
  if (data.customData) {
    Object.entries(data.customData).forEach(([key, value]) => {
      localStorage.setItem(`react-interview-${key}`, JSON.stringify(value));
    });
  }
};

// Validation utilities
export const validateImportData = (data: any): data is ExportData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.version === 'string' &&
    typeof data.timestamp === 'string' &&
    typeof data.progress === 'object' &&
    typeof data.settings === 'object' &&
    typeof data.notes === 'object' &&
    Array.isArray(data.bookmarks)
  );
};

// React hooks for export/import
export const useExportImport = () => {
  const exportData = useCallback(() => {
    const data = exportUserData();
    return data;
  }, []);

  const exportToFileHandler = useCallback((filename?: string) => {
    const data = exportUserData();
    exportToFile(data, filename);
  }, []);

  const exportToClipboardHandler = useCallback(async () => {
    const data = exportUserData();
    return await exportToClipboard(data);
  }, []);

  const importFromFileHandler = useCallback(async (file: File) => {
    try {
      const data = await importFromFile(file);
      importUserData(data);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Import failed',
      };
    }
  }, []);

  const importFromClipboardHandler = useCallback(async () => {
    try {
      const data = await importFromClipboard();
      importUserData(data);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Import failed',
      };
    }
  }, []);

  return {
    exportData,
    exportToFile: exportToFileHandler,
    exportToClipboard: exportToClipboardHandler,
    importFromFile: importFromFileHandler,
    importFromClipboard: importFromClipboardHandler,
  };
};

// Notes management
export interface Note {
  id: string;
  section: string;
  content: string;
  timestamp: string;
  tags?: string[];
}

export const useNotes = () => {
  const getNotes = useCallback((): Record<string, Note[]> => {
    const notesData = localStorage.getItem('react-interview-notes');
    return notesData ? JSON.parse(notesData) : {};
  }, []);

  const addNote = useCallback(
    (section: string, content: string, tags?: string[]) => {
      const notes = getNotes();
      const newNote: Note = {
        id: Math.random().toString(36).substr(2, 9),
        section,
        content,
        timestamp: new Date().toISOString(),
        tags,
      };

      if (!notes[section]) {
        notes[section] = [];
      }
      notes[section].push(newNote);

      localStorage.setItem('react-interview-notes', JSON.stringify(notes));
      return newNote;
    },
    [getNotes]
  );

  const updateNote = useCallback(
    (section: string, noteId: string, content: string, tags?: string[]) => {
      const notes = getNotes();
      if (notes[section]) {
        const noteIndex = notes[section].findIndex(note => note.id === noteId);
        if (noteIndex !== -1) {
          notes[section][noteIndex] = {
            ...notes[section][noteIndex],
            content,
            tags,
            timestamp: new Date().toISOString(),
          };
          localStorage.setItem('react-interview-notes', JSON.stringify(notes));
          return notes[section][noteIndex];
        }
      }
      return null;
    },
    [getNotes]
  );

  const deleteNote = useCallback(
    (section: string, noteId: string) => {
      const notes = getNotes();
      if (notes[section]) {
        notes[section] = notes[section].filter(note => note.id !== noteId);
        localStorage.setItem('react-interview-notes', JSON.stringify(notes));
        return true;
      }
      return false;
    },
    [getNotes]
  );

  const getNotesBySection = useCallback(
    (section: string): Note[] => {
      const notes = getNotes();
      return notes[section] || [];
    },
    [getNotes]
  );

  return {
    getNotes,
    addNote,
    updateNote,
    deleteNote,
    getNotesBySection,
  };
};

// Bookmarks management
export const useBookmarks = () => {
  const getBookmarks = useCallback((): string[] => {
    const bookmarksData = localStorage.getItem('react-interview-bookmarks');
    return bookmarksData ? JSON.parse(bookmarksData) : [];
  }, []);

  const addBookmark = useCallback(
    (section: string) => {
      const bookmarks = getBookmarks();
      if (!bookmarks.includes(section)) {
        bookmarks.push(section);
        localStorage.setItem(
          'react-interview-bookmarks',
          JSON.stringify(bookmarks)
        );
      }
    },
    [getBookmarks]
  );

  const removeBookmark = useCallback(
    (section: string) => {
      const bookmarks = getBookmarks();
      const filteredBookmarks = bookmarks.filter(
        bookmark => bookmark !== section
      );
      localStorage.setItem(
        'react-interview-bookmarks',
        JSON.stringify(filteredBookmarks)
      );
    },
    [getBookmarks]
  );

  const isBookmarked = useCallback(
    (section: string): boolean => {
      const bookmarks = getBookmarks();
      return bookmarks.includes(section);
    },
    [getBookmarks]
  );

  return {
    getBookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
  };
};

// Data migration utilities
export const migrateData = (oldData: any): ExportData => {
  // Handle data version migrations
  const currentVersion = '1.0.0';

  if (!oldData.version || oldData.version !== currentVersion) {
    // Migrate old data format to new format
    return {
      version: currentVersion,
      timestamp: new Date().toISOString(),
      progress: oldData.progress || {
        completedSections: [],
        timeSpent: {},
        lastVisited: '',
        totalTimeSpent: 0,
        startedAt: new Date().toISOString(),
      },
      settings: oldData.settings || {
        theme: 'light',
        notifications: true,
        autoSave: true,
      },
      notes: oldData.notes || {},
      bookmarks: oldData.bookmarks || [],
    };
  }

  return oldData;
};

// Backup utilities
export const createBackup = (): ExportData => {
  const data = exportUserData();
  data.timestamp = new Date().toISOString();
  return data;
};

export const restoreBackup = (backup: ExportData): boolean => {
  try {
    importUserData(backup);
    return true;
  } catch (error) {
    console.error('Failed to restore backup:', error);
    return false;
  }
};
