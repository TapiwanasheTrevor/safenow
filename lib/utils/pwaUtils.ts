// PWA Utilities - Service Worker registration and PWA installation
// Handles PWA lifecycle, installation prompts, and offline detection

export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

class PWAUtils {
  private deferredPrompt: PWAInstallPrompt | null = null;
  private swRegistration: ServiceWorkerRegistration | null = null;
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private onlineCallbacks: Set<(online: boolean) => void> = new Set();

  constructor() {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      this.setupOnlineDetection();
      this.setupInstallPrompt();
    }
  }

  // Register service worker
  async registerServiceWorker(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      console.warn('[PWA] Service Worker not supported');
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      this.swRegistration = registration;

      console.log('[PWA] Service Worker registered:', registration.scope);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('[PWA] Service Worker update found');

        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              console.log('[PWA] New Service Worker installed, update available');
              // Notify user of update
              this.notifyUpdate();
            }
          });
        }
      });

      // Check for updates periodically (every hour)
      setInterval(
        () => {
          registration.update();
        },
        60 * 60 * 1000
      );

      return true;
    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error);
      return false;
    }
  }

  // Unregister service worker
  async unregisterServiceWorker(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      return false;
    }

    try {
      const registrations = await navigator.serviceWorker.getRegistrations();

      for (const registration of registrations) {
        await registration.unregister();
      }

      console.log('[PWA] Service Worker unregistered');
      return true;
    } catch (error) {
      console.error('[PWA] Failed to unregister Service Worker:', error);
      return false;
    }
  }

  // Get service worker registration
  getRegistration(): ServiceWorkerRegistration | null {
    return this.swRegistration;
  }

  // Setup beforeinstallprompt event listener
  private setupInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      // Prevent the mini-infobar from appearing
      e.preventDefault();

      // Store the event for later use
      this.deferredPrompt = e as unknown as PWAInstallPrompt;

      console.log('[PWA] Install prompt available');
    });

    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed');
      this.deferredPrompt = null;
    });
  }

  // Check if app can be installed
  canInstall(): boolean {
    return this.deferredPrompt !== null;
  }

  // Show install prompt
  async showInstallPrompt(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
    if (!this.deferredPrompt) {
      console.warn('[PWA] Install prompt not available');
      return 'unavailable';
    }

    try {
      // Show the install prompt
      await this.deferredPrompt.prompt();

      // Wait for user response
      const { outcome } = await this.deferredPrompt.userChoice;

      console.log(`[PWA] Install prompt ${outcome}`);

      // Clear the prompt
      this.deferredPrompt = null;

      return outcome;
    } catch (error) {
      console.error('[PWA] Install prompt failed:', error);
      return 'unavailable';
    }
  }

  // Check if app is installed
  isInstalled(): boolean {
    // Check if running in standalone mode
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    );
  }

  // Setup online/offline detection
  private setupOnlineDetection(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('[PWA] Online');
      this.notifyOnlineStatus(true);
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('[PWA] Offline');
      this.notifyOnlineStatus(false);
    });
  }

  // Subscribe to online status changes
  onOnlineStatusChange(callback: (online: boolean) => void): () => void {
    this.onlineCallbacks.add(callback);

    // Return unsubscribe function
    return () => {
      this.onlineCallbacks.delete(callback);
    };
  }

  // Notify online status
  private notifyOnlineStatus(online: boolean): void {
    this.onlineCallbacks.forEach((callback) => callback(online));
  }

  // Get online status
  getOnlineStatus(): boolean {
    return this.isOnline;
  }

  // Notify user of update
  private notifyUpdate(): void {
    // You can implement a toast/notification here
    console.log('[PWA] Update notification should be shown');
  }

  // Update service worker
  async updateServiceWorker(): Promise<void> {
    if (!this.swRegistration) {
      console.warn('[PWA] No service worker registration');
      return;
    }

    try {
      await this.swRegistration.update();
      console.log('[PWA] Service Worker update triggered');

      // Tell the new service worker to skip waiting
      if (this.swRegistration.waiting) {
        this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }

      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error('[PWA] Service Worker update failed:', error);
    }
  }

  // Clear all caches
  async clearCaches(): Promise<void> {
    if (!('caches' in window)) {
      console.warn('[PWA] Cache API not supported');
      return;
    }

    try {
      const cacheNames = await caches.keys();

      await Promise.all(cacheNames.map((name) => caches.delete(name)));

      console.log('[PWA] All caches cleared');

      // Notify service worker
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
      }
    } catch (error) {
      console.error('[PWA] Failed to clear caches:', error);
    }
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('[PWA] Notifications not supported');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      console.log('[PWA] Notification permission:', permission);
      return permission;
    } catch (error) {
      console.error('[PWA] Failed to request notification permission:', error);
      return 'denied';
    }
  }

  // Show notification
  async showNotification(
    title: string,
    options?: NotificationOptions
  ): Promise<void> {
    if (!('Notification' in window)) {
      console.warn('[PWA] Notifications not supported');
      return;
    }

    if (Notification.permission !== 'granted') {
      console.warn('[PWA] Notification permission not granted');
      return;
    }

    try {
      if (this.swRegistration) {
        await this.swRegistration.showNotification(title, {
          icon: '/icons/icon-192.png',
          badge: '/icons/badge-72.png',
          ...options,
        });
      } else {
        new Notification(title, {
          icon: '/icons/icon-192.png',
          ...options,
        });
      }
    } catch (error) {
      console.error('[PWA] Failed to show notification:', error);
    }
  }

  // Get cache storage estimate
  async getStorageEstimate(): Promise<{
    usage: number;
    quota: number;
    usagePercent: number;
  } | null> {
    if (!('storage' in navigator && 'estimate' in navigator.storage)) {
      console.warn('[PWA] Storage estimate not supported');
      return null;
    }

    try {
      const estimate = await navigator.storage.estimate();

      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
        usagePercent:
          estimate.quota && estimate.usage
            ? (estimate.usage / estimate.quota) * 100
            : 0,
      };
    } catch (error) {
      console.error('[PWA] Failed to get storage estimate:', error);
      return null;
    }
  }

  // Format bytes to human-readable format
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
}

// Export singleton instance
const pwaUtils = new PWAUtils();
export default pwaUtils;
