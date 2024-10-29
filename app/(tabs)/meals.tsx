import React, { useState, useEffect } from "react";
import { SearchBar } from "react-native-elements";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
  StatusBar,
} from "react-native";
import ItemList from "../../components/ItemList";
import { useSQLiteContext } from "expo-sqlite";
import { deleteEntry, getAll, insertEntry } from "@/database/queries";
import { getDateNow } from "@/database/utils";

interface Meal {
  meal_id: number;
  create_at: string;
  update_at: string;
  photo_url: string;
  name: string;
  description: string;
}

const MealsScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newMealName, setNewMealName] = useState<string>(""); // temp store for adding new meals
  const [searchQuery, setSearchQuery] = useState("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const db = useSQLiteContext();

  useEffect(() => {
    const fetchMeals = async () => {
      const fetchedMeals = await getAll(db, "meals");
      setMeals(fetchedMeals);
    };
    fetchMeals();
  }, [db]);

  const addMeal = async () => {
    if (newMealName.trim() === "") {
      Alert.alert("Enter a meal name");
      return;
    }
    console.log("Adding meal:", newMealName);

    const newMeal = {
      create_at: getDateNow(),
      update_at: getDateNow(),
      photo_url: null,
      name: newMealName,
      description: "",
    };
    insertEntry(db, "meals", newMeal);

    const fetchedMeals = await getAll(db, "meals");
    setMeals(fetchedMeals);

    setNewMealName("");
    setSearchQuery(""); // clear search query to make sure the new meal is visible
    setModalVisible(false);
  };

  const confirmDeleteMeal = (meal: Meal) => {
    Alert.alert(
      "Delete Meal",
      `Are you sure you want to delete ${meal.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteMeal(meal),
        },
      ],
      { cancelable: false }
    );
  };

  const deleteMeal = async (meal: Meal) => {
    deleteEntry(db, "meals", {
      columnName: "meal_id",
      action: "=",
      value: meal.meal_id,
    });
    const fetchedMeals = await getAll(db, "meals");
    setMeals(fetchedMeals);
  };

  // Function to handle search query change
  const handleSearchQueryChange = (text: string) => {
    setSearchQuery(text);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search Meals..."
        onChangeText={handleSearchQueryChange} // ignore error
        value={searchQuery}
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchInputContainer}
      />

      <ItemList
        items={meals}
        searchQuery={searchQuery}
        onDeleteItem={confirmDeleteMeal}
        getTitle={(item) => item.name} // provides a way to extract title from Meal
      />

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
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter Meal Name:</Text>
            <TextInput
              style={[styles.input, { textAlign: "center" }]}
              placeholder="e.g. Spaghetti"
              placeholderTextColor="#808080"
              value={newMealName}
              onChangeText={setNewMealName}
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
    backgroundColor: "#F0EAD6",
  },
  searchBarContainer: {
    backgroundColor: "#F0EAD6",
    borderBottomWidth: 0,
    borderTopWidth: 0,
    marginBottom: 10,
  },
  searchInputContainer: {
    backgroundColor: "#d3d3d3",
  },
  buttonContainer: {
    padding: 10,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  button: {
    borderRadius: 21,
    padding: 18,
    marginVertical: 3,
    width: "45%",
  },
  buttonOpen: {
    backgroundColor: "#36454F",
    justifyContent: "flex-end",
  },
  buttonClose: {
    backgroundColor: "#36454F",
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
    padding: 35,
    alignItems: "center",
    height: 250,
    width: 300,
    justifyContent: "space-evenly",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    width: "100%",
    paddingHorizontal: 10,
  },
  buttonContainerHorizontal: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 25,
    textAlign: "center",
    fontSize: 24,
  },
});

export default MealsScreen;
