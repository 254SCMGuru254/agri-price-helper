
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Globe, MessageCircle, Star, Eye, Users } from "lucide-react";
import { BusinessListingForm } from "./BusinessListingForm";
import { PayPalFeatureUpgrade } from "./PayPalFeatureUpgrade";
import type { Database } from "@/integrations/supabase/types";

type BusinessListing = Database["public"]["Tables"]["business_listings"]["Row"];

export const BusinessMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [businessTypeFilter, setBusinessTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { data: businesses, isLoading } = useQuery({
    queryKey: ['business-listings', searchTerm, businessTypeFilter, locationFilter],
    queryFn: async () => {
      let query = supabase
        .from('business_listings')
        .select('*')
        .eq('status', 'active')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`business_name.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (businessTypeFilter) {
        query = query.eq('business_type', businessTypeFilter);
      }

      if (locationFilter) {
        query = query.ilike('location', `%${locationFilter}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const businessTypes = [
    { value: 'farm', label: 'Farm/Producer' },
    { value: 'supplier', label: 'Supplier/Vendor' },
    { value: 'processor', label: 'Processor/Manufacturer' },
    { value: 'logistics', label: 'Logistics/Transport' },
    { value: 'equipment', label: 'Equipment/Machinery' },
    { value: 'services', label: 'Services/Consulting' }
  ];

  const incrementContactClicks = async (businessId: string) => {
    const { data: currentBusiness } = await supabase
      .from('business_listings')
      .select('contact_clicks')
      .eq('id', businessId)
      .single();

    if (currentBusiness) {
      await supabase
        .from('business_listings')
        .update({ contact_clicks: (currentBusiness.contact_clicks || 0) + 1 })
        .eq('id', businessId);
    }
  };

  const incrementViews = async (businessId: string) => {
    const { data: currentBusiness } = await supabase
      .from('business_listings')
      .select('views_count')
      .eq('id', businessId)
      .single();

    if (currentBusiness) {
      await supabase
        .from('business_listings')
        .update({ views_count: (currentBusiness.views_count || 0) + 1 })
        .eq('id', businessId);
    }
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Add Your Business</h2>
          <Button variant="outline" onClick={() => setShowForm(false)}>
            Back to Marketplace
          </Button>
        </div>
        <BusinessListingForm />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">AgriPrice Business Marketplace</h2>
          <p className="text-muted-foreground">Connect with farmers, suppliers, and agricultural businesses</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          List Your Business
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Search businesses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <Select value={businessTypeFilter} onValueChange={setBusinessTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All business types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All types</SelectItem>
            {businessTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Input
          placeholder="Filter by location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
        
        <Button 
          variant="outline" 
          onClick={() => {
            setSearchTerm('');
            setBusinessTypeFilter('');
            setLocationFilter('');
          }}
        >
          Clear Filters
        </Button>
      </div>

      {/* Business Listings */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses?.map((business) => (
            <Card 
              key={business.id} 
              className={`relative ${business.is_featured ? 'ring-2 ring-primary shadow-lg' : ''}`}
              onClick={() => incrementViews(business.id)}
            >
              {business.is_featured && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{business.business_name}</CardTitle>
                    <CardDescription>{business.title}</CardDescription>
                  </div>
                  <Badge variant="outline">
                    {businessTypes.find(t => t.value === business.business_type)?.label}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {business.description}
                </p>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {business.location}
                </div>

                {business.products_services && business.products_services.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {business.products_services.slice(0, 3).map((product, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {product}
                      </Badge>
                    ))}
                    {business.products_services.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{business.products_services.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {business.views_count || 0} views
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {business.contact_clicks || 0} contacts
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {business.contact_phone && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        incrementContactClicks(business.id);
                        window.open(`tel:${business.contact_phone}`);
                      }}
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                  )}
                  
                  {business.whatsapp_number && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        incrementContactClicks(business.id);
                        window.open(`https://wa.me/${business.whatsapp_number.replace(/[^0-9]/g, '')}`);
                      }}
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      WhatsApp
                    </Button>
                  )}
                  
                  {business.contact_email && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        incrementContactClicks(business.id);
                        window.open(`mailto:${business.contact_email}`);
                      }}
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </Button>
                  )}
                  
                  {business.website_url && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        incrementContactClicks(business.id);
                        window.open(business.website_url, '_blank');
                      }}
                    >
                      <Globe className="h-3 w-3 mr-1" />
                      Website
                    </Button>
                  )}
                </div>

                {!business.is_featured && (
                  <PayPalFeatureUpgrade businessId={business.id} />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {businesses && businesses.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No businesses found matching your criteria.</p>
            <Button className="mt-4" onClick={() => setShowForm(true)}>
              Be the first to list your business!
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
