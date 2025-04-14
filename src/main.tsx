
import React from 'react';
import { createRoot } from 'react-dom/client';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import App from './App.tsx';
import './index.css';

// Call the element loader for Capacitor plugins before the app is initialized
defineCustomElements(window);

// Ensure React is properly initialized before rendering
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
