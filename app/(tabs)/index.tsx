import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, StatusBar, FlatList, Dimensions, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Calendar } from "@/database/types";
import { fetchByQuery, insertEntry } from "@/database/queries";
import CalendarPicker from "react-native-calendar-picker";
import FloatingAddButton from "@/components/FloatingAddButton";

const { width } = Dimensions.get("window");
const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [displayedMonth, setDisplayedMonth] = useState<Date>(new Date());
  const [monthlyMeals, setMonthlyMeals] = useState<Calendar[]>([]);
  const [mealAdded, setMealAdded] = useState(false);

  const db = useSQLiteContext();
  const router = useRouter();
  const { new_meal_id } = useLocalSearchParams();
  const flatListRef = useRef<FlatList<Calendar>>(null);

  useEffect(() => {
    // Fetch meals when displayedMonth or mealAdded changes
    fetchMealsByMonth();
  }, [displayedMonth, mealAdded]);

  useEffect(() => {
    // Add meal when new_meal_id changes
    if (new_meal_id) {
      addMealToCalendar();
    }
  }, [new_meal_id]);

  useEffect(() => {
    // Scroll FlatList to first meal matching selectedDate when monthlyMeals updates
    if (!selectedDate || monthlyMeals.length === 0) return;

    const selectedISO = selectedDate.toISOString().substring(0, 10);
    const index = monthlyMeals.findIndex((meal) => meal.plan_at.startsWith(selectedISO));
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
    }
  }, [monthlyMeals, selectedDate]);

  const fetchMealsByMonth = async () => {
    if (!displayedMonth) return;
    const year = displayedMonth.getFullYear();
    const month = displayedMonth.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const results = await fetchByQuery(
      db,
      `
      SELECT c.*, m.name
      FROM calendar c
      LEFT JOIN meals m ON c.meal_id = m.meal_id
      WHERE c.plan_at BETWEEN ? AND ?
      ORDER BY c.plan_at ASC
      `,
      [startDate.toISOString(), endDate.toISOString()]
    );
    setMonthlyMeals(results);
    setMealAdded(false);
  };

  const addMealToCalendar = async () => {
    if (selectedDate === null || new_meal_id === null) return;

    const selectedISOFormat = selectedDate.toISOString();

    // Check if meal with same id already planned for the selected date
    const existsOnDate = monthlyMeals.some(
      (meal) => meal.meal_id.toString() === new_meal_id.toString() && meal.plan_at === selectedISOFormat
    );

    // Check if meal_id already exists anywhere in the current month
    const existsInMonth = monthlyMeals.some((meal) => meal.meal_id.toString() === new_meal_id.toString());

    if (!existsOnDate && !existsInMonth) {
      await insertEntry(db, "calendar", { meal_id: Number(new_meal_id), plan_at: selectedISOFormat });
      setMealAdded(true);
    }
  };

  const onDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleMonthChange = (date: Date) => {
    setDisplayedMonth(date);
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarWrapper}>
        <CalendarPicker
          onDateChange={onDateChange}
          onMonthChange={handleMonthChange}
          selectedStartDate={selectedDate}
          initialDate={displayedMonth}
          allowRangeSelection={false}
          selectedDayColor="#36454F"
          selectedDayTextColor="#fff"
          todayBackgroundColor="#D3D3D3"
          textStyle={{ fontSize: 20 }}
          previousTitleStyle={{ fontSize: 18 }}
          nextTitleStyle={{ fontSize: 18 }}
          width={width - 20}
          weekdaysStyle={{ fontWeight: "bold", fontSize: 16 }}
          monthsStyle={{ fontWeight: "bold", fontSize: 18 }}
        />
      </View>

      <Text style={styles.monthHeader}>Meals for this month</Text>
      {monthlyMeals.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={monthlyMeals}
          keyExtractor={(item) => `${item.meal_id}-${item.plan_at}`}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/meals/${item.meal_id}`)} style={styles.mealCard}>
              <Text style={styles.mealTitle}>{item.name}</Text>
              <Text style={styles.mealDate}>{new Date(item.plan_at).toDateString()}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.verticalListContainer}
          onScrollToIndexFailed={() => {
            flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
          }}
        />
      ) : (
        <Text style={styles.noMealsText}>No meals planned</Text>
      )}

      <FloatingAddButton onPress={() => router.push({ pathname: "/meals/select", params: { goBackPath: "/" } })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "#F0EAD6",
    paddingHorizontal: 10,
  },
  calendarWrapper: {
    marginTop: 20,
  },
  verticalListContainer: {
    paddingVertical: 10,
    width: "100%",
  },
  mealCard: {
    backgroundColor: "#36454F",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  mealTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  mealDate: {
    color: "white",
    fontSize: 12,
  },
  noMealsText: {
    marginTop: 20,
    fontSize: 16,
    color: "#555",
    fontStyle: "italic",
  },
  monthHeader: {
    marginTop: 30,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: "#333",
  },
});

export default CalendarScreen;
