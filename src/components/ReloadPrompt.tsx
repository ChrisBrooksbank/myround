// ReloadPrompt component for PWA update notifications

import { useEffect, useState } from 'react';

export function ReloadPrompt() {
  const [offlineReady, setOfflineReady] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [updateSW, setUpdateSW] = useState<((reloadPage?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    // Import and register service worker
    const registerSW = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const { registerSW } = await import('virtual:pwa-register');

          const sw = registerSW({
            immediate: true,
            onRegistered(registration) {
              console.log('SW Registered:', registration);
            },
            onRegisterError(error) {
              console.error('SW registration error:', error);
            },
            onOfflineReady() {
              setOfflineReady(true);
            },
            onNeedRefresh() {
              setNeedRefresh(true);
            },
          });

          setUpdateSW(() => sw);
        } catch (error) {
          console.error('Failed to register service worker:', error);
        }
      }
    };

    registerSW();
  }, []);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const reload = () => {
    if (updateSW) {
      updateSW(true);
    }
  };

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div className="reload-prompt">
      <div className="reload-prompt-content">
        {offlineReady && (
          <p>App ready to work offline</p>
        )}
        {needRefresh && (
          <>
            <p>New version available!</p>
            <button onClick={reload} className="reload-button">
              Update
            </button>
          </>
        )}
        <button onClick={close} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
}
