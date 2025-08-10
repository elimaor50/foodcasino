import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const colors = {
  primary: '#1a1a2e',
  secondary: '#16213e',
  accent: '#FFD700',
  success: '#0eac69',
  danger: '#e53e3e',
  white: '#ffffff',
  lightGray: '#f5f5f5',
  darkGray: '#888888',
  rouletteRed: '#d62c2c',
  rouletteBlack: '#2c2c2c',
  rouletteGreen: '#0eac69',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.accent,
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: colors.secondary,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 15,
  },
  button: {
    backgroundColor: colors.accent,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    minWidth: 200,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dangerButton: {
    backgroundColor: colors.danger,
  },
  successButton: {
    backgroundColor: colors.success,
  },
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 15,
    padding: 20,
    margin: 15,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    margin: 10,
    fontSize: 16,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  text: {
    color: colors.white,
    fontSize: 16,
  },
  accentText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
});

export const dimensions = {
  width,
  height,
  rouletteSize: Math.min(width * 0.75, height * 0.35), // More responsive roulette size
  isSmallScreen: height < 700,
  isTallScreen: height > 800,
};
