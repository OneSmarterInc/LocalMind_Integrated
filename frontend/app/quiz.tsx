import React, { useEffect, useMemo } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { useCourse } from "../src/context/CourseContext";
import LocalMindShell from "../src/components/navigation/LocalMindShell";
import QuizScreen from "../src/features/learning-kit/screens/QuizScreen";
import { findCourseModule, toFriendModule } from "../src/features/learning-kit/adapter";

export default function QuizPage() {
 const {course, setModuleFeedbackScore, setModuleQuizResult, updateModuleProgress, quizResults}=useCourse(); const {moduleId}=useLocalSearchParams<{moduleId?:string}>();
 const module=useMemo(()=>course?findCourseModule(course.chapters,moduleId):null,[course,moduleId]); const item=module?toFriendModule(module):null;
 const existingResult = (moduleId && module?.status !== "NEEDS_REVIEW") ? quizResults[String(moduleId)] : undefined;

 useEffect(() => {
   if (!moduleId || existingResult) return;
   updateModuleProgress(String(moduleId), 75);
 }, [moduleId, existingResult]);

 useEffect(() => {
   if (moduleId && existingResult) {
     router.replace({ pathname: "/module-complete", params: { moduleId: String(moduleId) } });
   }
 }, [moduleId, existingResult]);
 if(existingResult) return <LocalMindShell active="Learning" title="Module Completed" subtitle="Your quiz result is already available."><View style={styles.empty}><Text style={styles.title}>Quiz Already Completed</Text><Text style={{color:"#A7B2BA",marginTop:8}}>Your previous quiz result is available.</Text><Pressable style={styles.button} onPress={()=>router.replace({pathname:"/module-complete",params:{moduleId:item?.id ?? String(moduleId)}})}><Text style={styles.buttonText}>View Result</Text></Pressable></View></LocalMindShell>;
 if(!item) return <LocalMindShell active="Learning" title="Module Quiz"><View style={styles.empty}><Text style={styles.title}>No Module Selected</Text><Pressable style={styles.button} onPress={()=>router.push("/modules")}><Text style={styles.buttonText}>Back to My Courses</Text></Pressable></View></LocalMindShell>;
 return <LocalMindShell active="Learning" title="Module Quiz" subtitle="Test your understanding before completing the module."><QuizScreen module={item} onComplete={(result)=>{ const passed = result.accuracy >= 65; setModuleFeedbackScore(item.id, result.accuracy); setModuleQuizResult(item.id, result); updateModuleProgress(item.id, passed ? 100 : 50, passed ? "COMPLETED" : "NEEDS_REVIEW"); router.replace({pathname:"/module-complete",params:{moduleId:item.id, correct: String(result.correct), incorrect: String(result.incorrect), total: String(result.total), accuracy: String(result.accuracy)}}); }}/></LocalMindShell>;
}
const styles=StyleSheet.create({empty:{flex:1,alignItems:"center",justifyContent:"center"},title:{color:"#F4F7F8",fontSize:24,fontWeight:"800"},button:{backgroundColor:"#38D9B0",padding:12,borderRadius:7,marginTop:20},buttonText:{color:"#0B1114",fontWeight:"800"}});
