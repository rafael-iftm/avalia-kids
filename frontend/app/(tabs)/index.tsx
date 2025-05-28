import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import CustomHeaderBar from '@/components/ui/CustomHeaderBar';
import { Image } from 'expo-image';

export default function IndexScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <CustomHeaderBar/>
      <View style={styles.content}>
          {/* Imagem do logo */}
        <Image
          source="https://firebasestorage.googleapis.com/v0/b/avaliakids.firebasestorage.app/o/logo.png?alt=media"
          style={styles.logo}
          contentFit="contain"
        />

        {/* Título */}
        <Text style={styles.title}>Bem-vindo ao Avalia Kids!</Text>

        {/* Mascote */}
        <Image
          source="https://firebasestorage.googleapis.com/v0/b/avaliakids.firebasestorage.app/o/mascote.png?alt=media"
          style={styles.mascot}
          contentFit="contain"
        />

        {/* Subtítulo */}
        <Text style={styles.subtitle}>Avalie seu conhecimento de uma forma muito divertida</Text>

        {/* Botões */}
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/login')}>
          <Text style={styles.primaryButtonText}>Iniciar sessão</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/register')}>
          <Text style={styles.secondaryButtonText}>Cadastre-se aqui</Text>
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
    marginBottom: 50
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  mascot: {
    width: 300,
    height: 300,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#1B3C87',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderColor: '#1B3C87',
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    color: '#1B3C87',
    fontWeight: 'bold',
  },
});
