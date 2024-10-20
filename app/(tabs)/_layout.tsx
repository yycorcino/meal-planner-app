import React from "react";
import { CalendarDays, List, CookingPot, Carrot } from "lucide-react-native";
import { Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color }) => <CalendarDays color={color} size={15} />,
        }}
      />
      <Tabs.Screen
        name="lists"
        options={{
          title: "Lists",
          tabBarIcon: ({ color }) => <List color={color} size={15} />,
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: "Meals",
          tabBarIcon: ({ color }) => <CookingPot color={color} size={15} />,
        }}
      />
      <Tabs.Screen
        name="ingredients"
        options={{
          title: "Ingredients",
          tabBarIcon: ({ color }) => <Carrot color={color} size={15} />,
        }}
      />
    </Tabs>
  );
}
