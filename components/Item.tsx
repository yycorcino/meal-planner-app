/* A single item in a generic list. Displays title of the item and has a delete option. */

import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";

interface ItemProps<T> {
  title: string;
  onDelete: () => void;
  item: T;
}

const Item = <T,>({ title, onDelete, item }: ItemProps<T>) => {
  return (
    <View style={styles.item}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.titleContainer}
      >
        <Text style={styles.title}>{title}</Text>
      </ScrollView>
      <Pressable onPress={onDelete} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#d3d3d3",
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    height: 80,
    justifyContent: "space-between",
  },
  titleContainer: {
    flexGrow: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "normal",
    color: "#000000",
  },
  deleteButton: {
    backgroundColor: "#FF6347",
    borderRadius: 5,
    padding: 5,
    marginLeft: 10,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Item;

