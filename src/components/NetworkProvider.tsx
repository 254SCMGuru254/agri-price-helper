
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface NetworkContextType {
  isOnline: boolean;
  connectionType: string;
  lastSyncTime: Date | null;
  syncPendingData: () => Promise<void>;
}

const NetworkContext = createContext<NetworkContextType>({
  isOnline: true,
  connectionType: 'unknown',
  lastSyncTime: null,
  syncPendingData: async () => {},
});

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState('unknown');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Connection restored",
        description: "You're back online. Syncing data...",
      });
      syncPendingData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Connection lost",
        description: "You're offline. Data will be saved locally.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Enhanced connection type detection
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        setConnectionType(connection.effectiveType || 'unknown');
        
        const updateConnection = () => {
          setConnectionType(connection.effectiveType || 'unknown');
        };
        
        connection.addEventListener('change', updateConnection);
        
        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
          connection.removeEventListener('change', updateConnection);
        };
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const syncPendingData = async () => {
    try {
      // Sync offline market prices
      const offlinePrices = JSON.parse(localStorage.getItem('offline_prices') || '[]');
      if (offlinePrices.length > 0) {
        console.log('Syncing offline prices:', offlinePrices);
        localStorage.removeItem('offline_prices');
        setLastSyncTime(new Date());
      }
      
      // Sync other offline data
      const offlineMessages = JSON.parse(localStorage.getItem('offline_messages') || '[]');
      if (offlineMessages.length > 0) {
        console.log('Syncing offline messages:', offlineMessages);
        localStorage.removeItem('offline_messages');
      }
    } catch (error) {
      console.error('Error syncing offline data:', error);
      toast({
        title: "Sync failed",
        description: "Failed to sync offline data. Will retry later.",
        variant: "destructive",
      });
    }
  };

  return (
    <NetworkContext.Provider value={{ 
      isOnline, 
      connectionType, 
      lastSyncTime, 
      syncPendingData 
    }}>
      {children}
    </NetworkContext.Provider>
  );
};
