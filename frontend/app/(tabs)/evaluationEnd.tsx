import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import CustomHeaderBar from '@/components/ui/CustomHeaderBar';
import { routes } from '@/routes';
import { Image } from 'expo-image';
import { getImageUrl, getPlaceholderUrl } from '@/utils/storage';

export default function EvaluationEndScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <CustomHeaderBar
        title="Fim da Avaliação"
      />

      <View style={styles.content}>
        {/* Imagem do foguete */}
        <Image
          source={getImageUrl({ folder: 'default', filename: 'evaluation-end' })}
          placeholder={getPlaceholderUrl({ folder: 'default', filename: 'evaluation-end' })}
          style={styles.evaluationEndImage}
          contentFit="contain"
          cachePolicy="none"
        />

        {/* Título de Parabéns */}
        <Text style={styles.title}>
          Missão cumprida! <Text style={styles.emoji}>🚀🎉</Text>
        </Text>

        {/* Texto de agradecimento */}
        <Text style={styles.subtitle}>
        Você completou a avaliação com muita dedicação e energia!{'\n\n'}
        Estamos muito orgulhosos de você!
        </Text>

        {/* Botão para voltar ao início */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace(routes.home)}
        >
          <Text style={styles.buttonText}>Voltar ao menu</Text>
        </TouchableOpacity>

        <Text style={styles.infoText}>
          Os resultados podem ser consultados na aba <Text style={styles.bold}>Minhas Crianças</Text> no menu principal.
        </Text>

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
    marginBottom: 50
  },
  evaluationEndImage: {
    width: 250,
    height: 250,
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
  infoText: {
    fontSize: 13,
    color: '#444',
    textAlign: 'center',
    marginTop: 24,
    marginHorizontal: 20,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '600',
  },
});
