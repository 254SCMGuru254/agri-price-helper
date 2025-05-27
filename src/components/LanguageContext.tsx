
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'sw' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
  isRTL: false,
});

export const useLanguage = () => useContext(LanguageContext);

// Translation data for common agricultural terms
const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.prices': 'Market Prices',
    'nav.weather': 'Weather',
    'nav.signIn': 'Sign In',
    'nav.signOut': 'Sign Out',
    'hero.title': 'Agricultural Price Intelligence Platform',
    'hero.subtitle': 'Real-time market prices, weather updates, and farming insights for Kenyan farmers',
    'prices.title': 'Market Prices',
    'prices.location': 'Location',
    'prices.commodity': 'Commodity',
    'prices.price': 'Price',
    'prices.organic': 'Organic',
    'prices.nonOrganic': 'Non-Organic',
    'weather.title': 'Weather Updates',
    'weather.temperature': 'Temperature',
    'weather.humidity': 'Humidity',
    'weather.wind': 'Wind Speed',
    'stats.agriculturalData': 'Agricultural Statistics',
    'stats.noDataAvailable': 'No data available for the selected filters',
    'errors.failedToLoadStats': 'Failed to load agricultural statistics',
    'errors.failedToLoadPrices': 'Failed to load market prices',
    'form.submit': 'Submit',
    'form.cancel': 'Cancel',
    'form.save': 'Save',
    'form.required': 'This field is required',
  },
  sw: {
    'nav.home': 'Nyumbani',
    'nav.dashboard': 'Dashibodi',
    'nav.prices': 'Bei za Soko',
    'nav.weather': 'Hali ya Hewa',
    'nav.signIn': 'Ingia',
    'nav.signOut': 'Toka',
    'hero.title': 'Jukwaa la Akili ya Bei za Kilimo',
    'hero.subtitle': 'Bei za soko za wakati halisi, masasisho ya hali ya hewa, na maarifa ya kilimo kwa wakulima wa Kenya',
    'prices.title': 'Bei za Soko',
    'prices.location': 'Mahali',
    'prices.commodity': 'Bidhaa',
    'prices.price': 'Bei',
    'prices.organic': 'Kikaboni',
    'prices.nonOrganic': 'Si Kikaboni',
    'weather.title': 'Masasisho ya Hali ya Hewa',
    'weather.temperature': 'Joto',
    'weather.humidity': 'Unyevu',
    'weather.wind': 'Kasi ya Upepo',
    'stats.agriculturalData': 'Takwimu za Kilimo',
    'stats.noDataAvailable': 'Hakuna data inayopatikana kwa vichujio vilivyochaguliwa',
    'errors.failedToLoadStats': 'Imeshindwa kupakia takwimu za kilimo',
    'errors.failedToLoadPrices': 'Imeshindwa kupakia bei za soko',
    'form.submit': 'Wasilisha',
    'form.cancel': 'Ghairi',
    'form.save': 'Hifadhi',
    'form.required': 'Sehemu hii inahitajika',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.dashboard': 'Tableau de bord',
    'nav.prices': 'Prix du marché',
    'nav.weather': 'Météo',
    'nav.signIn': 'Se connecter',
    'nav.signOut': 'Se déconnecter',
    'hero.title': 'Plateforme d\'Intelligence des Prix Agricoles',
    'hero.subtitle': 'Prix du marché en temps réel, mises à jour météo et conseils agricoles pour les agriculteurs kenyans',
    'prices.title': 'Prix du Marché',
    'prices.location': 'Emplacement',
    'prices.commodity': 'Produit',
    'prices.price': 'Prix',
    'prices.organic': 'Biologique',
    'prices.nonOrganic': 'Non-Biologique',
    'weather.title': 'Mises à jour Météo',
    'weather.temperature': 'Température',
    'weather.humidity': 'Humidité',
    'weather.wind': 'Vitesse du vent',
    'stats.agriculturalData': 'Statistiques Agricoles',
    'stats.noDataAvailable': 'Aucune donnée disponible pour les filtres sélectionnés',
    'errors.failedToLoadStats': 'Échec du chargement des statistiques agricoles',
    'errors.failedToLoadPrices': 'Échec du chargement des prix du marché',
    'form.submit': 'Soumettre',
    'form.cancel': 'Annuler',
    'form.save': 'Sauvegarder',
    'form.required': 'Ce champ est requis',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as Language;
    if (savedLanguage && ['en', 'sw', 'fr'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (['sw', 'fr'].includes(browserLang)) {
        setLanguage(browserLang as Language);
      }
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('preferred-language', lang);
  };

  const t = (key: string, fallback?: string): string => {
    return translations[language]?.[key] || fallback || key;
  };

  const isRTL = false; // None of our supported languages are RTL

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: handleSetLanguage, 
      t, 
      isRTL 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
