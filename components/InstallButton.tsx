import React, { useEffect, useState } from 'react';

const InstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // @ts-ignore
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener);
  }, []);

  const onInstall = async () => {
    if (!deferredPrompt) return;
    try {
      // @ts-ignore
      deferredPrompt.prompt();
      // @ts-ignore
      const choice = await deferredPrompt.userChoice;
      // hide button after prompt
      setVisible(false);
      setDeferredPrompt(null);
    } catch (err) {
      setVisible(false);
      setDeferredPrompt(null);
    }
  };

  if (!visible) return null;

  return (
    <button
      onClick={onInstall}
      className="hidden sm:inline-block px-3 py-2 rounded-lg bg-white text-red-500 font-medium hover:bg-gray-50 transition"
      aria-label="Install app"
    >
      Install
    </button>
  );
};

export default InstallButton;
