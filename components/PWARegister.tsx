'use client';

// PWA Register Component - Handles service worker registration and PWA lifecycle
// Must be a client component to use browser APIs

import { useEffect, useState } from 'react';
import pwaUtils from '@/lib/utils/pwaUtils';

export default function PWARegister() {
  const [isOnline, setIsOnline] = useState(true);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Register service worker
    if (typeof window !== 'undefined') {
      pwaUtils.registerServiceWorker().then((registered) => {
        if (registered) {
          console.log('[PWA] Service Worker registered successfully');
        }
      });

      // Subscribe to online status
      const unsubscribe = pwaUtils.onOnlineStatusChange((online) => {
        setIsOnline(online);
      });

      // Set initial online status
      setIsOnline(pwaUtils.getOnlineStatus());

      // Check if can install
      setCanInstall(pwaUtils.canInstall());

      // Listen for install prompt changes
      const checkInstall = setInterval(() => {
        setCanInstall(pwaUtils.canInstall());
      }, 1000);

      return () => {
        unsubscribe();
        clearInterval(checkInstall);
      };
    }
  }, []);

  // Show offline indicator if needed
  if (!isOnline) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-white px-4 py-2 text-center text-sm font-medium z-50">
        ⚠️ You are offline - Some features may be limited
      </div>
    );
  }

  return null;
}
