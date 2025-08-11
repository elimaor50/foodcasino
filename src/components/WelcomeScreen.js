import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AppLogo } from './AppLogo';
import { colors } from '../styles/globalStyles';

export const WelcomeScreen = ({ onGetStarted }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <AppLogo size={200} />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Welcome to Food Casino!</Text>
        <Text style={styles.subtitle}>
          🎰 Spin the roulette wheel to decide what to eat
        </Text>
        <Text style={styles.description}>
          Can't decide what to cook at home or where to go out? 
          Let the casino roulette choose for you! Add your favorite 
          foods and restaurants, then spin to let luck decide your meal.
        </Text>
        
        <TouchableOpacity style={styles.getStartedButton} onPress={onGetStarted}>
          <Text style={styles.buttonText}>🎲 Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    marginBottom: 40,
  },
  contentContainer: {
    alignItems: 'center',
    maxWidth: 350,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  getStartedButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
});
