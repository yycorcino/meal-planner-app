import React from "react";
import { StyleSheet, ScrollView, Pressable } from "react-native";
import { Text } from "./Themed";
import { SearchBar } from "react-native-elements";

type TabPageTemplateProps<T> = {
  searchBarConfig: {
    placeholder: string;
    searchQuery: string;
    setSearchQuery: (text: string) => void;
  };
  listConfig: {
    items: T[];
    pressKey: (item: T) => string | number;
    pressLabelKey: (item: T) => string;
    onPressAction: (item: T) => void;
  };
};

function TabPageTemplate<T>({ searchBarConfig, listConfig }: TabPageTemplateProps<T>) {
  return (
    <>
      <SearchBar
        placeholder={searchBarConfig.placeholder}
        // @ts-ignore
        onChangeText={searchBarConfig.setSearchQuery}
        value={searchBarConfig.searchQuery}
        platform="default"
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchInputContainer}
        placeholderTextColor={"#c7c7cd"}
      />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        {listConfig.items.map((item) => (
          <Pressable
            key={listConfig.pressKey(item)}
            style={({ pressed }) => [styles.tableRow, pressed && styles.pressedRow]}
            onPress={() => listConfig.onPressAction(item)}
          >
            <Text style={styles.tableCell}>{listConfig.pressLabelKey(item)}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
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
  scrollContent: {
    paddingBottom: 100,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#ADD8E6",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderRadius: 3,
    marginBottom: 3,
  },
  pressedRow: {
    backgroundColor: "#87CEEB",
  },
  tableCell: {
    flex: 1,
    fontSize: 18,
    color: "white",
  },
});

export default TabPageTemplate;
