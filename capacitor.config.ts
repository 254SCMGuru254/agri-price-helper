
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b7e73c0577504f2eb8fa153c8805b9e9',
  appName: 'agri-price-helper',
  webDir: 'dist',
  server: {
    url: 'https://b7e73c05-7750-4f2e-b8fa-153c8805b9e9.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#4f46e5",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#ffffff"
    }
  },
  ios: {
    contentInset: 'always'
  },
  android: {
    backgroundColor: "#ffffff"
  }
};

export default config;
