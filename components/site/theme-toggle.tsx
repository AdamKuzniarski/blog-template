'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

  root.classList.remove('light', 'dark');
  root.classList.add(resolvedTheme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'system';
    }

    const savedTheme = localStorage.getItem(STORAGE_KEY);
    return savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system'
      ? savedTheme
      : 'system';
  });

  useEffect(() => {
    applyTheme(theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const currentTheme = localStorage.getItem(STORAGE_KEY) ?? 'system';
      if (currentTheme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  function handleThemeChange(nextTheme: Theme) {
    localStorage.setItem(STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <div className="inline-flex rounded-full border border-border bg-surface p-1">
      <ThemeButton isActive={theme === 'light'} label="Hell" onClick={() => handleThemeChange('light')} />
      <ThemeButton isActive={theme === 'dark'} label="Dunkel" onClick={() => handleThemeChange('dark')} />
      <ThemeButton
        isActive={theme === 'system'}
        label="System"
        onClick={() => handleThemeChange('system')}
      />
    </div>
  );
}

type ThemeButtonProps = {
  isActive: boolean;
  label: string;
  onClick: () => void;
};

function ThemeButton({ isActive, label, onClick }: ThemeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-full px-3 py-1.5 text-sm transition-colors',
        isActive ? 'bg-text text-page' : 'text-muted hover:text-text',
      ].join(' ')}
    >
      {label}
    </button>
  );
}
