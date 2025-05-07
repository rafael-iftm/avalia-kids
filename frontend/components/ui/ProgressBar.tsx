import { View, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress: number; // Progresso em % (0 a 100)
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.progress, { width: `${progress}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 10,
  },
  progress: {
    height: '100%',
    backgroundColor: '#FFAC37',
    borderRadius: 3,
  },
});