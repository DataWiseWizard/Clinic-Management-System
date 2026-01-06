import { useState, useEffect } from "react";

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      EnableNetwork(db);
    }
    const handleOffline = () => {
      setIsOnline(false);
      DisableNetwork(db);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="bg-red-600 text-white text-center py-2 text-sm font-bold sticky top-0 z-50 shadow-md animate-pulse">
      ⚠️ You are currently OFFLINE. Changes will save automatically when connection returns.
    </div>
  );
}