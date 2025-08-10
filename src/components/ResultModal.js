import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
  Dimensions,
} from 'react-native';
import { colors, dimensions } from '../styles/globalStyles';

const ResultModal = ({ 
  visible, 
  result, 
  title = "🎉 Result:", 
  onSpinAgain, 
  fadeAnim, 
  scaleAnim 
}) => {
  if (!visible || !result) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onSpinAgain}
    >
      <Animated.View
        style={[
          styles.modalOverlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.resultContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.resultTitle}>{title}</Text>
          <Text style={styles.resultText}>{result}</Text>
          <TouchableOpacity
            style={styles.spinAgainButton}
            onPress={onSpinAgain}
          >
            <Text style={styles.buttonText}>Spin Again</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  resultContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 15,
    width: '90%',
    maxWidth: 350,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 15,
    textAlign: 'center',
  },
  resultText: {
    fontSize: Math.min(36, dimensions.width * 0.08),
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 25,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    lineHeight: Math.min(42, dimensions.width * 0.095),
  },
  spinAgainButton: {
    backgroundColor: colors.success,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ResultModal;
