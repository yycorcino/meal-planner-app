import React from "react";
import { CalendarDays, List, CookingPot, Carrot, ShoppingCart, Settings } from "lucide-react-native";
import { Tabs, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

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
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/cart")}
              style={{ marginLeft: 16 }} // spacing from edge
            >
              <ShoppingCart size={25} color="#36454F" strokeWidth={2.5} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/settings")}
              style={{ marginRight: 16 }} // spacing from edge
            >
              <Settings size={25} color="#36454F" strokeWidth={2.5} />
            </TouchableOpacity>
          ),
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
