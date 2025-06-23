import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useOfflineSync } from './useOfflineSync';
import { useOnlineStatus } from './useOnlineStatus';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';

export const OfflineSync = () => {
  const isOnline = useOnlineStatus();
  const { pendingItems, isSyncing, syncProgress, syncPendingItems } = useOfflineSync();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isOnline ? (
            <Cloud className="h-5 w-5 text-green-500" />
          ) : (
            <CloudOff className="h-5 w-5 text-yellow-500" />
          )}
          Sync Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {isOnline ? 'Online' : 'Offline'} Mode
              </p>
              <p className="text-sm text-muted-foreground">
                {pendingItems.length} items pending sync
              </p>
            </div>
            {isOnline && pendingItems.length > 0 && (
              <Button
                size="sm"
                onClick={syncPendingItems}
                disabled={isSyncing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </Button>
            )}
          </div>

          {isSyncing && (
            <div className="space-y-2">
              <Progress value={syncProgress} />
              <p className="text-xs text-center text-muted-foreground">
                Syncing {Math.round(syncProgress)}%
              </p>
            </div>
          )}

          {pendingItems.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Pending Items:</p>
              <div className="max-h-[200px] overflow-y-auto space-y-2">
                {pendingItems.map((item) => (
                  <div
                    key={item.id}
                    className="text-sm p-2 bg-muted rounded flex items-center justify-between"
                  >
                    <div>
                      <span className="font-medium capitalize">{item.type}</span>
                      <span className="text-muted-foreground ml-2">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {item.retryCount > 0 && (
                      <span className="text-yellow-500 text-xs">
                        Retries: {item.retryCount}/3
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            {isOnline ? (
              <p>✓ Connected to server</p>
            ) : (
              <p>
                ! You're currently offline. Don't worry - your data will be saved and
                synced automatically when you're back online.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 