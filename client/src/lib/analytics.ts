// GA4 wrapper. Loads gtag.js ONLY after explicit consent (see ConsentContext).
// No-op when VITE_GA_MEASUREMENT_ID is unset or the script isn't loaded yet.
// Mirrors the lazy/guarded pattern of client/src/lib/sentry.ts.

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as
  | string
  | undefined;

function hasWindow(): boolean {
  return typeof window !== 'undefined';
}

export function isConfigured(): boolean {
  return Boolean(MEASUREMENT_ID);
}

function gtag(...args: unknown[]): void {
  if (!hasWindow() || typeof window.gtag !== 'function') return;
  window.gtag(...args);
}

let _scriptLoaded = false;

export function loadGtag(): void {
  if (!hasWindow() || !MEASUREMENT_ID || _scriptLoaded) return;
  _scriptLoaded = true;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  s.setAttribute('data-ga', '1');
  document.head.appendChild(s);
  gtag('js', new Date());
  // send_page_view:false — RouteTracker owns page_view to avoid a double
  // initial hit. anonymize_ip:true — no plain-text IP storage.
  gtag('config', MEASUREMENT_ID, {
    anonymize_ip: true,
    send_page_view: false,
  });
}

export function updateConsent(granted: boolean): void {
  gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
  });
}

let _lastPath: string | null = null;

export function pageview(path: string): void {
  if (!MEASUREMENT_ID || !_scriptLoaded) return;
  if (path === _lastPath) return;
  _lastPath = path;
  gtag('event', 'page_view', {
    page_path: path,
    page_location: hasWindow() ? window.location.href : path,
  });
}

export function track(name: string, params: Record<string, unknown> = {}): void {
  if (!MEASUREMENT_ID || !_scriptLoaded) return;
  gtag('event', name, params);
}

export function clearGaCookies(): void {
  if (!hasWindow()) return;
  const host = location.hostname;
  // GA4 writes _ga at the registrable domain (e.g. ".starcke.io"), so we
  // must attempt deletion across the host AND each parent domain, with and
  // without the leading dot, plus a no-domain variant.
  const domains = new Set<string>(['', host, `.${host}`]);
  const parts = host.split('.');
  for (let i = 1; i < parts.length - 1; i++) {
    const parent = parts.slice(i).join('.');
    domains.add(parent);
    domains.add(`.${parent}`);
  }
  for (const part of document.cookie.split(';')) {
    const name = part.split('=')[0]?.trim();
    if (!name) continue;
    if (name === '_ga' || name.startsWith('_ga_')) {
      for (const d of domains) {
        const dom = d ? `; domain=${d}` : '';
        document.cookie = `${name}=; Max-Age=0; path=/${dom}`;
      }
    }
  }
}
