import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import HomeRouletteScreen from './src/screens/HomeRouletteScreen';
import RestaurantRouletteScreen from './src/screens/RestaurantRouletteScreen';
import ManageItemsScreen from './src/screens/ManageItemsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <StatusBar style="light" backgroundColor="#1a1a2e" />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home Foods') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Restaurants') {
                  iconName = focused ? 'restaurant' : 'restaurant-outline';
                } else if (route.name === 'Manage') {
                  iconName = focused ? 'settings' : 'settings-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#FFD700',
              tabBarInactiveTintColor: '#888',
              tabBarStyle: {
                backgroundColor: '#16213e',
                borderTopColor: '#FFD700',
                borderTopWidth: 1,
                height: 70,
                paddingBottom: 10,
                paddingTop: 10,
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
              },
              headerStyle: {
                backgroundColor: '#1a1a2e',
              },
              headerTintColor: '#FFD700',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20,
              },
            })}
          >
            <Tab.Screen name="Home Foods" component={HomeRouletteScreen} />
            <Tab.Screen name="Restaurants" component={RestaurantRouletteScreen} />
            <Tab.Screen name="Manage" component={ManageItemsScreen} />
          </Tab.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
});
