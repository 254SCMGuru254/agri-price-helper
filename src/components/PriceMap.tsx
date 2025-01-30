import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Database } from "@/integrations/supabase/types";

type MarketPrice = Database["public"]["Tables"]["market_prices"]["Row"];

interface PriceMapProps {
  prices: MarketPrice[];
}

const PriceMap = ({ prices }: PriceMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with a temporary token - user will need to input their own
    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [0, 0],
      zoom: 1
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for each price location
    prices.forEach(price => {
      // Here we would normally geocode the location string to get coordinates
      // For now, we'll just show a message that geocoding is needed
      console.log(`Would place marker for ${price.commodity} in ${price.location}`);
    });

    return () => {
      map.current?.remove();
    };
  }, [prices]);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-0 left-0 bg-background/80 p-4 m-4 rounded-lg">
        <p className="text-sm">
          To use the map feature, you'll need a free Mapbox token.
          Get one at <a href="https://www.mapbox.com/signup/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mapbox.com</a>
        </p>
      </div>
    </div>
  );
};

export default PriceMap;