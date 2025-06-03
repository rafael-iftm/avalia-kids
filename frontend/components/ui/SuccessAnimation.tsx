import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { getAnimationUrl } from '@/utils/storage';

export default function SuccessAnimation({ onFinish }: { onFinish: () => void }) {
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    animation.current?.play();
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animation}
        source={{ uri: getAnimationUrl('success') }}
        autoPlay
        loop={false}
        onAnimationFinish={onFinish}
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  animation: {
    width: 1000,
    height: 1000,
  },
});
