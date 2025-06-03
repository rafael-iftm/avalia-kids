import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import CustomHeaderBar from '@/components/ui/CustomHeaderBar';
import { routes } from '@/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { getImageUrl, getPlaceholderUrl } from '@/utils/storage';

export default function WelcomeScreen() {
  const [userName, setUserName] = useState('');
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const storedName = await AsyncStorage.getItem('name');
        if (storedName) {
          setUserName(storedName);
        } else {
          console.log('[Menu] Nome do usuário não encontrado no armazenamento.');
        }
      } catch (error) {
        console.log('[Menu] Erro ao recuperar o nome do usuário:', error);
      }
    };

    fetchUserName();
  }, []);

  return (
    <View style={styles.container}>
      <CustomHeaderBar
        title="Avaliação"
        leftIcon={{ name: 'arrow-back-outline', route: routes.home }}
      />
      {/* Conteúdo principal */}
      <View style={styles.content}>
        <Text style={styles.greeting}>Olá, {userName || 'Visitante'}!</Text>
        <Image
          source={getImageUrl({ folder: 'default', filename: 'evaluation-icon' })}
          placeholder={getPlaceholderUrl({ folder: 'default', filename: 'evaluation-icon' })}
          style={styles.mascotImage}
          contentFit="contain"
          cachePolicy="none"
        />
        <Text style={styles.welcomeText}>Bem-vindo ao Avalia Kids</Text>
        <Text style={styles.subtitle}>
          Pronto para testar seus conhecimentos de forma divertida?
        </Text>

        {/* Botão de começar a avaliação */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push('/quiz')}
        >
          <Ionicons name="play-circle-outline" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Começar Avaliação</Text>
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
  header: {
    backgroundColor: '#1B3C87',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: -80,
  },
  mascotImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B3C87',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
