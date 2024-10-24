/* A single meal item in the list. Displays title of the meal (can change add later on).
Also utilized in MealList. */

import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

interface MealItemProps {
    title: string;
}

// MealItem component
const MealItem: React.FC<MealItemProps> = ({ title }) => {
  return (
    <View style={styles.item}>
      <Text style={[styles.title, { opacity: 0.45 }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#d3d3d3',
        marginVertical: 2,
        marginHorizontal: 10,
        borderRadius: 1,
        flex: 1,
        alignItems: 'center',
        padding: 10,
        height: 80,
    },
    title: {
        fontSize: 30,
        fontWeight: 'normal',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#000000',
    },
});

export default MealItem;