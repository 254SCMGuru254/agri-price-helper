
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Users } from 'lucide-react';

export const FarmerContact = () => {
  const handleWhatsAppGroup = () => {
    // Kenya farmers WhatsApp group link
    window.open('https://chat.whatsapp.com/farmers-kenya', '_blank');
  };

  const handleTelegramGroup = () => {
    // Kenya farmers Telegram group link
    window.open('https://t.me/KenyaFarmers', '_blank');
  };

  const handleCallCenter = () => {
    // Kenya agricultural hotline
    window.open('tel:+254709985000', '_self');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Connect with Farmers
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Join our farming community on your preferred platform
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={handleWhatsAppGroup}
          className="w-full justify-start"
          variant="outline"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Join WhatsApp Group
        </Button>
        
        <Button 
          onClick={handleTelegramGroup}
          className="w-full justify-start"
          variant="outline"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Join Telegram Group
        </Button>
        
        <Button 
          onClick={handleCallCenter}
          className="w-full justify-start"
          variant="outline"
        >
          <Phone className="h-4 w-4 mr-2" />
          Call Agricultural Hotline
        </Button>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>WhatsApp:</strong> Share prices, ask questions, get advice<br/>
            <strong>Telegram:</strong> Daily market updates and news<br/>
            <strong>Hotline:</strong> Expert agricultural advice
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
