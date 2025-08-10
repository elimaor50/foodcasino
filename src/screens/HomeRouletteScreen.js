import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { globalStyles, colors, dimensions } from '../styles/globalStyles';
import RouletteWheel from '../components/RouletteWheel';
import StorageService from '../utils/StorageService';

const HomeRouletteScreen = () => {
  const [homeFoods, setHomeFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const rouletteRef = useRef();

  useEffect(() => {
    loadHomeFoods();
  }, []);

  // REFRESH WHEN TAB CHANGES - FIXES THE REFRESH ISSUE
  useFocusEffect(
    React.useCallback(() => {
      loadHomeFoods();
      setSelectedFood(null); // Reset result when switching tabs
    }, [])
  );

  useEffect(() => {
    if (selectedFood) {
      // Animate result display
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 150,
          friction: 8,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      fadeAnim.setValue(0);
    }
  }, [selectedFood]);

  const loadHomeFoods = async () => {
    try {
      await StorageService.initializeData();
      const foods = await StorageService.getHomeFoods();
      setHomeFoods(foods);
    } catch (error) {
      console.error('Error loading home foods:', error);
      Alert.alert('Error', 'Failed to load food items');
    } finally {
      setLoading(false);
    }
  };

  const handleSpinComplete = (food) => {
    setSelectedFood(food);
    // Vibrate or play sound here if needed
  };

  const handleSpin = () => {
    if (homeFoods.length === 0) {
      Alert.alert('No Foods Available', 'Please add some food items first in the Manage tab.');
      return;
    }
    setSelectedFood(null);
    if (rouletteRef.current) {
      rouletteRef.current.spin();
    }
  };

  const resetResult = () => {
    setSelectedFood(null);
  };

  if (loading) {
    return (
      <View style={globalStyles.centeredContainer}>
        <Text style={globalStyles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.mainContainer}>
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={globalStyles.title}>🏠 Home Food Casino</Text>
            <Text style={globalStyles.subtitle}>
              Spin the wheel to decide what to cook at home!
            </Text>
          </View>

          {homeFoods.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="restaurant-outline" size={80} color={colors.accent} />
              <Text style={[globalStyles.subtitle, { marginTop: 20 }]}>
                No food items available
              </Text>
              <Text style={[globalStyles.text, { textAlign: 'center', margin: 20 }]}>
                Go to the Manage tab to add some food items to the wheel
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.rouletteContainer}>
                <RouletteWheel
                  ref={rouletteRef}
                  items={homeFoods}
                  onSpinComplete={handleSpinComplete}
                  isSpinning={isSpinning}
                  setIsSpinning={setIsSpinning}
                />
              </View>

              <View style={styles.controlsContainer}>
                <TouchableOpacity
                  style={[
                    globalStyles.button,
                    isSpinning && styles.disabledButton,
                  ]}
                  onPress={handleSpin}
                  disabled={isSpinning}
                >
                  <Text style={globalStyles.buttonText}>
                    {isSpinning ? '🎰 Spinning...' : '🎯 SPIN THE WHEEL!'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.statsContainer}>
                <View style={globalStyles.card}>
                  <Text style={globalStyles.accentText}>Available Foods: {homeFoods.length}</Text>
                  <View style={styles.foodsList}>
                    {homeFoods.slice(0, 6).map((food, index) => (
                      <Text key={index} style={styles.foodItem}>
                        • {food}
                      </Text>
                    ))}
                    {homeFoods.length > 6 && (
                      <Text style={styles.foodItem}>
                        ... and {homeFoods.length - 6} more
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </>
          )}
        </ScrollView>

        {/* Result Modal - Positioned absolutely to center on screen */}
        {selectedFood && (
          <Animated.View
            style={[
              styles.resultModal,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Backdrop - tap to dismiss */}
            <TouchableOpacity 
              style={styles.modalBackdrop}
              onPress={resetResult}
              activeOpacity={1}
            />
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>🎉 Time to cook:</Text>
              <Text style={styles.resultFood}>{selectedFood}</Text>
              <TouchableOpacity
                style={[globalStyles.button, { backgroundColor: colors.success }]}
                onPress={resetResult}
              >
                <Text style={globalStyles.buttonText}>Spin Again</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120, // Extra space for tab bar
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    minHeight: dimensions.height * 0.6,
  },
  rouletteContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  controlsContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  disabledButton: {
    opacity: 0.6,
  },
  // Result Modal - Absolutely positioned and centered
  resultModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    paddingHorizontal: 20,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)', // Semi-transparent overlay
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
  resultFood: {
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
  statsContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  foodsList: {
    marginTop: 10,
  },
  foodItem: {
    color: colors.white,
    fontSize: 14,
    marginBottom: 5,
  },
});

export default HomeRouletteScreen;
