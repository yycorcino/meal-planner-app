import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { MealWithIngredients } from "@/database/types";
import { getAll, fetchByQuery } from "@/database/queries";

export default function MealDetailScreen() {
  const [meal, setMeal] = useState<MealWithIngredients | null>(null);
  const db = useSQLiteContext();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    if (!id) return;
    const fetchMealWithIngredients = async () => {
      const mealRows = await getAll(db, "meals", {
        columnName: "meal_id",
        action: "=",
        value: id,
      });
      if (mealRows.length === 0) {
        setMeal(null);
        return;
      }
      const mealInfo = mealRows[0];

      const ingredients = await fetchByQuery(
        db,
        `
        SELECT
          p.name AS ingredient_name,
          i.quantity,
          u.name AS unit_name
        FROM ingredient i
        JOIN product p ON i.product_id = p.product_id
        LEFT JOIN unit_of_measure u ON i.unit_of_measure_id = u.unit_of_measure_id
        WHERE i.meal_id = ?;
        `,
        [Number(id)]
      );

      setMeal({
        ...mealInfo,
        ingredients,
      });
    };
    fetchMealWithIngredients();
  }, [id, db]);

  if (!meal) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading meal...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mealTitle}>{meal.name}</Text>

      {/* Ingredients Section */}
      <Text style={styles.sectionTitle}>Ingredients</Text>
      <View style={styles.ingredientsBox}>
        {/* Header */}
        <View style={styles.ingredientRow}>
          <Text style={[styles.ingredientHeader, styles.cell]}>Ingredient</Text>
          <Text style={[styles.ingredientHeader, styles.cell]}>Quantity</Text>
        </View>

        {/* Ingredient List or Empty Message */}
        {meal.ingredients && meal.ingredients.length > 0 ? (
          <FlatList
            data={meal.ingredients}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.ingredientList}
            renderItem={({ item }) => (
              <View style={styles.ingredientRow}>
                <Text style={[styles.ingredientText, styles.cell]}>{item.ingredient_name}</Text>
                <Text style={[styles.ingredientText, styles.cell]}>
                  {item.quantity} {item.unit_name || ""}
                </Text>
              </View>
            )}
          />
        ) : (
          <View style={styles.emptyStateBox}>
            <Text style={styles.emptyStateText}>Add ingredients for your meal</Text>
          </View>
        )}
      </View>

      {/* Description Section */}
      <Text style={styles.sectionTitle}>Description</Text>
      <ScrollView style={styles.descriptionBox}>
        <Text style={styles.descriptionText}>{meal.description || "No description available."}</Text>
      </ScrollView>
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  // Ingredient Table
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
  ingredientList: {
    paddingBottom: 10,
  },
  ingredientRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
  emptyStateBox: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#777",
  },

  // Description Box
  descriptionBox: {
    maxHeight: 160,
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  descriptionText: {
    fontSize: 16,
    color: "#333",
  },
});
