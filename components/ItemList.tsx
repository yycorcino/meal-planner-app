/* A list of generic items that are rendered by the ItemList component. */

import React from 'react';
import { FlatList } from 'react-native';
import Item from './Item'; // import the Item component

interface ItemListProps<T> {
  items: T[];
  searchQuery: string;
  onDeleteItem: (item: T) => void; // accept the delete function
  getTitle: (item: T) => string; // function to get the title from the item
}

const ItemList = <T,>({ items, searchQuery, onDeleteItem, getTitle }: ItemListProps<T>) => {
  const filteredItems = items.filter(item =>
    getTitle(item).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <FlatList
      data={filteredItems}
      renderItem={({ item }) => (
        <Item 
          title={getTitle(item)} 
          onDelete={() => onDeleteItem(item)} 
          item={item} // pass the item prop here
        />
      )}
      keyExtractor={(item) => getTitle(item)} // make sure the key is unique
      numColumns={1}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ItemList;
