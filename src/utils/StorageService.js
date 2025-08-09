import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  HOME_FOODS: '@home_foods',
  RESTAURANTS: '@restaurants',
};

// Default data
const DEFAULT_HOME_FOODS = [
  'Pizza', 'Pasta', 'Salad', 'Sandwich', 'Soup', 'Rice Bowl', 
  'Stir Fry', 'Tacos', 'Burger', 'Sushi', 'Curry', 'Omelet',
  'Grilled Chicken', 'Fish', 'Steak', 'Vegetables'
];

const DEFAULT_RESTAURANTS = [
  'McDonald\'s', 'Pizza Hut', 'KFC', 'Subway', 'Burger King',
  'Taco Bell', 'Domino\'s', 'Starbucks', 'Chinese Restaurant',
  'Italian Restaurant', 'Mexican Restaurant', 'Thai Restaurant',
  'Indian Restaurant', 'Sushi Bar', 'Steakhouse', 'Local Diner'
];

class StorageService {
  // Initialize default data if not exists
  static async initializeData() {
    try {
      const homefoods = await AsyncStorage.getItem(STORAGE_KEYS.HOME_FOODS);
      const restaurants = await AsyncStorage.getItem(STORAGE_KEYS.RESTAURANTS);

      if (!homefoods) {
        await AsyncStorage.setItem(STORAGE_KEYS.HOME_FOODS, JSON.stringify(DEFAULT_HOME_FOODS));
      }

      if (!restaurants) {
        await AsyncStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(DEFAULT_RESTAURANTS));
      }
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  }

  // Get home foods
  static async getHomeFoods() {
    try {
      const foods = await AsyncStorage.getItem(STORAGE_KEYS.HOME_FOODS);
      return foods ? JSON.parse(foods) : DEFAULT_HOME_FOODS;
    } catch (error) {
      console.error('Error getting home foods:', error);
      return DEFAULT_HOME_FOODS;
    }
  }

  // Get restaurants
  static async getRestaurants() {
    try {
      const restaurants = await AsyncStorage.getItem(STORAGE_KEYS.RESTAURANTS);
      return restaurants ? JSON.parse(restaurants) : DEFAULT_RESTAURANTS;
    } catch (error) {
      console.error('Error getting restaurants:', error);
      return DEFAULT_RESTAURANTS;
    }
  }

  // Add home food
  static async addHomeFood(food) {
    try {
      const foods = await this.getHomeFoods();
      if (!foods.includes(food)) {
        foods.push(food);
        await AsyncStorage.setItem(STORAGE_KEYS.HOME_FOODS, JSON.stringify(foods));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding home food:', error);
      return false;
    }
  }

  // Add restaurant
  static async addRestaurant(restaurant) {
    try {
      const restaurants = await this.getRestaurants();
      if (!restaurants.includes(restaurant)) {
        restaurants.push(restaurant);
        await AsyncStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(restaurants));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding restaurant:', error);
      return false;
    }
  }

  // Remove home food
  static async removeHomeFood(food) {
    try {
      const foods = await this.getHomeFoods();
      const filteredFoods = foods.filter(item => item !== food);
      await AsyncStorage.setItem(STORAGE_KEYS.HOME_FOODS, JSON.stringify(filteredFoods));
      return true;
    } catch (error) {
      console.error('Error removing home food:', error);
      return false;
    }
  }

  // Remove restaurant
  static async removeRestaurant(restaurant) {
    try {
      const restaurants = await this.getRestaurants();
      const filteredRestaurants = restaurants.filter(item => item !== restaurant);
      await AsyncStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(filteredRestaurants));
      return true;
    } catch (error) {
      console.error('Error removing restaurant:', error);
      return false;
    }
  }

  // Update home foods list
  static async updateHomeFoods(foods) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HOME_FOODS, JSON.stringify(foods));
      return true;
    } catch (error) {
      console.error('Error updating home foods:', error);
      return false;
    }
  }

  // Update restaurants list
  static async updateRestaurants(restaurants) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(restaurants));
      return true;
    } catch (error) {
      console.error('Error updating restaurants:', error);
      return false;
    }
  }

  // Clear all data (reset to defaults)
  static async clearAllData() {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HOME_FOODS, JSON.stringify(DEFAULT_HOME_FOODS));
      await AsyncStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(DEFAULT_RESTAURANTS));
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
}

export default StorageService;
