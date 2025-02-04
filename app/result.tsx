import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';

export default function ResultScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Resultado', headerBackVisible: false });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Concluído!</Text>
      <Text style={styles.subtitle}>Parabéns por finalizar o quiz.</Text>
      <Button title="Voltar ao Início" onPress={() => router.replace('/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
});
