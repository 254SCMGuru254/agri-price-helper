
import React, { useState } from 'react';
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const businessTypes = [
  { value: 'farm', label: 'Farm/Producer' },
  { value: 'supplier', label: 'Supplier/Vendor' },
  { value: 'processor', label: 'Processor/Manufacturer' },
  { value: 'logistics', label: 'Logistics/Transport' },
  { value: 'equipment', label: 'Equipment/Machinery' },
  { value: 'services', label: 'Services/Consulting' }
];

export const BusinessListingForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    business_type: '',
    title: '',
    description: '',
    contact_phone: '',
    contact_email: '',
    location: '',
    website_url: '',
    whatsapp_number: '',
    telegram_username: '',
    products_services: [] as string[]
  });
  const [productService, setProductService] = useState('');

  const addProductService = () => {
    if (productService.trim() && !formData.products_services.includes(productService.trim())) {
      setFormData(prev => ({
        ...prev,
        products_services: [...prev.products_services, productService.trim()]
      }));
      setProductService('');
    }
  };

  const removeProductService = (item: string) => {
    setFormData(prev => ({
      ...prev,
      products_services: prev.products_services.filter(p => p !== item)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('business_listings')
        .insert({
          ...formData,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Business listed successfully!",
        description: "Your business has been added to the marketplace. Top contributors get 3 months free featuring!",
      });

      // Reset form
      setFormData({
        business_name: '',
        business_type: '',
        title: '',
        description: '',
        contact_phone: '',
        contact_email: '',
        location: '',
        website_url: '',
        whatsapp_number: '',
        telegram_username: '',
        products_services: []
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Please sign in to add your business listing.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Your Business to AgriPrice Marketplace</CardTitle>
        <CardDescription>
          List your farm, products, or agricultural services. Top contributors get 3 months of free featuring!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="business_name">Business Name *</Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => handleInputChange('business_name', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="business_type">Business Type *</Label>
              <Select 
                value={formData.business_type} 
                onValueChange={(value) => handleInputChange('business_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="title">Listing Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Fresh Organic Vegetables from Nakuru"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your business, products, or services..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="e.g., Nakuru, Kenya"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_phone">Phone Number</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                placeholder="+254..."
              />
            </div>
            
            <div>
              <Label htmlFor="contact_email">Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
              <Input
                id="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                placeholder="+254..."
              />
            </div>
            
            <div>
              <Label htmlFor="telegram_username">Telegram Username</Label>
              <Input
                id="telegram_username"
                value={formData.telegram_username}
                onChange={(e) => handleInputChange('telegram_username', e.target.value)}
                placeholder="@username"
              />
            </div>
            
            <div>
              <Label htmlFor="website_url">Website URL</Label>
              <Input
                id="website_url"
                value={formData.website_url}
                onChange={(e) => handleInputChange('website_url', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <Label>Products/Services</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={productService}
                onChange={(e) => setProductService(e.target.value)}
                placeholder="Add a product or service"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProductService())}
              />
              <Button type="button" onClick={addProductService} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.products_services.map((item, index) => (
                <Badge key={index} variant="secondary" className="px-2 py-1">
                  {item}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => removeProductService(item)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Adding Business...' : 'Add Business Listing'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
