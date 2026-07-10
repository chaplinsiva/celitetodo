'use client';

import { useEffect, useState } from 'react';
import { Download, X, Share } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already running as PWA
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    setIsStandalone(standalone);

    // Detect iOS
    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.error('SW registration failed:', err);
        });
    }

    // Listen for the install prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show the banner after a brief delay
      if (!standalone) {
        setTimeout(() => setShowBanner(true), 2000);
      }
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Show iOS install hint if not standalone
    if (ios && !standalone) {
      const dismissed = localStorage.getItem('pwa-ios-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowBanner(true), 3000);
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function handleInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    }
  }

  function handleDismiss() {
    setShowBanner(false);
    if (isIOS) {
      localStorage.setItem('pwa-ios-dismissed', 'true');
    }
  }

  // Don't show if already installed
  if (isStandalone || !showBanner) return null;

  return (
    <div className="fixed bottom-[75px] left-0 right-0 z-[9999] bg-surface-panel/95 backdrop-blur-3xl border-t border-border-hairline p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] flex items-center justify-between gap-4 animate-slide-up">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-blue/80 flex items-center justify-center flex-shrink-0 text-white">
          <Download size={20} />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <strong className="font-heading text-xs font-semibold text-white">Install Celite Manager</strong>
          {isIOS ? (
            <span className="text-[0.7rem] text-text-secondary truncate">
              Tap <Share size={14} className="inline-block mx-0.5 align-middle" /> then &quot;Add to Home Screen&quot;
            </span>
          ) : (
            <span className="text-[0.7rem] text-text-secondary truncate">Add to your home screen for offline access</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {!isIOS && (
          <button
            className="bg-accent-blue text-white border-none rounded-full px-4 py-1.5 font-heading text-xs font-semibold cursor-pointer transition-all hover:bg-accent-blue-hover active:scale-96"
            onClick={handleInstall}
          >
            Install
          </button>
        )}
        <button
          className="bg-transparent border-none text-text-secondary cursor-pointer p-1 flex items-center justify-center transition-colors hover:text-white"
          onClick={handleDismiss}
          aria-label="Dismiss install prompt"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
