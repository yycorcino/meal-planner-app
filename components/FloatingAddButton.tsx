import React from "react";
import { StyleSheet, Pressable, Text } from "react-native";

interface FloatingAddButtonProps {
  onPress: () => void;
  label?: string;
}

const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ onPress, label = "+" }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 20,
    width: 50,
    height: 50,
    bottom: 30,
    borderRadius: 30,
    elevation: 5,
    backgroundColor: "#36454F",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  text: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: -2,
  },
});

export default FloatingAddButton;
