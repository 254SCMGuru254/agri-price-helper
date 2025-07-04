import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/components/AuthProvider';
import { NetworkProvider } from '@/components/NetworkProvider';
import { LanguageProvider } from '@/components/LanguageProvider';
import { Toaster } from '@/components/ui/toaster';
import App from './App';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NetworkProvider>
            <LanguageProvider>
              <App />
              <Toaster />
            </LanguageProvider>
          </NetworkProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
