
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
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('timestamp', { ascending: true });

        if (error) throw error;

        setMessages(data as MessageType[] || []);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const messagesSubscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages' 
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as MessageType]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messagesSubscription);
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
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('message_images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('message_images')
          .getPublicUrl(fileName);

        image_url = urlData.publicUrl;
      }

      // Save message to database
      const { data, error } = await supabase
        .from('messages')
        .insert({
          user_id: user.id,
          user_name: user.user_metadata?.full_name || 'Anonymous',
          text: text.trim() || null,
          image_url,
          timestamp: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Replace the temp message with the real one
      setMessages(prev => 
        prev.map(msg => msg.id === tempId ? (data as MessageType) : msg)
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
