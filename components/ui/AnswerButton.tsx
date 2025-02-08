import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface AnswerButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}

export default function AnswerButton({ label, onPress, style }: AnswerButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1B3C87',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
