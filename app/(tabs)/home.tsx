import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import HeaderBar from '../../components/ui/HeaderBar';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <HeaderBar />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>Olá, {`{Nome}`}</Text>
        <Text style={styles.question}>O que deseja fazer?</Text>

        <Image
          source={require('../../assets/images/mascote.png')}
          style={styles.mascotImage}
          resizeMode="contain"
        />

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push('/studentManagement')}
        >
          <Image
            source={require('../../assets/images/students-icon.png')}
            style={styles.iconImage}
          />
          <Text style={styles.buttonText}>Gerenciar Alunos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push('/quiz')}
        >
          <Image
            source={require('../../assets/images/evaluation-icon.png')}
            style={styles.iconImage}
          />
          <Text style={styles.buttonText}>Realizar Avaliações</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  question: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  mascotImage: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  menuButton: {
    backgroundColor: '#1B3C87',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignSelf: 'stretch',
    minWidth: '80%',
  },
  iconImage: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
