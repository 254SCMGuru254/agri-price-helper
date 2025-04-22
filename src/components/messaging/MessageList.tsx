
import React, { useRef, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { formatDistanceToNow } from 'date-fns';
import { MessageType } from './types';
import { Image as ImageIcon, Download } from 'lucide-react';

interface MessageListProps {
  messages: MessageType[];
  currentUser: User;
  isLoading: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  currentUser,
  isLoading 
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <p className="text-muted-foreground text-center">
          No messages yet. Start a conversation!
        </p>
      </div>
    );
  }

  const handleDownloadImage = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.user_id === currentUser.id;
          
          return (
            <div 
              key={message.id} 
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  isCurrentUser 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background border'
                }`}
              >
                {!isCurrentUser && (
                  <p className="text-xs font-medium mb-1">{message.user_name}</p>
                )}
                
                {message.text && <p className="text-sm">{message.text}</p>}
                
                {message.image_url && (
                  <div className="mt-2 relative group">
                    <div className="relative w-64 h-48 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                      {message.image_url === 'pending' ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="animate-pulse flex space-x-2">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Uploading...</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <img 
                            src={message.image_url} 
                            alt="Message attachment" 
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => handleDownloadImage(message.image_url!, `image-${Date.now()}.jpg`)}
                            className="absolute right-2 bottom-2 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Download image"
                          >
                            <Download className="h-4 w-4 text-white" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
                
                <div className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
