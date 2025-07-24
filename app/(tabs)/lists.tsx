import React, { useState } from "react";
import { StyleSheet, View, StatusBar } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { List } from "@/database/types";
import { getAll } from "@/database/queries";
import TabPageTemplate from "@/components/TabPageTemplate";

const ListScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [arrayList, setArray] = useState<List[]>([]);
  const db = useSQLiteContext();
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      const fetchMeals = async () => {
        const fetchedMeals = await getAll(db, "lists");
        setArray(fetchedMeals);
      };
      fetchMeals();
    }, [db])
  );

  const filteredArray = arrayList.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={styles.container}>
      <TabPageTemplate
        searchBarConfig={{
          placeholder: "Search for lists",
          searchQuery: searchQuery,
          setSearchQuery: setSearchQuery,
        }}
        listConfig={{
          items: filteredArray,
          pressKey: (item) => item.list_id,
          pressLabelKey: (item) => item.name,
          onPressAction: (item) => router.push(`/lists/${item.list_id}`),
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

export default ListScreen;
