import React, { useState } from 'react'; //imports
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

//some example items. Will get rid of this but wanted to discuss how it should look when there is no user input, not sure if it should just be blank
const IngredientsScreen = () => { 
  const [modalVisible, setModalVisible] = useState(false);
  const [ingredientName, setIngredientName] = useState('');
  const [ingredients, setIngredients] = useState([
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'Carrot',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Onion',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Beef',
    },
    {
      id: '5ac68afc-c605-48d3-a4f8-fbd91aa97f64',
      title: 'Black Beans',
    },
  ]);

  const addIngredient = () => {
    if (ingredientName.trim() === '') {
      Alert.alert('Enter ingredient name'); //if the user didnt enter anything
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

  const Item = ({ title }: { title: string }) => (
    <View style={styles.item}>
      <Text style={[styles.title, { opacity: 0.45 }]}>{title}</Text>
    </View>
  );

  return ( //container is basically what holds everything together, like what the user will see
    <View style={styles.container}>
      <Pressable style={[styles.button, styles.buttonOpen]} onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>Add Ingredient</Text>
      </Pressable>

      <FlatList //displays the ingredients
        data={ingredients}
        renderItem={({ item }) => <Item title={item.title} />}
        keyExtractor={item => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={true}
      />

      {}
      <Modal //slide animation for the modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter Ingredient Name:</Text>
            <TextInput //user can enter text
              style={styles.input}
              placeholder="e.g. avocados"
              placeholderTextColor="#808080"
              value={ingredientName}
              onChangeText={setIngredientName}
            />
            <Pressable //for user to add ingredient
              style={[styles.button, styles.buttonClose]}
              onPress={addIngredient}>
              <Text style={styles.textStyle}>Save</Text>
            </Pressable>
            <Pressable //for user to close the popup
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

//Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#F0EAD6',
  },
  title: {
    fontSize: 14,
    fontWeight: 'normal',
    marginBottom: 140,
    color: '#000000',
  },
  item: {
    backgroundColor: '#d3d3d3',
    marginVertical: 1,
    marginHorizontal: 1,
    borderRadius: 7,
    flex: 1,
    alignItems: 'center',
    padding: 19,
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
    borderRadius: 21,
    padding: 18,
    marginVertical: 3,
  },
  buttonOpen: {
    backgroundColor: '#36454F',
  },
  buttonClose: {
    backgroundColor: '#36454F',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 25,
    textAlign: 'center',
  },
});
export default IngredientsScreen;