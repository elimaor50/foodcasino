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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '../styles/globalStyles';
import RouletteWheel from '../components/RouletteWheel';
import StorageService from '../utils/StorageService';

const RestaurantRouletteScreen = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const rouletteRef = useRef();

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurant) {
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
  }, [selectedRestaurant]);

  const loadRestaurants = async () => {
    try {
      await StorageService.initializeData();
      const restaurantList = await StorageService.getRestaurants();
      setRestaurants(restaurantList);
    } catch (error) {
      console.error('Error loading restaurants:', error);
      Alert.alert('Error', 'Failed to load restaurant items');
    } finally {
      setLoading(false);
    }
  };

  const handleSpinComplete = (restaurant) => {
    setSelectedRestaurant(restaurant);
    // Vibrate or play sound here if needed
  };

  const handleSpin = () => {
    if (restaurants.length === 0) {
      Alert.alert('No Restaurants Available', 'Please add some restaurants first in the Manage tab.');
      return;
    }
    setSelectedRestaurant(null);
    if (rouletteRef.current) {
      rouletteRef.current.spin();
    }
  };

  const resetResult = () => {
    setSelectedRestaurant(null);
  };

  if (loading) {
    return (
      <View style={globalStyles.centeredContainer}>
        <Text style={globalStyles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={globalStyles.title}>🍽️ Restaurant Casino</Text>
        <Text style={globalStyles.subtitle}>
          Spin the wheel to choose where to dine out!
        </Text>
      </View>

      {restaurants.length === 0 ? (
        <View style={globalStyles.centeredContainer}>
          <Ionicons name="storefront-outline" size={80} color={colors.accent} />
          <Text style={[globalStyles.subtitle, { marginTop: 20 }]}>
            No restaurants available
          </Text>
          <Text style={[globalStyles.text, { textAlign: 'center', margin: 20 }]}>
            Go to the Manage tab to add some restaurants to the wheel
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.rouletteContainer}>
            <RouletteWheel
              ref={rouletteRef}
              items={restaurants}
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

            {selectedRestaurant && (
              <Animated.View
                style={[
                  styles.resultContainer,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                <Text style={styles.resultTitle}>🎉 Let's go to:</Text>
                <Text style={styles.resultRestaurant}>{selectedRestaurant}</Text>
                <TouchableOpacity
                  style={[globalStyles.button, { backgroundColor: colors.success }]}
                  onPress={resetResult}
                >
                  <Text style={globalStyles.buttonText}>Spin Again</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>

          <View style={styles.statsContainer}>
            <View style={globalStyles.card}>
              <Text style={globalStyles.accentText}>Available Restaurants: {restaurants.length}</Text>
              <View style={styles.restaurantsList}>
                {restaurants.slice(0, 6).map((restaurant, index) => (
                  <Text key={index} style={styles.restaurantItem}>
                    • {restaurant}
                  </Text>
                ))}
                {restaurants.length > 6 && (
                  <Text style={styles.restaurantItem}>
                    ... and {restaurants.length - 6} more
                  </Text>
                )}
              </View>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Add extra padding for tab bar
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  rouletteContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  controlsContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  resultContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 25,
    margin: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 10,
    textAlign: 'center',
  },
  resultRestaurant: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  restaurantsList: {
    marginTop: 10,
  },
  restaurantItem: {
    color: colors.white,
    fontSize: 14,
    marginBottom: 5,
  },
});

export default RestaurantRouletteScreen;
