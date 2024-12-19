// app/page.tsx
"use client";

import { useEffect, useState } from "react";

function Home() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any | null>(null);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  useEffect(() => {
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const beforeInstallPromptHandler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        beforeInstallPromptHandler
      );
    };
  }, []);

  return (
    <div>
      <h1>Welcome to Next.js PWA</h1>
      {!isStandalone && (
        <p>Add this app to your home screen for the best experience.</p>
      )}
      {showInstallPrompt && (
        <button onClick={handleInstallClick}>Install App</button>
      )}
    </div>
  );
}

export default Home;
