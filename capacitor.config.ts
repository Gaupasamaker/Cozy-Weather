import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gaupasamaker.cozyweather',
  appName: 'Cozy Weather',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: '#fdf2f8'
    }
  }
};

export default config;
