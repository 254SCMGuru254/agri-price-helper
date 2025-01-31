import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Database } from "@/integrations/supabase/types";

type MarketPrice = Database["public"]["Tables"]["market_prices"]["Row"];

interface PriceMapProps {
  prices: MarketPrice[];
}

const PriceMap = ({ prices }: PriceMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Initialize map
    mapInstance.current = L.map(mapRef.current).setView([0, 0], 2);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance.current);

    // Create markers for each price location
    prices.forEach(price => {
      // Use OpenStreetMap Nominatim API for geocoding
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(price.location)}`)
        .then(response => response.json())
        .then(data => {
          if (data && data[0]) {
            const marker = L.marker([parseFloat(data[0].lat), parseFloat(data[0].lon)])
              .addTo(mapInstance.current!);

            marker.bindPopup(`
              <div>
                <h3>${price.commodity}</h3>
                <p>Price: $${price.price}/${price.unit}</p>
                <p>${price.is_organic ? 'Organic' : 'Non-organic'}</p>
                <p>Location: ${price.location}</p>
              </div>
            `);

            markersRef.current.push(marker);
          }
        })
        .catch(error => console.error('Error geocoding location:', error));
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markersRef.current = [];
      }
    };
  }, [prices]);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapRef} className="absolute inset-0" />
    </div>
  );
};

export default PriceMap;