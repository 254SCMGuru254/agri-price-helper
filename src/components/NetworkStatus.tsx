
import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";

export const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return (
      <div className="flex items-center text-green-600">
        <Wifi className="h-4 w-4 mr-1" />
        <span className="text-xs">Online</span>
      </div>
    );
  }

  return (
    <div className="flex items-center text-yellow-600">
      <WifiOff className="h-4 w-4 mr-1" />
      <span className="text-xs">Offline</span>
    </div>
  );
};
