import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { routes } from '../../routes';

interface IconButton {
  name: 'settings-outline' | 'arrow-back-outline' | 'log-out-outline';
  route?: (typeof routes)[keyof typeof routes];
  onPress?: () => void;
}

interface CustomHeaderBarProps {
  leftIcon?: IconButton;
  rightIcon?: IconButton;
  title?: string;
}

export default function CustomHeaderBar({ leftIcon, rightIcon, title }: CustomHeaderBarProps) {
  const router = useRouter();

  const handleIconPress = (icon?: IconButton) => {
    if (icon?.onPress) {
      icon.onPress();
    } else if (icon?.route) {
      router.push(icon.route);
    }
  };

  return (
    <View style={styles.header}>
      {/* Ícone esquerdo ou placeholder invisível */}
      <View style={styles.iconContainer}>
        {leftIcon ? (
          <TouchableOpacity onPress={() => handleIconPress(leftIcon)}>
            <Ionicons name={leftIcon.name} size={28} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <Ionicons name="settings-outline" size={28} color="transparent" style={styles.placeholder} />
        )}
      </View>

      {/* Título centralizado */}
      <View style={styles.titleContainer}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
      </View>

      {/* Ícone direito ou placeholder invisível */}
      <View style={styles.iconContainer}>
        {rightIcon ? (
          <TouchableOpacity onPress={() => handleIconPress(rightIcon)}>
            <Ionicons name={rightIcon.name} size={28} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <Ionicons name="settings-outline" size={28} color="transparent" style={styles.placeholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: '#1B3C87',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 40, // Espaço reservado para o ícone, garantindo consistência
    alignItems: 'center',
  },
  placeholder: {
    opacity: 0, // Placeholder invisível, mas ocupa o espaço
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
