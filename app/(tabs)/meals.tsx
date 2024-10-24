import React, { useState } from 'react';
import { SearchBar } from 'react-native-elements';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
  StatusBar,
} from 'react-native';
import MealList from '../../components/MealList'; // MealList component

interface Meal {
  id: string;
  title: string;
}

const MealsScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [mealName, setMealName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [meals, setMeals] = useState<Meal[]>([
    {
      id: 'default_meal_chili',
      title: 'Chili',
    },
    {
      id: 'default_meal_pasta',
      title: 'Pasta',
    },
    {
      id: 'default_meal_salad',
      title: 'Salad',
    },
  ]);

  const addMeal = () => {
    if (mealName.trim() === '') {
      Alert.alert('Enter a meal name');
      return;
    }
    setMeals((prev) => [
      ...prev,
      { id: Date.now().toString(), title: mealName },
    ]);
    setMealName('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search Meals..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchInputContainer}
      />

      <MealList meals={meals} searchQuery={searchQuery} />
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.textStyle}>Add Meal</Text>
        </Pressable>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter Meal Name:</Text>
            <TextInput
              style={[styles.input, { textAlign: 'center' }]}
              placeholder="e.g. Spaghetti"
              placeholderTextColor="#808080"
              value={mealName}
              onChangeText={setMealName}
            />
            <View style={styles.buttonContainerHorizontal}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={addMeal}
              >
                <Text style={styles.textStyle}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#F0EAD6',
  },
  searchBarContainer: {
    backgroundColor: '#F0EAD6',
    borderBottomWidth: 0,
    borderTopWidth: 0,
    marginBottom: 10,
  },
  searchInputContainer: {
    backgroundColor: '#d3d3d3',
  },
  buttonContainer: {
    padding: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    borderRadius: 21,
    padding: 18,
    marginVertical: 3,
    width: '45%',
  },
  buttonOpen: {
    backgroundColor: '#36454F',
    justifyContent: 'flex-end',
  },
  buttonClose: {
    backgroundColor: '#36454F',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 21,
    padding: 35,
    alignItems: 'center',
    height: 250,
    width: 300,
    justifyContent: 'space-evenly',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    width: '100%',
    paddingHorizontal: 10,
  },
  buttonContainerHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 25,
    textAlign: 'center',
    fontSize: 24,
  },
});

export default MealsScreen;