import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Início' });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Logo ou imagem de destaque */}
      <Image
        source={require('../../assets/images/mascote.png')}
        style={styles.logo}
      />

      {/* Título do App */}
      <Text style={styles.title}>Bem-vindo ao Avalia Kids!</Text>
      <Text style={styles.subtitle}>Pronto para testar seus conhecimentos de forma divertida?</Text>

      {/* Botão principal */}
      <TouchableOpacity style={styles.startButton} onPress={() => router.push('/quiz')}>
        <Ionicons name="play-circle" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.startButtonText}>Começar Avaliação</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 10,
  },
  icon: {
    marginRight: 5,
  },
});