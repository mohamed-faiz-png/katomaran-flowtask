import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d4291f933fd14c4c97341814ca5fac63',
  appName: 'katomaran-flowtask',
  webDir: 'dist',
  server: {
    url: 'https://d4291f93-3fd1-4c4c-9734-1814ca5fac63.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#6366f1',
      showSpinner: true,
      spinnerColor: '#ffffff'
    }
  }
};

export default config;