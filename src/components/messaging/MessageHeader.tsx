
import React, { useState } from 'react';
import { Search, Users, ChevronLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useContacts } from './useContacts';

interface MessageHeaderProps {
  selectedContact: string | null;
  setSelectedContact: (id: string | null) => void;
}

export const MessageHeader: React.FC<MessageHeaderProps> = ({ 
  selectedContact, 
  setSelectedContact 
}) => {
  const [showContacts, setShowContacts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { contacts, isLoading } = useContacts();

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedContact) {
    const contact = contacts.find(c => c.id === selectedContact);
    
    return (
      <div className="p-3 border-b flex items-center space-x-2 bg-background">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setSelectedContact(null)}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-9 w-9">
          <AvatarImage src={contact?.avatar} />
          <AvatarFallback>{contact?.name.charAt(0) || '?'}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{contact?.name}</h3>
          <p className="text-xs text-muted-foreground">{contact?.isOnline ? 'Online' : 'Offline'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-3 border-b flex items-center justify-between bg-background">
        <h2 className="font-semibold">Messages</h2>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShowContacts(!showContacts)}
        >
          <Users className="h-5 w-5" />
        </Button>
      </div>
      
      {showContacts && (
        <div className="border-b p-3 bg-background">
          <div className="flex items-center space-x-2 mb-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8"
            />
          </div>
          
          {isLoading ? (
            <div className="text-center py-2 text-sm text-muted-foreground">
              Loading contacts...
            </div>
          ) : (
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {filteredContacts.length > 0 ? (
                filteredContacts.map(contact => (
                  <div 
                    key={contact.id}
                    className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md cursor-pointer"
                    onClick={() => {
                      setSelectedContact(contact.id);
                      setShowContacts(false);
                    }}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.role}</p>
                    </div>
                    {contact.isOnline && (
                      <div className="w-2 h-2 bg-green-500 rounded-full ml-auto" />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  No contacts found
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
