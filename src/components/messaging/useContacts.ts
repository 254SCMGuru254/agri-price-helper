
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContactType } from './types';

export const useContacts = () => {
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would fetch from a contacts/users table
        // For now, use sample data
        const sampleContacts: ContactType[] = [
          {
            id: '1',
            name: 'John Farmer',
            avatar: 'https://i.pravatar.cc/150?img=1',
            role: 'Maize Farmer',
            isOnline: true
          },
          {
            id: '2',
            name: 'Sarah Johnson',
            avatar: 'https://i.pravatar.cc/150?img=5',
            role: 'Agricultural Officer',
            isOnline: false
          },
          {
            id: '3',
            name: 'Michael Smith',
            avatar: 'https://i.pravatar.cc/150?img=8',
            role: 'Supplier',
            isOnline: true
          },
          {
            id: '4',
            name: 'Emily Harris',
            avatar: 'https://i.pravatar.cc/150?img=9',
            role: 'Market Agent',
            isOnline: false
          },
          {
            id: '5',
            name: 'James Wilson',
            avatar: 'https://i.pravatar.cc/150?img=12',
            role: 'Tea Farmer',
            isOnline: true
          }
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setContacts(sampleContacts);
      } catch (err) {
        console.error('Error fetching contacts:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch contacts'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return { contacts, isLoading, error };
};
