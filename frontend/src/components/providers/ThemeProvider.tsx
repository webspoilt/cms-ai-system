'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getFromStorage, setToStorage } from '@/utils';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('dark');

  // Initialize theme from storage
  useEffect(() => {
    const storedTheme = getFromStorage<Theme>('theme', 'system');
    setThemeState(storedTheme);
  }, []);

  // Update actual theme based on system preference or user choice
  useEffect(() => {
    const updateActualTheme = () => {
      let newActualTheme: 'light' | 'dark';
      
      if (theme === 'system') {
        newActualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        newActualTheme = theme;
      }

      setActualTheme(newActualTheme);
      applyTheme(newActualTheme);
    };

    updateActualTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateActualTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    setToStorage('theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = actualTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    actualTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

function applyTheme(theme: 'light' | 'dark') {
  const root = document.documentElement;
  
  // Remove all theme classes
  root.classList.remove('light', 'dark');
  
  // Add the new theme class
  root.classList.add(theme);
  
  // Update CSS custom properties for theme colors
  if (theme === 'dark') {
    root.style.setProperty('--color-bg-primary', '#0A0A0A');
    root.style.setProperty('--color-bg-secondary', '#141414');
    root.style.setProperty('--color-text-primary', '#E4E4E7');
    root.style.setProperty('--color-text-secondary', '#A1A1AA');
    root.style.setProperty('--color-border', '#1E1E1E');
  } else {
    root.style.setProperty('--color-bg-primary', '#ffffff');
    root.style.setProperty('--color-bg-secondary', '#f9fafb');
    root.style.setProperty('--color-text-primary', '#111827');
    root.style.setProperty('--color-text-secondary', '#6b7280');
    root.style.setProperty('--color-border', '#d1d5db');
  }
}