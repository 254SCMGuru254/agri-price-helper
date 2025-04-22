
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { MessageType } from './types';
import { v4 as uuidv4 } from 'uuid';

export const useMessages = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Load messages
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        // Mock data for now since we don't have a messages table yet
        // In a real app, you would create a messages table in Supabase first
        const mockMessages: MessageType[] = [
          {
            id: '1',
            user_id: user.id,
            user_name: 'Agricultural Expert',
            text: 'Welcome to the farmer messaging system! How can I help you today?',
            image_url: null,
            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          },
        ];
        
        setMessages(mockMessages);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // In a real app, you would set up a subscription to the messages table
    // For now, we'll just mock this behavior
    const mockSubscription = { unsubscribe: () => {} };

    return () => {
      mockSubscription.unsubscribe();
    };
  }, [user]);

  // Send a new message
  const sendMessage = useCallback(async (text: string, imageFile?: File | null) => {
    if (!user) throw new Error('User not authenticated');
    if (!text.trim() && !imageFile) throw new Error('Message cannot be empty');

    // Create a temporary message with pending status for the image
    const tempId = uuidv4();
    const tempMessage: MessageType = {
      id: tempId,
      user_id: user.id,
      user_name: user.user_metadata?.full_name || 'Anonymous',
      text: text.trim() || null,
      image_url: imageFile ? 'pending' : null,
      timestamp: new Date().toISOString()
    };

    // Optimistically update UI
    setMessages(prev => [...prev, tempMessage]);

    try {
      let image_url = null;

      // If there's an image, upload it first
      if (imageFile) {
        const timestamp = Date.now();
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${timestamp}.${fileExt}`;
        
        // In a real app, you would create a storage bucket first
        // For now, we'll just simulate the upload
        console.log(`Simulating upload of ${fileName}`);
        
        // Simulate a delay for the upload
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        image_url = 'https://example.com/sample-image.jpg';
      }

      // In a real app, you would save to Supabase database
      // For now, we'll just simulate this
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data: MessageType = {
        ...tempMessage,
        image_url,
        id: uuidv4() // In a real app, this would come from the database
      };

      // Replace the temp message with the real one
      setMessages(prev => 
        prev.map(msg => msg.id === tempId ? data : msg)
      );

    } catch (err) {
      console.error('Error sending message:', err);
      
      // Remove the temp message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      
      // Re-throw for the UI to handle
      throw err;
    }
  }, [user]);

  return { messages, sendMessage, isLoading, error };
};
