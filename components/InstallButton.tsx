import React, { useEffect, useState } from 'react';

interface InstallButtonProps {
  label?: string;
  className?: string;
}

const InstallButton: React.FC<InstallButtonProps> = ({ label = 'Install', className = '' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Save the event for later and do not show browser default prompt
      // @ts-ignore
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const onAppInstalled = () => {
      setInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);
    window.addEventListener('appinstalled', onAppInstalled as EventListener);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener);
      window.removeEventListener('appinstalled', onAppInstalled as EventListener);
    };
  }, []);

  const isIosSafari = () => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    return /iphone|ipad|ipod/i.test(ua) && /safari/i.test(ua) && !/crios|fxios|opios/i.test(ua);
  };

  const onInstallClick = async () => {
    if (installed) return;

    if (deferredPrompt) {
      try {
        // @ts-ignore
        deferredPrompt.prompt();
        // @ts-ignore
        await deferredPrompt.userChoice;
        setDeferredPrompt(null);
      } catch (e) {
        // ignore
      }
      return;
    }

    // No beforeinstallprompt — show instructions modal tailored to platform
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  if (installed) return null;

  return (
    <>
      <button
        onClick={onInstallClick}
        className={`inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:opacity-95 ${className}`}
        aria-label={label}
      >
        {label}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Install QuickTransfer</h3>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {isIosSafari() ? (
                <>
                  Open Safari, tap <strong>Share</strong>, then select <strong>Add to Home Screen</strong>.
                </>
              ) : (
                <>
                  Open your browser menu and choose <strong>Install</strong> or <strong>Add to desktop</strong>.
                </>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallButton;
