
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
    },
    PrivacyScreen: {
      enable: true
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#4f46e5"
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  },
  ios: {
    contentInset: 'always',
    backgroundColor: "#ffffff",
    preferredStatusBarStyle: "dark",
    scheme: "agri-price-helper",
    appleMapsApiKey: "",
    permissions: {
      locationWhenInUse: {
        message: "We need your location to provide accurate weather and market data for your region"
      },
      camera: {
        message: "We need camera access to allow you to upload photos of crops and market items"
      },
      notifications: {
        message: "We'll notify you about important market price changes and weather alerts"
      }
    }
  },
  android: {
    backgroundColor: "#ffffff",
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    hideLogs: true,
    permissions: [
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.CAMERA",
      "android.permission.INTERNET",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE"
    ]
  }
};

export default config;
