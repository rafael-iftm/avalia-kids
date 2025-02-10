import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import CustomHeaderBar from '@/components/ui/CustomHeaderBar';
import { routes } from '@/routes';

export default function EvaluationEndScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <CustomHeaderBar
        title="Avaliação"
      />

      <View style={styles.content}>
        {/* Imagem do foguete */}
        <Image
          source={require('@/assets/images/rocket.png')} // Ajuste o caminho conforme necessário
          style={styles.rocketImage}
          resizeMode="contain"
        />

        {/* Título de Parabéns */}
        <Text style={styles.title}>
          Parabéns por finalizar <Text style={styles.emoji}>🚀🎉</Text>
        </Text>

        {/* Texto de agradecimento */}
        <Text style={styles.subtitle}>
          Você completou o desafio com muita dedicação e inteligência!{'\n\n'}
          Que incrível ver seu esforço!
        </Text>

        {/* Botão para voltar ao início */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace(routes.home)}
        >
          <Text style={styles.buttonText}>Voltar ao início</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 100
  },
  rocketImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  emoji: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#1B3C87',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
