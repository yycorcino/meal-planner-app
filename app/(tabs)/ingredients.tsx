import React, { useState, useEffect } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  StatusBar,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { useSQLiteContext } from "expo-sqlite";
import { Product, Meal } from "@/database/types";
import FloatingAddButton from "@/components/FloatingAddButton";
import { getAll, insertEntry, deleteEntry, updateEntry, fetchByQuery } from "@/database/queries";

const { width, height } = Dimensions.get("window");
const IngredientsScreen = () => {
  const [activeModal, setActiveModal] = useState<null | "view" | "add">(null);
  const [selectedIngredient, setSelectedIngredient] = useState<Product | null>(null);
  const [mealsForIngredient, setMealsForIngredient] = useState<Meal[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ingredientList, setIngredients] = useState<Product[]>([]);
  const db = useSQLiteContext();

  useEffect(() => {
    const getMealsByIngredientId = async (productId: number) => {
      const query = `
        SELECT meals.*
        FROM meals
        JOIN ingredient ON meals.meal_id = ingredient.meal_id
        WHERE ingredient.product_id = ?
      `;
      const results = await fetchByQuery(db, query, [productId]);
      setMealsForIngredient(results);
    };
    if (selectedIngredient?.product_id != null) {
      getMealsByIngredientId(selectedIngredient.product_id);
    }
  }, [selectedIngredient]);

  useEffect(() => {
    const fetchIngredients = async () => {
      const fetchedIngredients = await getAll(db, "product");
      setIngredients(fetchedIngredients);
    };
    fetchIngredients();
  }, [db]);

  const viewIngredient = (ingredient: Product) => {
    setSelectedIngredient(ingredient);
    setActiveModal("view");
  };

  const openAddModal = () => {
    setSelectedIngredient({ name: "", product_id: -1 }); // Temp ID for new item
    setActiveModal("add");
  };

  const addIngredient = async () => {
    if (!selectedIngredient || selectedIngredient.name.trim() === "") {
      Alert.alert("Provide a name for the ingredient");
      return;
    }
    await insertEntry(db, "product", { name: selectedIngredient.name });
    const fetched = await getAll(db, "product");
    setIngredients(fetched);
    setSelectedIngredient(null);
    setSearchQuery("");
    setActiveModal(null);
  };

  const updateIngredient = async () => {
    if (!selectedIngredient) return;
    await updateEntry(
      db,
      "product",
      {
        columnName: "product_id",
        action: "=",
        value: selectedIngredient.product_id,
      },
      { name: selectedIngredient.name }
    );
    const fetched = await getAll(db, "product");
    setIngredients(fetched);
    setSelectedIngredient(null);
    setActiveModal(null);
  };

  const deleteIngredient = async () => {
    if (!selectedIngredient) return;
    await deleteEntry(db, "product", {
      columnName: "product_id",
      action: "=",
      value: selectedIngredient.product_id,
    });
    const fetched = await getAll(db, "product");
    setIngredients(fetched);
    setSelectedIngredient(null);
    setActiveModal(null);
  };

  const filteredIngredients = ingredientList.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search by ingredients"
        // @ts-ignore
        onChangeText={setSearchQuery}
        value={searchQuery}
        platform="default"
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchInputContainer}
      />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
        {filteredIngredients.map((item) => (
          <Pressable
            key={item.product_id}
            style={({ pressed }) => [styles.tableRow, pressed && styles.pressedRow]}
            onPress={() => viewIngredient(item)}
          >
            <Text style={styles.tableCell}>{item.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <FloatingAddButton onPress={openAddModal} />

      {/* View Modal */}
      <Modal animationType="slide" transparent={true} visible={activeModal === "view"}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{selectedIngredient?.name}</Text>

            {mealsForIngredient.length > 0 && (
              <ScrollView style={{ maxHeight: 200, width: "100%", marginBottom: 15 }}>
                {mealsForIngredient.map((meal) => (
                  <Pressable
                    key={meal.meal_id}
                    style={({ pressed }) => [styles.tableRow, pressed && styles.pressedRow, { marginBottom: 5 }]}
                    onPress={() => Alert.alert("Meal Selected", meal.name)}
                  >
                    <Text style={styles.tableCell}>{meal.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            <Pressable style={styles.editButton} onPress={() => setActiveModal("add")}>
              <Text style={styles.textStyle}>Edit</Text>
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={deleteIngredient}>
              <Text style={styles.textStyle}>Delete</Text>
            </Pressable>
            <Pressable
              style={styles.cancelButton}
              onPress={() => {
                setActiveModal(null);
                setSelectedIngredient(null);
              }}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={activeModal === "add"}
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              {selectedIngredient ? "Edit Ingredient Name:" : "Enter Ingredient Name:"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Avocado"
              value={selectedIngredient?.name || ""}
              onChangeText={(text) =>
                setSelectedIngredient((prev) => (prev ? { ...prev, name: text } : { name: text, product_id: -1 }))
              }
            />
            <Pressable
              style={styles.saveButton}
              onPress={selectedIngredient?.product_id === -1 ? addIngredient : updateIngredient}
            >
              <Text style={styles.textStyle}>Save</Text>
            </Pressable>
            <Pressable
              style={styles.cancelButton}
              onPress={() => {
                setActiveModal(null);
                setSelectedIngredient(null);
              }}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
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
    paddingHorizontal: 5,
  },
  searchBarContainer: {
    backgroundColor: "#F0EAD6",
    borderBottomWidth: 0,
    borderTopWidth: 0,
    marginBottom: 10,
  },
  searchInputContainer: {
    backgroundColor: "white",
    borderRadius: 5,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#ADD8E6",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderRadius: 3,
    marginBottom: 4,
  },
  pressedRow: {
    backgroundColor: "#87CEEB",
  },
  tableCell: {
    flex: 1,
    fontSize: 18,
    color: "white",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: width * 0.9,
    maxHeight: height * 0.7,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 21,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
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
  saveButton: {
    backgroundColor: "#36454F",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#36454F",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "100%",
  },
  editButton: {
    backgroundColor: "#36454F",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "100%",
  },
  deleteButton: {
    backgroundColor: "#36454F",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "100%",
  },
  textStyle: {
    color: "white",
    fontWeight: "normal",
    textAlign: "center",
    fontSize: 20,
  },
  modalText: {
    marginBottom: 25,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default IngredientsScreen;
