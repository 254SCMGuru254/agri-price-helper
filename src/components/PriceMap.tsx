
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Database } from "@/integrations/supabase/types";
import { Card } from '@/components/ui/card';
import { AlertTriangle, MapPin } from 'lucide-react';

type MarketPrice = Database["public"]["Tables"]["market_prices"]["Row"];

interface PriceMapProps {
  prices: MarketPrice[];
  height?: string;
  showTitle?: boolean;
}

const PriceMap = ({ prices, height = "400px", showTitle = true }: PriceMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only initialize the map if it hasn't been initialized yet
    if (!mapRef.current || mapInstance.current) return;

    try {
      // Define custom icon for better mobile display
      const customIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      // Initialize map centered on Kenya
      mapInstance.current = L.map(mapRef.current).setView([-1.286389, 36.817223], 7);

      // Add OpenStreetMap tiles with attribution
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        // Set minimum zoom for better mobile experience
        minZoom: 4
      }).addTo(mapInstance.current);

      // Add markers for each price location
      const markers: L.Marker[] = [];
      const markersLayer = L.layerGroup().addTo(mapInstance.current);

      // Function to add markers from prices data
      const addMarkers = () => {
        if (!mapInstance.current) return;
        
        // Clear existing markers
        markersLayer.clearLayers();
        
        // We'll use batch geocoding to reduce API calls
        const uniqueLocations = Array.from(new Set(prices.map(price => price.location)));
        
        Promise.all(
          uniqueLocations.map(location => 
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location + ', Kenya')}`)
              .then(response => response.json())
          )
        ).then(results => {
          // Create a map of location names to coordinates
          const locationMap = new Map();
          
          results.forEach((data, index) => {
            if (data && data[0]) {
              locationMap.set(uniqueLocations[index], {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon)
              });
            }
          });
          
          // Now add markers for all prices using the location map
          prices.forEach(price => {
            const coords = locationMap.get(price.location);
            if (coords) {
              const marker = L.marker([coords.lat, coords.lon], { icon: customIcon })
                .addTo(markersLayer);
                
              marker.bindPopup(`
                <div class="p-2">
                  <h3 class="font-bold">${price.commodity}</h3>
                  <p>Price: ${price.price} KES/${price.unit}</p>
                  <p>${price.is_organic ? '✅ Organic' : 'Non-organic'}</p>
                  <p>Location: ${price.location}</p>
                  <p class="text-xs text-muted mt-2">Submitted: ${new Date(price.created_at).toLocaleDateString()}</p>
                </div>
              `);
              
              markers.push(marker);
            }
          });
          
          // If we have markers, fit the map to show all of them
          if (markers.length > 0) {
            const group = L.featureGroup(markers);
            mapInstance.current?.fitBounds(group.getBounds().pad(0.1));
          }
          
          setIsMapLoaded(true);
        }).catch(err => {
          console.error("Error geocoding locations:", err);
          setError("Could not load map locations. Please try again later.");
        });
      };
      
      // Add markers initially
      addMarkers();
      
      // Add responsive handling for mobile devices
      const handleResize = () => {
        if (mapInstance.current) {
          mapInstance.current.invalidateSize();
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      // Return cleanup function
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    } catch (err) {
      console.error("Error initializing map:", err);
      setError("Could not initialize map. Please try again later.");
    }
  }, []);

  // When prices change, update the markers
  useEffect(() => {
    if (mapInstance.current && prices.length > 0) {
      // Similar logic to add markers when prices change
      // This would be implemented in a full solution
    }
  }, [prices]);

  return (
    <Card className="overflow-hidden">
      {showTitle && <div className="p-3 border-b">
        <h3 className="font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Agricultural Price Map
        </h3>
      </div>}
      <div className="relative" style={{ height }}>
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2 text-red-500">
              <AlertTriangle size={18} />
              <p>{error}</p>
            </div>
          </div>
        ) : !isMapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : null}
        <div ref={mapRef} className="absolute inset-0" />
      </div>
    </Card>
  );
};

export default PriceMap;
