
import React from "react";

interface OfflineNoticeProps {
  isOffline: boolean;
}

export const OfflineNotice: React.FC<OfflineNoticeProps> = ({ isOffline }) => {
  if (!isOffline) return null;
  
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
      <p className="text-yellow-700">
        You're currently offline. Your submissions will be saved locally and submitted when you're back online.
      </p>
    </div>
  );
};
