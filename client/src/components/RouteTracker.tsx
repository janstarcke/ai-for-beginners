import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { pageview } from '@/lib/analytics';

// Sends a GA4 page_view on every wouter route change. analytics.pageview()
// itself no-ops until consent has loaded gtag.js and dedupes identical paths.
export default function RouteTracker() {
  const [location] = useLocation();
  useEffect(() => {
    pageview(location);
  }, [location]);
  return null;
}
