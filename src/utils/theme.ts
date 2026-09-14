// Theme management for Saúde em Prática
export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'saude_em_pratica_theme';

export function getInitialTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
  } catch (e) {
    // Ignore storage errors
  }
  return 'light';
}

export function applyTheme(theme: ThemeMode): void {
  try {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      document.body?.classList.add('dark');
      document.body?.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      document.body?.classList.remove('dark');
      document.body?.classList.add('light');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {
    // Ignore
  }
}
