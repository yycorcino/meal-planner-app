import React, { useState } from "react";
import { StyleSheet, View, StatusBar } from "react-native";
import { useRouter, useFocusEffect, useLocalSearchParams, RelativePathString } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Meal } from "@/database/types";
import { getAll } from "@/database/queries";
import TabPageTemplate from "@/components/TabPageTemplate";

const MealSelect = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mealList, setMeals] = useState<Meal[]>([]);
  const db = useSQLiteContext();
  const router = useRouter();
  const { goBackPath } = useLocalSearchParams();

  useFocusEffect(
    React.useCallback(() => {
      const fetchMeals = async () => {
        const fetchedMeals = await getAll(db, "meals");
        setMeals(fetchedMeals);
      };
      fetchMeals();
    }, [db])
  );

  const filteredMeals = mealList.filter((meal) => meal.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={styles.container}>
      <TabPageTemplate
        searchBarConfig={{
          placeholder: "Search for meals",
          searchQuery: searchQuery,
          setSearchQuery: setSearchQuery,
        }}
        listConfig={{
          items: filteredMeals,
          pressKey: (item) => item.meal_id,
          pressLabelKey: (item) => item.name,
          onPressAction: (item) => {
            router.back();
            router.setParams({ new_meal_id: item.meal_id });
            router.navigate({
              pathname: goBackPath as RelativePathString,
              params: { new_meal_id: item.meal_id },
            });
          },
        }}
      />
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
});

export default MealSelect;
