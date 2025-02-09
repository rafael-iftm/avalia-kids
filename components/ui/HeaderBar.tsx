import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface HeaderBarProps {
  onSettingsPress?: () => void;
  onLogoutPress?: () => void;
}

export default function HeaderBar({ onSettingsPress, onLogoutPress }: HeaderBarProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onSettingsPress || (() => router.push('/settings'))}>
        <Ionicons name="settings-outline" size={28} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onLogoutPress || (() => router.push('/login'))}>
        <Ionicons name="log-out-outline" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    backgroundColor: '#1B3C87',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});
