import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([
    { id: "1", name: "Carrot", quantity: "10 EA", checked: false },
    { id: "2", name: "Milk", quantity: "1 Gallon", checked: false },
    { id: "3", name: "Salt", quantity: "1 BX", checked: false },
    { id: "4", name: "Apple", quantity: "10 EA", checked: false },
    { id: "5", name: "Canola Oil", quantity: "1 Bottle", checked: false },
    { id: "6", name: "White Bread", quantity: "1 Loaf", checked: false },
    { id: "7", name: "Salmon", quantity: "2 Kg", checked: false },
    { id: "8", name: "Beef", quantity: "16 Oz", checked: false },
  ]);

  const toggleChecked = (id: string) => {
    const updatedItems = cartItems.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item));
    setCartItems(updatedItems);
  };
  // @ts-ignore
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {}
      <TouchableOpacity
        style={[styles.circleButton, item.checked && styles.filledCircle]}
        onPress={() => toggleChecked(item.id)}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQuantity}>{item.quantity}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  circleButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#000",
    marginRight: 10,
  },
  filledCircle: {
    backgroundColor: "#36454F",
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemQuantity: {
    fontSize: 14,
    color: "#666",
  },
});
