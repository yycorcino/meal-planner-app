import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView, TextInput, Button, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { MealWithIngredients } from "@/database/types";
import { getAll, fetchByQuery, updateEntry } from "@/database/queries";

export default function MealDetailScreen() {
  const [meal, setMeal] = useState<MealWithIngredients | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const db = useSQLiteContext();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    if (!id) return;
    const fetchMealWithIngredients = async () => {
      const fetchMealResponse = await getAll(db, "meals", {
        columnName: "meal_id",
        action: "=",
        value: id,
      });
      if (fetchMealResponse.length === 0) {
        setMeal(null);
        return;
      }
      const mealInfo = fetchMealResponse[0];

      const fetchIngredientsResponse = await fetchByQuery(
        db,
        `
        SELECT
          p.name AS ingredient_name,
          p.product_id,
          i.quantity,
          u.name AS unit_name
        FROM ingredient i
        JOIN product p ON i.product_id = p.product_id
        LEFT JOIN unit_of_measure u ON i.unit_of_measure_id = u.unit_of_measure_id
        WHERE i.meal_id = ?;
        `,
        [Number(id)]
      );
      const ingredientsWithAction = fetchIngredientsResponse.map((ingredient) => ({
        ...ingredient,
        action: null,
      }));

      setMeal({
        ...mealInfo,
        ingredients: ingredientsWithAction,
      });
    };
    fetchMealWithIngredients();
  }, [id, db]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setIsEditing((e) => !e)}>
          <Text style={{ fontSize: 17, color: "#007AFF" }}>{isEditing ? "Cancel" : "Edit Meal"}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isEditing]);

  const updateMealWithIngredients = async () => {
    if (!meal) return;
    await updateEntry(
      db,
      "meals",
      {
        columnName: "meal_id",
        action: "=",
        value: meal.meal_id,
      },
      { name: meal.name }
    );

    for (const ingredient of meal.ingredients) {
      const action = ingredient.action;
      const product_id = ingredient.product_id;
      const quantity = ingredient.quantity;

      if (action === "edit") {
        await updateEntry(
          db,
          "ingredient",
          {
            columnName: ["meal_id", "product_id"],
            action: "=",
            value: [meal.meal_id, product_id],
          },
          { quantity: quantity }
        );
      }
    }

    setIsEditing(false);
  };

  if (!meal) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading meal...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isEditing ? (
        <TextInput
          style={styles.inputTitle}
          value={meal.name}
          onChangeText={(text) => setMeal({ ...meal, name: text })}
        />
      ) : (
        <Text style={styles.mealTitle}>{meal.name}</Text>
      )}

      <Text style={styles.sectionTitle}>Ingredients</Text>
      <View style={styles.ingredientsBox}>
        <View style={styles.ingredientRow}>
          <Text style={[styles.ingredientHeader, styles.cell]}>Ingredient</Text>
          <Text style={[styles.ingredientHeader, styles.cell]}>Quantity</Text>
        </View>

        <FlatList
          data={meal.ingredients}
          scrollEnabled={true}
          keyExtractor={(_, index) => index.toString()}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item, index }) => {
            if (isEditing) {
              return (
                <View style={styles.editRow}>
                  <TextInput
                    style={[styles.cell, styles.ingredientInput]}
                    value={item.ingredient_name}
                    onChangeText={(text) => {
                      const updated = [...meal.ingredients];
                      updated[index].ingredient_name = text;
                      if (updated[index].action !== "new") {
                        updated[index].action = "edit";
                      }
                      setMeal({ ...meal, ingredients: updated });
                    }}
                  />
                  <TextInput
                    style={[styles.cell, styles.ingredientInput]}
                    value={String(item.quantity)}
                    onChangeText={(text) => {
                      const updated = [...meal.ingredients];
                      updated[index].quantity = parseFloat(text) || 0;
                      if (updated[index].action !== "new") {
                        updated[index].action = "edit";
                      }
                      setMeal({ ...meal, ingredients: updated });
                    }}
                    keyboardType="numeric"
                  />
                </View>
              );
            }

            return (
              <View style={styles.viewRow}>
                <Text style={[styles.ingredientText, styles.cell]}>{item.ingredient_name}</Text>
                <Text style={[styles.ingredientText, styles.cell]}>
                  {item.quantity} {item.unit_name || ""}
                </Text>
              </View>
            );
          }}
        />
      </View>

      <Text style={styles.sectionTitle}>Description</Text>
      {isEditing ? (
        <TextInput
          multiline
          style={styles.descriptionInput}
          value={meal.description || ""}
          onChangeText={(text) => setMeal({ ...meal, description: text })}
        />
      ) : (
        <ScrollView style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>{meal.description || "No description available."}</Text>
        </ScrollView>
      )}

      {isEditing && (
        <View style={styles.editControls}>
          <Button title="Save" onPress={updateMealWithIngredients} />
          <Button title="Cancel" onPress={() => setIsEditing(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0EAD6",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
  },
  mealTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  inputTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  ingredientsBox: {
    maxHeight: 300,
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 24,
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
  ingredientHeader: {
    fontSize: 16,
    fontWeight: "bold",
  },
  ingredientText: {
    fontSize: 16,
  },
  descriptionBox: {
    maxHeight: 160,
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
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
  },
  descriptionText: {
    fontSize: 16,
    color: "#333",
  },
  editControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  ingredientRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  viewRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  ingredientInput: {
    fontSize: 16,
    paddingVertical: 2,
    textAlign: "center",
  },
  editRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
});
