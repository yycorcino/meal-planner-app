/* A list of meal items that render are rendered by the MealList component. */

import React from 'react';
import { FlatList } from 'react-native';
import MealItem from './MealItem';

interface Meal {
    id: string;
    title: string;
}

interface MealListProps {
    meals: Meal[];
    searchQuery: string;
}

const MealList: React.FC<MealListProps> = ({ meals, searchQuery }) => {
    const filteredMeals = meals.filter(meal =>
        meal.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <FlatList
            data={filteredMeals}
            renderItem={({ item }) => <MealItem title={item.title} />}
            keyExtractor={(item) => item.id}
            numColumns={1}
            showsVerticalScrollIndicator={false}
        />
    );
};

export default MealList;
