/* A single item in a generic list. Displays title of the item and has a delete option. */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface ItemProps<T> {
  title: string;
  onDelete: () => void;
  item: T; // item type
}

const Item = <T,>({ title, onDelete, item }: ItemProps<T>) => {
  return (
    <View style={styles.item}>
      <Text style={[styles.title, { opacity: 0.45 }]}>{title}</Text>
      <Pressable onPress={onDelete} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#d3d3d3',
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    height: 80,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 30,
    fontWeight: 'normal',
    color: '#000000',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    borderRadius: 5,
    padding: 5,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Item;
