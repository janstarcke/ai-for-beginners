import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  isConfigured,
  loadGtag,
  updateConsent,
  pageview,
  clearGaCookies,
} from '@/lib/analytics';

const STORAGE_KEY = 'ai-for-beginners-consent-v1';
const CONSENT_VERSION = 1;

type Stored = { analytics: boolean; ts: number; version: number };

export type ConsentValue = {
  analytics: boolean | null; // null = undecided
  decided: boolean;
  bannerVisible: boolean;
  accept: () => void;
  decline: () => void;
  openSettings: () => void;
  closeSettings: () => void;
};

const ConsentContext = createContext<ConsentValue | null>(null);

function readStored(): Stored | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored;
    if (parsed.version !== CONSENT_VERSION) return null;
    if (typeof parsed.analytics !== 'boolean') return null;
    return parsed;
  } catch {
    return null;
  }
}

function persist(analytics: boolean): void {
  if (typeof window === 'undefined') return;
  const value: Stored = { analytics, ts: Date.now(), version: CONSENT_VERSION };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [analytics, setAnalytics] = useState<boolean | null>(null);
  const [bannerVisible, setBannerVisible] = useState(false);

  // Mount: restore prior decision + apply consent state.
  useEffect(() => {
    const stored = readStored();
    if (!stored) {
      setBannerVisible(isConfigured());
      return;
    }
    setAnalytics(stored.analytics);
    if (stored.analytics) {
      updateConsent(true);
      loadGtag();
      if (typeof window !== 'undefined') pageview(window.location.pathname);
    } else {
      updateConsent(false);
    }
  }, []);

  const accept = useCallback(() => {
    persist(true);
    setAnalytics(true);
    setBannerVisible(false);
    updateConsent(true);
    loadGtag();
    if (typeof window !== 'undefined') pageview(window.location.pathname);
  }, []);

  const decline = useCallback(() => {
    persist(false);
    setAnalytics(false);
    setBannerVisible(false);
    updateConsent(false);
    clearGaCookies();
  }, []);

  const openSettings = useCallback(() => setBannerVisible(true), []);
  const closeSettings = useCallback(() => setBannerVisible(false), []);

  const value: ConsentValue = {
    analytics,
    decided: analytics !== null,
    bannerVisible,
    accept,
    decline,
    openSettings,
    closeSettings,
  };

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent(): ConsentValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used within ConsentProvider');
  return ctx;
}
