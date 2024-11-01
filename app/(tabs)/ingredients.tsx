import React, { useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  FlatList,
  StatusBar,
  TextInput,
} from 'react-native';
import { SearchBar } from 'react-native-elements';

const IngredientsScreen = () => {
  const [displayVisible, setDisplayVisible] = useState(false);
  const [modalData, setModalData] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [ingredientName, setIngredientName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [ingredients, setIngredients] = useState([
    { id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba', title: 'Carrot' },
    { id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63', title: 'Onion' },
    { id: '58694a0f-3da1-471f-bd96-145571e29d72', title: 'Beef' },
    { id: '5ac68afc-c605-48d3-a4f8-fbd91aa97f64', title: 'Black Beans' },
  ]);
  const [isEditing, setIsEditing] = useState(false);
  //functions
  const addIngredient = () => {
    if (ingredientName.trim() === '') {
      Alert.alert('Enter ingredient name');
      return;
    }
    //adds the new ingredient to the list
    setIngredients(prev => [
      ...prev,
      { id: Date.now().toString(), title: ingredientName },
    ]);
    //clears input and closes modal
    setIngredientName('');
    setModalVisible(false);
  };

  const doNothing = () => {
    console.log('meal opened');

    //Placeholder function for opening link to meal
};

  const viewIngredient = (title: React.SetStateAction<string>, id: React.SetStateAction<string>) => { 
    setModalTitle(title);
    setModalData(id);
    setDisplayVisible(true);
  };

  const editIngredient = () => {
    setIsEditing(true);
    setIngredientName(modalTitle);
  };

  const saveEdit = () => {
    setIngredients(prev =>
      prev.map(ingredient =>
        ingredient.id === modalData ? { ...ingredient, title: ingredientName } : ingredient
      )
    );
    setIsEditing(false);
    setDisplayVisible(false);
    setIngredientName('');
  };

  const deleteIngredient = () => {
    setIngredients(prev => prev.filter(ingredient => ingredient.id !== modalData));
    setDisplayVisible(false);
  };
  //filter ingredients based on user search
  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  //page container
  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search ingredients..."
        onChangeText={setSearchQuery} //ignore the error
        value={searchQuery}
        platform="default"
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchInputContainer}
      />

      <FlatList
        data={filteredIngredients}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => viewIngredient(item.title, item.id)}>
            <Text style={styles.textStyle}>{item.title}</Text>
          </Pressable>
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />

      <Pressable style={[styles.button, styles.buttonOpen]} onPress={() => setModalVisible(true)}>
        <Text style={styles.plusButtonText}>+</Text>
      </Pressable>

      <Modal animationType="slide" transparent={true} visible={displayVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {isEditing ? (
              <>
                <Text>Edit Ingredient Name:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter new name"
                  value={ingredientName}
                  onChangeText={setIngredientName}
                />
                <Pressable style={styles.saveButton} onPress={saveEdit}>
                  <Text style={styles.textStyle}>Save</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text>{modalTitle}</Text>
                <Pressable style={styles.editButton} onPress={editIngredient}>
                  <Text style={styles.textStyle}>Edit</Text>
                </Pressable>
                <Pressable style={styles.deleteButton} onPress={deleteIngredient}>
                  <Text style={styles.textStyle}>Delete</Text>
                </Pressable>
              </>
            )}
            <Pressable style={styles.cancelButton} onPress={() => setDisplayVisible(false)}>

              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter Ingredient Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. avocados"
              value={ingredientName}
              onChangeText={setIngredientName}
            />
            <Pressable style={styles.saveButton} onPress={addIngredient}>
              <Text style={styles.textStyle}>Save</Text>
            </Pressable>
            <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

//styling
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
    backgroundColor: '#D3D3D3',
    borderRadius: 5,
  },
  item: {
    backgroundColor: '#92de92',
    marginVertical: 0.7,
    marginHorizontal: 0.7,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    padding: 20,
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
    borderRadius: 0,
    padding: 4,
    marginVertical: 0,
    height: 48,
  },
  buttonOpen: {
    backgroundColor: '#36454F',
  },
  saveButton: {
    backgroundColor: '#36454F',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#36454F',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: '100%',
  },
  buttonClose: {
    backgroundColor: '#36454F',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'normal',
    textAlign: 'center',
    fontSize: 20,
  },
  plusButtonText: {
    color: 'white',
    fontWeight: '200',
    textAlign: 'center',
    fontSize: 42,
    marginTop: -7,
  },
  modalText: {
    marginBottom: 25,
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: '#36454F',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: '100%',
  },
  deleteButton: {
    backgroundColor: '#36454F',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: '100%',
  },
});

export default IngredientsScreen;
