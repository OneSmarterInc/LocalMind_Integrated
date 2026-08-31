import React, { useEffect, useMemo } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCourse } from "../src/context/CourseContext";
import LocalMindShell from "../src/components/navigation/LocalMindShell";
import LearningScreen from "../src/features/learning-kit/screens/LearningScreen";
import { findCourseModule, toFriendModule } from "../src/features/learning-kit/adapter";

export default function LearningPage() {
  const { course, updateModuleProgress } = useCourse();
  const { moduleId } = useLocalSearchParams<{ moduleId?: string }>();
  const module = useMemo(() => course ? findCourseModule(course.chapters, moduleId) : null, [course, moduleId]);
  const item = module ? toFriendModule(module) : null;

  useEffect(() => {
    if (!moduleId || !module) return;
    if (module.status === "COMPLETED" || (module.progress ?? 0) >= 100) return;
    updateModuleProgress(String(moduleId), Math.max(module.progress ?? 0, 25));
  }, [moduleId, module?.id]);
  if (!item) return <LocalMindShell active="Learning" title="Learning" backPath="/modules"><View style={styles.empty}><Ionicons name="school-outline" size={42} color="#38D9B0"/><Text style={styles.title}>No Module Selected</Text><Pressable style={styles.button} onPress={() => router.push("/modules")}><Text style={styles.buttonText}>Back to My Courses</Text></Pressable></View></LocalMindShell>;
  return <LocalMindShell active="Learning" title="Learning" subtitle="Complete the activities in your microlearning module." backPath="/modules"><LearningScreen module={item} onComplete={() => router.push({ pathname: "/quiz", params: { moduleId: item.id } })} onOpenDoubt={() => router.push({ pathname: "/doubt", params: { moduleId: item.id } })} /></LocalMindShell>;
}
const styles=StyleSheet.create({empty:{flex:1,alignItems:"center",justifyContent:"center",padding:30},title:{color:"#F4F7F8",fontSize:25,fontWeight:"800",marginTop:15},button:{backgroundColor:"#38D9B0",paddingHorizontal:18,paddingVertical:12,borderRadius:7,marginTop:20},buttonText:{color:"#0B1114",fontWeight:"800"}});
