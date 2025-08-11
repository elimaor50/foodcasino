import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppLogo } from './AppLogo';
import { colors } from '../styles/globalStyles';

export const LogoHeader = ({ title, subtitle, logoSize = 60, showTitle = true }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <AppLogo size={logoSize} />
      </View>
      {showTitle && (
        <View style={styles.textContainer}>
          <Text style={styles.title}>Food Casino</Text>
          {title && <Text style={styles.subtitle}>{title}</Text>}
          {subtitle && <Text style={styles.description}>{subtitle}</Text>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logoContainer: {
    marginBottom: 15,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
