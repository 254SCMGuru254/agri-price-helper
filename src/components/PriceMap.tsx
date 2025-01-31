import React, { useEffect, useRef } from 'react';
import type { Database } from "@/integrations/supabase/types";

type MarketPrice = Database["public"]["Tables"]["market_prices"]["Row"];

interface PriceMapProps {
  prices: MarketPrice[];
}

const PriceMap = ({ prices }: PriceMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (typeof window.google !== 'undefined') {
        initializeMap();
        return;
      }

      window.initMap = initializeMap;
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
      });
      googleMapRef.current = map;

      // Create a geocoder instance
      const geocoder = new window.google.maps.Geocoder();

      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add markers for each price location
      prices.forEach(price => {
        geocoder.geocode({ address: price.location }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const marker = new window.google.maps.Marker({
              map,
              position: results[0].geometry.location,
              title: `${price.commodity} - $${price.price}/${price.unit} (${price.is_organic ? 'Organic' : 'Non-organic'})`
            });

            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div>
                  <h3>${price.commodity}</h3>
                  <p>Price: $${price.price}/${price.unit}</p>
                  <p>${price.is_organic ? 'Organic' : 'Non-organic'}</p>
                  <p>Location: ${price.location}</p>
                </div>
              `
            });

            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });

            markersRef.current.push(marker);
          }
        });
      });
    };

    loadGoogleMaps();

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
    };
  }, [prices]);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapRef} className="absolute inset-0" />
      <div className="absolute top-0 left-0 bg-background/80 p-4 m-4 rounded-lg">
        <p className="text-sm">
          Note: To use Google Maps, you'll need to add your API key.
        </p>
      </div>
    </div>
  );
};

export default PriceMap;