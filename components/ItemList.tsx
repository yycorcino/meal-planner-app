/* A list of generic items that are rendered by the ItemList component. */

import React from "react";
import { FlatList } from "react-native";
import Item from "./Item";

interface ItemListProps<T> {
  items: T[];
  searchQuery: string;
  onDeleteItem: (item: T) => void;
  getTitle: (item: T) => string;
}

const ItemList = <T,>({ items, searchQuery, onDeleteItem, getTitle }: ItemListProps<T>) => {
  const filteredItems = items.filter(item => {
    const title = getTitle(item);
    return (
      typeof title === "string" &&
      typeof searchQuery === "string" &&
      title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <FlatList
      data={filteredItems}
      renderItem={({ item }) => (
        <Item 
          title={getTitle(item)} 
          onDelete={() => onDeleteItem(item)} 
          item={item}
        />
      )}
      keyExtractor={(item) => getTitle(item)}
      numColumns={1}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ItemList;
