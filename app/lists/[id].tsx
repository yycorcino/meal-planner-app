import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, TextInput, Button } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { ListWithMeals, MealWithAction } from "@/database/types";
import { getAll, fetchByQuery, updateEntry } from "@/database/queries";
import { Ionicons } from "@expo/vector-icons";

export default function ListDetailScreen() {
  const [list, setList] = useState<ListWithMeals | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const db = useSQLiteContext();
  const navigation = useNavigation();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    if (!id) return;
    const fetchListWithMeals = async () => {
      const fetchListResponse = await getAll(db, "lists", {
        columnName: "list_id",
        action: "=",
        value: id,
      });
      if (fetchListResponse.length === 0) {
        setList(null);
        return;
      }
      let listInfo = fetchListResponse[0];
      listInfo.list_of_meal_ids = JSON.parse(listInfo.list_of_meal_ids);

      const placeholders = listInfo.list_of_meal_ids.map(() => "?").join(",");
      const query = `
        SELECT m.*
        FROM meals m
        WHERE m.meal_id IN (${placeholders});
      `;
      const fetchMealsResponse = await fetchByQuery(db, query, listInfo.list_of_meal_ids);
      setList({ ...listInfo, list_of_meals: fetchMealsResponse });
    };
    fetchListWithMeals();
  }, [id, db, isEditing]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setIsEditing((e) => !e)}>
          <Text style={{ fontSize: 17, color: "#007AFF" }}>{isEditing ? "Cancel" : "Edit List"}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isEditing]);

  const updateListWithMeals = async () => {
    if (!list) return;
    await updateEntry(
      db,
      "lists",
      {
        columnName: "list_id",
        action: "=",
        value: list.list_id,
      },
      { name: list.name, description: list.description }
    );

    let mealIdsToDelete = [];
    let mealIdsToAdd = [];
    for (const meal of list.list_of_meals) {
      const action = meal.action;
      const meal_id = meal.meal_id;

      if (action === "delete") {
        mealIdsToDelete.push(meal_id);
      } else if (action === "new") {
        mealIdsToAdd.push(meal_id);
      }
    }
    if (mealIdsToDelete.length > 0) {
      let newList = list.list_of_meal_ids.filter((id: Number) => !mealIdsToDelete.includes(id));
      await updateEntry(
        db,
        "lists",
        { columnName: "list_id", action: "=", value: list.list_id },
        { list_of_meal_ids: JSON.stringify(newList) }
      );
    }
    if (mealIdsToAdd.length > 0) {
      const newList = mealIdsToAdd.concat(list.list_of_meal_ids);
      await updateEntry(
        db,
        "lists",
        { columnName: "list_id", action: "=", value: list.list_id },
        { list_of_meal_ids: JSON.stringify(newList) }
      );
    }

    setIsEditing(false);
  };

  const setMealActionToDelete = (mealId: number) => {
    if (!list) return;
    const updatedMeals = list.list_of_meals.map((meal) =>
      meal.meal_id === mealId ? { ...meal, action: "delete" as MealWithAction["action"] } : meal
    );
    setList({ ...list, list_of_meals: updatedMeals });
  };

  if (!list) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading list...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {isEditing ? (
        <TextInput
          style={styles.inputTitle}
          value={list.name}
          onChangeText={(text) => setList({ ...list, name: text })}
        />
      ) : (
        <Text style={styles.title}>{list.name}</Text>
      )}

      <Text style={styles.sectionTitle}>Description</Text>

      {isEditing ? (
        <TextInput
          style={styles.descriptionInput}
          multiline
          value={list.description || ""}
          onChangeText={(text) => setList({ ...list, description: text })}
        />
      ) : (
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>{list.description || "No description available."}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Meals in this list</Text>
      <View style={styles.mealListBox}>
        {list.list_of_meals.length === 0 ? (
          <Text style={styles.empty}>No meals in this list.</Text>
        ) : (
          <FlatList
            data={list.list_of_meals}
            scrollEnabled={false}
            keyExtractor={(item) => item.meal_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.mealItem}
                onPress={() => router.push(`/meals/${item.meal_id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.mealRow}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.mealName,
                        item.action === "delete" && { textDecorationLine: "line-through", color: "#888" },
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.mealDescription,
                        item.action === "delete" && { textDecorationLine: "line-through", color: "#888" },
                      ]}
                    >
                      {item.description || "No description."}
                    </Text>
                  </View>
                  {isEditing && (
                    <TouchableOpacity onPress={() => setMealActionToDelete(item.meal_id)}>
                      <Ionicons name="trash" size={24} color="red" />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
      {isEditing && (
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Meal</Text>
        </TouchableOpacity>
      )}
      {isEditing && (
        <View style={styles.editControls}>
          <Button title="Save" onPress={updateListWithMeals} />
          <Button title="Cancel" onPress={() => setIsEditing(false)} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0EAD6",
    padding: 16,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  inputTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  descriptionBox: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 16,
    color: "#333",
  },
  descriptionInput: {
    minHeight: 100,
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
    textAlignVertical: "top",
    marginBottom: 24,
  },
  mealListBox: {
    backgroundColor: "#fff",
    justifyContent: "center",
    borderRadius: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 24,
    minHeight: 45,
  },
  mealItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  mealRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  mealName: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  mealDescription: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
  },
  empty: {
    textAlign: "center",
    color: "#999",
    fontStyle: "italic",
  },
  addButton: {
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: "#36454F",
    alignItems: "center",
  },
  editControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
    marginBottom: 24,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
