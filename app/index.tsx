import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Game() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dungeon Runner Game</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2C3E50"
  },
  title: {
    fontSize: 24,
    color: "#FFD700",
    fontWeight: "bold"
  }
});