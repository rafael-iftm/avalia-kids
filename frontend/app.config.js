import 'dotenv/config';

export default {
  expo: {
    name: 'avalia-kids',
    slug: 'avalia-kids',
    version: '1.0.0',
    orientation: 'portrait',
    icon: 'https://firebasestorage.googleapis.com/v0/b/avaliakids.firebasestorage.app/o/logo.png?alt=media',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
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
      [
        'expo-splash-screen',
        {
          image: 'https://firebasestorage.googleapis.com/v0/b/avaliakids.firebasestorage.app/o/logo.png?alt=media',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      apiBaseUrl: process.env.API_BASE_URL,
    },
  },
};
