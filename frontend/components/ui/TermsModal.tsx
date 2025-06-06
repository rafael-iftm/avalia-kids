import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import terms from '@/assets/content/terms.json';

interface Props {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function TermsModal({ visible, onClose, onAccept }: Props) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    if (isBottom) {
      setScrolledToBottom(true);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Termos e Condições de Uso</Text>

          <ScrollView
            style={styles.termsContainer}
            onScroll={handleScroll}
            ref={scrollRef}
            scrollEventThrottle={16}
          >
            <Text style={styles.termsText}>
              {/* Conteúdo fictício de exemplo */}
              {terms.terms}
            </Text>
          </ScrollView>

          <TouchableOpacity
            style={[styles.acceptButton, !scrolledToBottom && styles.buttonDisabled]}
            disabled={!scrolledToBottom}
            onPress={onAccept}
          >
            <Text style={styles.acceptButtonText}>Aceitar e continuar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    height: '75%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  termsContainer: {
    flex: 1,
    marginBottom: 15,
  },
  termsText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  acceptButton: {
    backgroundColor: '#1B3C87',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  acceptButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  cancelButton: {
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#1B3C87',
    textDecorationLine: 'underline',
  },
});
