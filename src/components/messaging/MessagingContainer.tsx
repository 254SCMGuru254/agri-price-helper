
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { MessageHeader } from './MessageHeader';
import { useMessages } from './useMessages';

export const MessagingContainer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { messages, sendMessage, isLoading, error } = useMessages();
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  
  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">Please sign in to use messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      <MessageHeader 
        selectedContact={selectedContact} 
        setSelectedContact={setSelectedContact} 
      />
      <MessageList 
        messages={messages} 
        currentUser={user}
        isLoading={isLoading}
      />
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};
