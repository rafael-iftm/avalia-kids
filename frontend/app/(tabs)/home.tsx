import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeaderBar from '@/components/ui/CustomHeaderBar';
import { routes } from '@/routes';
import { Image } from 'expo-image';

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');

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
        title="Menu"
        //leftIcon={{ name: 'settings-outline', route: routes.settings }} [REMOVER NA V2]
        rightIcon={{ name: 'log-out-outline', route: routes.login }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>Olá, {userName || 'Visitante'}!</Text>
        <Text style={styles.question}>O que deseja fazer?</Text>

      <Image
        source="https://firebasestorage.googleapis.com/v0/b/avaliakids.firebasestorage.app/o/mascote.png?alt=media"
        style={styles.mascotImage}
        contentFit="contain"
        cachePolicy="none"
      />

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push('/studentManagement')}
        >
          <Image
            source="https://firebasestorage.googleapis.com/v0/b/avaliakids.firebasestorage.app/o/students-icon.png?alt=media"
            style={styles.iconImage}
            contentFit="contain"
            cachePolicy="none"
          />
          <Text style={styles.buttonText}>Gerenciar Alunos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push('/evaluationStart')}
        >
          <Image
            source="https://firebasestorage.googleapis.com/v0/b/avaliakids.firebasestorage.app/o/evaluation-icon.png?alt=media"
            style={styles.iconImage}
            contentFit="contain"
            cachePolicy="none"
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
    marginTop: -200,
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
