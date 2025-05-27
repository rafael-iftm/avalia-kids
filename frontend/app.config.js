import 'dotenv/config';

export default {
  expo: {
    name: 'Avalia Kids',
    slug: 'avalia-kids',
    version: '1.0.0',
    orientation: 'portrait',
    icon: 'https://firebasestorage.googleapis.com/v0/b/avaliakids.firebasestorage.app/o/logo.png?alt=media',
    scheme: 'myapp',
    userInterfaceStyle: 'light',
    newArchEnabled: true,

    splash: {
      image: 'https://firebasestorage.googleapis.com/v0/b/avaliakids.firebasestorage.app/o/logo.png?alt=media',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },

    ios: {
      supportsTablet: true,
    },

    android: {
      adaptiveIcon: {
        foregroundImage: 'https://firebasestorage.googleapis.com/v0/b/avaliakids.firebasestorage.app/o/logo.png?alt=media',
        backgroundColor: '#ffffff',
      },
    },

    web: {
      bundler: 'metro',
      output: 'static',
      favicon: 'https://firebasestorage.googleapis.com/v0/b/avaliakids.firebasestorage.app/o/logo.png?alt=media',
    },

    plugins: [
      'expo-router',
    ],

    experiments: {
      typedRoutes: true,
    },

    extra: {
      apiBaseUrl: process.env.API_BASE_URL,
    },
  },
};
