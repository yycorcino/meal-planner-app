import React, { useState } from 'react'; // imports
import { SearchBar } from 'react-native-elements';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
  FlatList,
  StatusBar,
} from 'react-native';

// temporary default meals
const MealsScreen = () => { 
  const [modalVisible, setModalVisible] = useState(false);
  const [mealName, setMealName] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [meals, setMeals] = useState([
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
    // Add more default meals for demonstration
  ]);

  const addMeal = () => {
    if (mealName.trim() === '') {
      Alert.alert('Enter a meal name'); // if the user didn't enter anything
      return;
    }
    // adds the new meals to the list
    setMeals(prev => [
      ...prev,
      { id: Date.now().toString(), title: mealName },
    ]);
    // clears input and closes modal
    setMealName('');
    setModalVisible(false);
  };

  const Item = ({ title }: { title: string }) => (
    <View style={styles.item}>
      <Text style={[styles.title, { opacity: 0.45 }]}>{title}</Text>
    </View>
  );

  // Filter meals based on search query
  const filteredMeals = meals.filter(meal => 
    meal.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <SearchBar
        placeholder="Search Meals..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchInputContainer}
      />

      <FlatList
        data={filteredMeals} // Use the filtered meals for rendering
        renderItem={({ item }) => <Item title={item.title} />}
        keyExtractor={item => item.id}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />

      {/* Button Container */}
      <View style={styles.buttonContainer}>
        <Pressable style={[styles.button, styles.buttonOpen]} onPress={() => setModalVisible(true)}>
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
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter Meal Name:</Text>
            <TextInput
              style={[styles.input, { textAlign: 'center' }]} // Center the text
              placeholder="e.g. Spaghetti"
              placeholderTextColor="#808080"
              value={mealName}
              onChangeText={setMealName}
            />
            <View style={styles.buttonContainerHorizontal}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={addMeal}>
                <Text style={styles.textStyle}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styling
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
  list: {
    flex: 1, // Allows FlatList to take up remaining space
  },
  title: {                      
    fontSize: 30,
    fontWeight: 'normal',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#000000',
  },
  item: {                       
    backgroundColor: '#d3d3d3',
    marginVertical: 2,          
    marginHorizontal: 10,      
    borderRadius: 1,            
    flex: 1,
    alignItems: 'center',
    padding: 10,            
    height: 80,
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
  buttonContainer: {
    padding: 10, 
    justifyContent: 'flex-end',
    alignItems: 'center', 
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