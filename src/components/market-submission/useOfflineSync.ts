import { useState, useEffect } from 'react';
import { useOnlineStatus } from './useOnlineStatus';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface CachedData {
  id: string;
  type: 'price' | 'message' | 'analytics';
  data: any;
  timestamp: number;
  retryCount: number;
}

export const useOfflineSync = () => {
  const { toast } = useToast();
  const isOnline = useOnlineStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [pendingItems, setPendingItems] = useState<CachedData[]>([]);

  // Load pending items from IndexedDB
  useEffect(() => {
    const loadPendingItems = async () => {
      try {
        const db = await openDatabase();
        const items = await db.getAll('pendingSync');
        setPendingItems(items);
      } catch (error) {
        console.error('Failed to load pending items:', error);
      }
    };

    loadPendingItems();
  }, []);

  // Sync when online
  useEffect(() => {
    if (isOnline && pendingItems.length > 0) {
      syncPendingItems();
    }
  }, [isOnline, pendingItems]);

  // IndexedDB setup
  const openDatabase = async () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('AgriPriceOfflineDB', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('pendingSync')) {
          db.createObjectStore('pendingSync', { keyPath: 'id' });
        }
      };
    });
  };

  // Add item to sync queue
  const addToSyncQueue = async (type: CachedData['type'], data: any) => {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(['pendingSync'], 'readwrite');
      const store = transaction.objectStore('pendingSync');

      const item: CachedData = {
        id: crypto.randomUUID(),
        type,
        data,
        timestamp: Date.now(),
        retryCount: 0
      };

      await store.add(item);
      setPendingItems(prev => [...prev, item]);

      toast({
        title: 'Saved for sync',
        description: 'Your data will be synced when you\'re back online',
      });
    } catch (error) {
      console.error('Failed to add item to sync queue:', error);
      toast({
        title: 'Sync Error',
        description: 'Failed to save data for syncing',
        variant: 'destructive',
      });
    }
  };

  // Remove item from sync queue
  const removeFromSyncQueue = async (id: string) => {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(['pendingSync'], 'readwrite');
      const store = transaction.objectStore('pendingSync');
      
      await store.delete(id);
      setPendingItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to remove item from sync queue:', error);
    }
  };

  // Sync pending items
  const syncPendingItems = async () => {
    if (isSyncing || pendingItems.length === 0) return;

    setIsSyncing(true);
    let progress = 0;

    try {
      for (const item of pendingItems) {
        try {
          switch (item.type) {
            case 'price':
              await supabase.from('market_prices').insert(item.data);
              break;
            case 'message':
              await supabase.from('messages').insert(item.data);
              break;
            case 'analytics':
              await supabase.from('analytics_data').insert(item.data);
              break;
          }

          await removeFromSyncQueue(item.id);
          progress += 1;
          setSyncProgress((progress / pendingItems.length) * 100);
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          
          // Update retry count
          const updatedItem = {
            ...item,
            retryCount: item.retryCount + 1
          };

          if (updatedItem.retryCount < 3) {
            // Keep in queue for retry
            const db = await openDatabase();
            const transaction = db.transaction(['pendingSync'], 'readwrite');
            const store = transaction.objectStore('pendingSync');
            await store.put(updatedItem);
          } else {
            // Remove after 3 retries
            await removeFromSyncQueue(item.id);
            toast({
              title: 'Sync Failed',
              description: `Failed to sync item after 3 attempts`,
              variant: 'destructive',
            });
          }
        }
      }

      if (progress > 0) {
        toast({
          title: 'Sync Complete',
          description: `Successfully synced ${progress} items`,
        });
      }
    } finally {
      setIsSyncing(false);
      setSyncProgress(0);
    }
  };

  return {
    addToSyncQueue,
    pendingItems,
    isSyncing,
    syncProgress,
    syncPendingItems
  };
};
