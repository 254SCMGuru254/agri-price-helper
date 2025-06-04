
import React from 'react';
import { createRoot } from 'react-dom/client';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './components/AuthProvider';
import { NetworkProvider } from './components/NetworkProvider';

// Call the element loader for Capacitor plugins before the app is initialized
defineCustomElements(window);

// Create a client with enhanced error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry for certain error types
        if (error instanceof Error && error.message.includes('CSP')) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Ensure React is properly initialized before rendering
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NetworkProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </NetworkProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
