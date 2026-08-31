import { Tabs } from "expo-router";
import React from "react";
import { CourseProvider } from "../src/context/CourseContext";

export default function TabLayout() {
  return (
    <CourseProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      >
        <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />

        <Tabs.Screen name="index" options={{ title: "Upload Book" }} />

        <Tabs.Screen
          name="progress"
          options={{ title: "Course Generation Progress" }}
        />

        <Tabs.Screen name="feedback" options={{ title: "Feedback" }} />
        <Tabs.Screen name="module-feedback" options={{ title: "Module Feedback" }} />

        <Tabs.Screen name="modules" options={{ title: "My Courses" }} />

        <Tabs.Screen name="overview" options={{ title: "Course Overview" }} />

        <Tabs.Screen name="learning" options={{ title: "Learning" }} />
        <Tabs.Screen name="module-overview" options={{ title: "Module Overview" }} />
        <Tabs.Screen name="quiz" options={{ title: "Module Quiz" }} />
        <Tabs.Screen name="doubt" options={{ title: "Doubts" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        <Tabs.Screen name="settings" options={{ title: "Settings" }} />
        <Tabs.Screen name="about" options={{ title: "About" }} />
        <Tabs.Screen name="module-complete" options={{ title: "Module Completed" }} />
      </Tabs>
    </CourseProvider>
  );
}
