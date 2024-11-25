import React, { useState } from "react";
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
  ScrollView,
} from "react-native";
import { SearchBar } from "react-native-elements";

interface Meal {
  meal_id: number;
  name: string;
  details: string;
  ingredients: string[];
  quantities: string[];
}


const MealsScreen = () => {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [mealName, setMealName] = useState("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [mealDescription, setMealDescription] = useState("");
  const [ingredients, setIngredients] = useState(["Best Ingredient", "2nd Best Ingredient"]);
  const [quantities, setQuantities] = useState(["1 cup", "1 cup"]);
  const [filteredIngredients, setFilteredIngredients] = useState(ingredients);
  const [ingredientSearchQuery, setIngredientSearchQuery] = useState("");

  const addMeal = () => {
    if (mealName.trim() === "") {
      Alert.alert("Enter a meal name");
      return;
    }
    const newMeal: Meal = {
      meal_id: meals.length > 0 ? meals[meals.length - 1].meal_id + 1 : 1,
      name: mealName,
      details: "",
      ingredients: [],
      quantities: [],
    };
    setMeals([...meals, newMeal]);
    setMealName("");
    setAddModalVisible(false);
  };  

  const openEditModal = (meal: Meal) => {
    setSelectedMeal(meal);
    setMealName(meal.name);
    setMealDescription(meal.details || "");
    setIngredients(meal.ingredients);
    setQuantities(meal.quantities);
    setFilteredIngredients(meal.ingredients);
    setIngredientSearchQuery("");
    setIsEditing(false);
    setEditModalVisible(true);
  };  

  const saveEdit = () => {
    if (selectedMeal) {
      setMeals((prevMeals) =>
        prevMeals.map((meal) =>
          meal.meal_id === selectedMeal.meal_id
            ? {
                ...meal,
                name: mealName,
                details: mealDescription,
                ingredients: ingredients,
                quantities: quantities,
              }
            : meal
        )
      );
    }
    setEditModalVisible(false);
    setMealName("");
    setMealDescription("");
    setIngredients([]);
    setQuantities([]);
    setIsEditing(false);
  };

  const deleteMeal = () => {
    if (selectedMeal) {
      Alert.alert(
        "Delete Meal",
        "Are you sure you want to delete this meal?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              setMeals((prevMeals) =>
                prevMeals.filter((meal) => meal.meal_id !== selectedMeal.meal_id)
              );
              setEditModalVisible(false);
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search meals..."
        // @ts-ignore
        onChangeText={setSearchQuery}
        value={searchQuery}
        platform="default"
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchInputContainer}
      />
  
      <FlatList
        data={filteredMeals}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => openEditModal(item)}>
            <Text style={styles.textStyle}>{item.name}</Text>
          </Pressable>
        )}
        keyExtractor={(item) => item.meal_id.toString()}
        numColumns={1}
        showsVerticalScrollIndicator={false}
      />
  
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => {
          setMealName("");
          setAddModalVisible(true);
        }}
      >
        <Text style={styles.plusButtonText}>+</Text>
      </Pressable>
  
      {/* Add Meal Modal */}
      <Modal animationType="slide" transparent={true} visible={addModalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalViewSmall}>
            <Text style={styles.modalText}>Enter Meal Name:</Text>
            <TextInput
              style={[styles.input, { textAlign: "center" }]}
              placeholder="e.g. Spaghetti"
              placeholderTextColor="#888888"
              value={mealName}
              onChangeText={setMealName}
            />
            <View style={styles.buttonRowCompact}>
              <Pressable style={styles.addCancelButton} onPress={() => setAddModalVisible(false)}>
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.addSaveButton} onPress={addMeal}>
                <Text style={styles.textStyle}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
  
      {/* Edit/Delete Meal Modal */}
      <Modal animationType="slide" transparent={true} visible={editModalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={[styles.input, styles.titleInput, styles.reducedPadding]}
              placeholder="Meal Name"
              value={mealName}
              onChangeText={setMealName}
              editable={isEditing}
            />
            
            {/* Table Column Headers */}
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeaderText}>Ingredient</Text>
              <Text style={styles.tableHeaderText}>Quantity</Text>
            </View>
  
            {/* Ingredients and Quantities Table */}
            <ScrollView style={styles.tableContainer}>
              <View style={styles.tableRow}>
                {/* Filtered Ingredients */}
                <View style={styles.tableColumn}>
                  {filteredIngredients.map((item, index) => (
                    <Pressable
                      key={`ingredient-${index}`}
                      style={styles.sharedContainer} // Shared style for consistency
                      onPress={() => Alert.alert(`You pressed: ${item}`)}
                    >
                      <Text style={styles.tableText}>{item}</Text>
                    </Pressable>
                  ))}
                </View>

                {/* Editable Quantities */}
                <View style={styles.tableColumn}>
                  {quantities.slice(0, filteredIngredients.length).map((qty, index) => (
                    <TextInput
                      key={`quantity-${index}`}
                      style={[styles.sharedContainer, styles.quantityInput]}
                      value={quantities[index]}
                      editable={isEditing}
                      onChangeText={(text) => {
                        const updatedQuantities = [...quantities];
                        updatedQuantities[index] = text;
                        setQuantities(updatedQuantities);
                      }}
                      placeholder="Enter quantity"
                    />
                  ))}
                </View>
              </View>
            </ScrollView>
            {/* Search Bar for Filtering Ingredients */}
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
              <SearchBar
                placeholder="Search ingredients..."
                // @ts-ignore
                onChangeText={(text) => {
                  setIngredientSearchQuery(text);
                  const filtered = ingredients.filter((ingredient) =>
                    ingredient.toLowerCase().includes(text.toLowerCase())
                  );
                  setFilteredIngredients(filtered);
                }}
                value={ingredientSearchQuery}
                containerStyle={[
                  styles.searchBarContainer,
                  { width: "70%", backgroundColor: "transparent" },
                ]}
                inputContainerStyle={[
                  styles.searchInputContainer,
                  { backgroundColor: "#e3e3e3" },
                ]}
                inputStyle={{ fontSize: 14 }}
              />
              <Pressable
                style={styles.addIngredientButton}
                onPress={() => {
                  if (ingredientSearchQuery.trim() !== "") {
                    const updatedIngredients = [...ingredients, ingredientSearchQuery];
                    const updatedQuantities = [...quantities, "new qty"];
                    setIngredients(updatedIngredients);
                    setQuantities(updatedQuantities);
                    setFilteredIngredients(updatedIngredients);
                    setMeals((prevMeals) =>
                      prevMeals.map((meal) =>
                        meal.meal_id === selectedMeal?.meal_id
                          ? { ...meal, ingredients: updatedIngredients, quantities: updatedQuantities }
                          : meal
                      )
                    );
                    setIngredientSearchQuery("");
                  } else {
                    Alert.alert("Invalid Input", "Please enter an ingredient in the search bar.");
                  }
                }}
              >
                <Text style={styles.addIngredientText}>Add</Text>
              </Pressable>
            </View>
            {/* Description Label */}
            <Text style={styles.descriptionLabel}>Description</Text>
            <ScrollView style={styles.scrollableBox}>
              <TextInput
                multiline
                editable={isEditing}
                placeholder="Meal description here..."
                style={styles.scrollableText}
                placeholderTextColor="#D3D3D3"
                textAlignVertical="top"
                value={mealDescription}
                onChangeText={setMealDescription}
              />
            </ScrollView>
            <View style={styles.buttonRow}>
            <Pressable
              style={styles.cancelButton}
              onPress={() => {
                setEditModalVisible(false);
                setIngredients([]);
                setQuantities([]);
                setFilteredIngredients([]);
                setIngredientSearchQuery("");
              }}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
              {isEditing ? (
                <>
                  <Pressable style={styles.deleteButton} onPress={deleteMeal}>
                    <Text style={styles.textStyle}>Delete</Text>
                  </Pressable>
                  <Pressable style={styles.saveButton} onPress={saveEdit}>
                    <Text style={styles.textStyle}>Save</Text>
                  </Pressable>
                </>
              ) : (
                <Pressable style={styles.editButton} onPress={() => setIsEditing(true)}>
                  <Text style={styles.textStyle}>Edit</Text>
                </Pressable>
              )}
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
    backgroundColor: "#F0EAD6",
  },
  searchBarContainer: {
    backgroundColor: "#F0EAD6",
    borderBottomWidth: 0,
    borderTopWidth: 0,
    marginVertical: 1,
  },
  searchInputContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },  
  item: {
    backgroundColor: "#ADD8E6",
    marginVertical: 0.7,
    marginHorizontal: 0.7,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 21,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: "90%",
    maxHeight: "90%",
  },
  descriptionLabel: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 5,
  },
  modalViewSmall: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 21,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: "65%",
  },
  modalText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    width: "100%",
    paddingHorizontal: 10,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "bold",
    height: 50,
    textAlign: "center",
    borderWidth: 0,
  },
  reducedPadding: {
    marginBottom: 5,
  },
  closeButton: {
    position: "absolute",
    top: 15,
    left: 15,
    padding: 10,
  },
  closeButtonText: {
    color: "red",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    borderRadius: 0,
    padding: 4,
    marginVertical: 0,
    height: 48,
  },
  buttonOpen: {
    backgroundColor: "#36454F",
  },
  cancelButton: {
    backgroundColor: "#36454F",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "30%", 
  },
  saveButton: {
    backgroundColor: "#36454F",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "30%",
  },
  deleteButton: {
    backgroundColor: "#FF6347",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "30%",
  },
  editButton: {
    backgroundColor: "#36454F",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "30%",
  },
  addCancelButton: {
    backgroundColor: "#36454F",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "45%",
  },
  addSaveButton: {
    backgroundColor: "#36454F",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "45%",
  },
  textStyle: {
    color: "white",
    fontWeight: "normal",
    textAlign: "center",
    fontSize: 20,
  },
  plusButtonText: {
    color: "white",
    fontWeight: "200",
    textAlign: "center",
    fontSize: 42,
    marginTop: -7,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 10,
    marginTop: 15,
  },
  buttonRowCompact: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 10,
  },
  frame: {
    height: "40%",
    width: "100%",
    padding: 1,
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 8,
  },
  scrollableBox: {
    height: "30%",
    width: "100%",
    marginTop: 5,
    padding: 5,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 0,
  },
  scrollableText: {
    fontSize: 16,
    color: "#333333",
    padding: 1,
  },
  tableHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  tableContainer: {
    width: "100%",
    height: "auto",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColumn: {
    flex: 1,
    paddingVertical: 5,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  tableText: {
    fontSize: 12,
    paddingVertical: 4,
  },
  modalIngredients: {
    backgroundColor: "#ADD8E6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginVertical: 4,
    alignItems: "center",
  },
  addIngredientButton: {
    backgroundColor: "#36454F",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  addIngredientText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityContainer: {
    backgroundColor: "#ADD8E6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginVertical: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  editableQuantity: {
    backgroundColor: "#ADD8E6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginVertical: 4,
    textAlign: "center",
    color: "black",
    fontSize: 12,
  },
  sharedContainer: {
    backgroundColor: "#ADD8E6",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginVertical: 4,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  quantityInput: {
    textAlign: "center",
    color: "black",
    fontSize: 12,
  },
});

export default MealsScreen;