import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '../styles/globalStyles';
import StorageService from '../utils/StorageService';

const ManageItemsScreen = () => {
  const [homeFoods, setHomeFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activeTab, setActiveTab] = useState('foods'); // 'foods' or 'restaurants'
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await StorageService.initializeData();
      const [foodsList, restaurantsList] = await Promise.all([
        StorageService.getHomeFoods(),
        StorageService.getRestaurants(),
      ]);
      setHomeFoods(foodsList);
      setRestaurants(restaurantsList);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItemText.trim()) {
      Alert.alert('Invalid Input', 'Please enter a valid item name');
      return;
    }

    const itemName = newItemText.trim();
    let success = false;

    try {
      if (activeTab === 'foods') {
        success = await StorageService.addHomeFood(itemName);
        if (success) {
          const updatedFoods = await StorageService.getHomeFoods();
          setHomeFoods(updatedFoods);
        }
      } else {
        success = await StorageService.addRestaurant(itemName);
        if (success) {
          const updatedRestaurants = await StorageService.getRestaurants();
          setRestaurants(updatedRestaurants);
        }
      }

      if (success) {
        setNewItemText('');
        setShowAddModal(false);
        Alert.alert('Success', `${itemName} has been added!`);
      } else {
        Alert.alert('Already Exists', `${itemName} is already in the list`);
      }
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add item');
    }
  };

  const handleRemoveItem = (item) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove "${item}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => confirmRemoveItem(item),
        },
      ]
    );
  };

  const confirmRemoveItem = async (item) => {
    try {
      let success = false;

      if (activeTab === 'foods') {
        success = await StorageService.removeHomeFood(item);
        if (success) {
          const updatedFoods = await StorageService.getHomeFoods();
          setHomeFoods(updatedFoods);
        }
      } else {
        success = await StorageService.removeRestaurant(item);
        if (success) {
          const updatedRestaurants = await StorageService.getRestaurants();
          setRestaurants(updatedRestaurants);
        }
      }

      if (success) {
        Alert.alert('Success', `${item} has been removed!`);
      }
    } catch (error) {
      console.error('Error removing item:', error);
      Alert.alert('Error', 'Failed to remove item');
    }
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will reset both food and restaurant lists to default values. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: confirmResetData,
        },
      ]
    );
  };

  const confirmResetData = async () => {
    try {
      await StorageService.clearAllData();
      await loadData();
      Alert.alert('Success', 'All data has been reset to defaults!');
    } catch (error) {
      console.error('Error resetting data:', error);
      Alert.alert('Error', 'Failed to reset data');
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Text style={styles.itemText}>{item}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const currentList = activeTab === 'foods' ? homeFoods : restaurants;
  const currentTitle = activeTab === 'foods' ? 'Home Foods' : 'Restaurants';

  if (loading) {
    return (
      <View style={globalStyles.centeredContainer}>
        <Text style={globalStyles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[globalStyles.container, { paddingBottom: 90 }]}>
      <View style={styles.header}>
        <Text style={globalStyles.title}>⚙️ Manage Items</Text>
        <Text style={globalStyles.subtitle}>
          Customize your food and restaurant lists
        </Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'foods' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('foods')}
        >
          <Ionicons
            name="home"
            size={20}
            color={activeTab === 'foods' ? colors.primary : colors.accent}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'foods' && styles.activeTabText,
            ]}
          >
            Home Foods
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'restaurants' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('restaurants')}
        >
          <Ionicons
            name="restaurant"
            size={20}
            color={activeTab === 'restaurants' ? colors.primary : colors.accent}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'restaurants' && styles.activeTabText,
            ]}
          >
            Restaurants
          </Text>
        </TouchableOpacity>
      </View>

      {/* Add Button */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[globalStyles.button, globalStyles.successButton]}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={globalStyles.buttonText}>
            Add New {activeTab === 'foods' ? 'Food' : 'Restaurant'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Items List */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            {currentTitle} ({currentList.length} items)
          </Text>
        </View>

        {currentList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name={activeTab === 'foods' ? 'restaurant-outline' : 'storefront-outline'}
              size={60}
              color={colors.accent}
            />
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        ) : (
          <FlatList
            data={currentList}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Reset Button */}
      <View style={styles.resetContainer}>
        <TouchableOpacity
          style={[globalStyles.button, globalStyles.dangerButton]}
          onPress={handleResetData}
        >
          <Text style={globalStyles.buttonText}>Reset All Data</Text>
        </TouchableOpacity>
      </View>

      {/* Add Item Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Add New {activeTab === 'foods' ? 'Food' : 'Restaurant'}
            </Text>

            <TextInput
              style={globalStyles.input}
              placeholder={`Enter ${activeTab === 'foods' ? 'food' : 'restaurant'} name`}
              placeholderTextColor={colors.darkGray}
              value={newItemText}
              onChangeText={setNewItemText}
              autoFocus={true}
              maxLength={30}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[globalStyles.button, styles.modalButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={globalStyles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  globalStyles.button,
                  globalStyles.successButton,
                  styles.modalButton,
                ]}
                onPress={handleAddItem}
              >
                <Text style={globalStyles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 25,
    backgroundColor: colors.secondary,
    padding: 5,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: colors.accent,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
  },
  activeTabText: {
    color: colors.primary,
  },
  actionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listHeader: {
    marginBottom: 15,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.accent,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: colors.white,
    fontWeight: '500',
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: colors.darkGray,
    marginTop: 10,
  },
  resetContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 30,
    margin: 20,
    minWidth: 300,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.accent,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 0.45,
    minWidth: 0,
  },
});

export default ManageItemsScreen;
