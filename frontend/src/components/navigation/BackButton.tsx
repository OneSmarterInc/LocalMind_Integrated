import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

export default function BackButton({ backPath }: { backPath?: string }) {
  const handleBack = () => {
    if (backPath) {
      router.push(backPath as any);
      return;
    }
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/dashboard" as never);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={handleBack}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      hitSlop={8}
    >
      <Ionicons name="arrow-back" size={22} color="#A7B2BA" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 2,
  },
  pressed: {
    opacity: 0.65,
  },
});
