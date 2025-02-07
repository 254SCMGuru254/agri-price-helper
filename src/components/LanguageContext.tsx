
import { createContext, useContext, useState } from "react";

type LanguageContextType = {
  language: 'en' | 'sw';
  setLanguage: (lang: 'en' | 'sw') => void;
  t: (key: string) => string;
};

const translations = {
  en: {
    'nav.features': 'Features',
    'nav.howItWorks': 'How it Works',
    'nav.signOut': 'Sign Out',
    'nav.signIn': 'Sign In',
    'nav.getStarted': 'Get Started',
    'nav.language': 'Language',
  },
  sw: {
    'nav.features': 'Vipengele',
    'nav.howItWorks': 'Jinsi Inavyofanya Kazi',
    'nav.signOut': 'Toka',
    'nav.signIn': 'Ingia',
    'nav.getStarted': 'Anza',
    'nav.language': 'Lugha',
  }
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
