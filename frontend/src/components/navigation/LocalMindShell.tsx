import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { ReactNode } from "react";
import { Alert, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import UserMenu from "./UserMenu";
import BackButton from "./BackButton";

const C = { bg: "#0B1114", sidebar: "#0A1624", border: "#263747", teal: "#38D9B0", text: "#F4F7F8", muted: "#A7B2BA" };

const items = [
  ["grid-outline", "Dashboard", "/dashboard"],
  ["cloud-upload-outline", "Upload Book", "/"],
  ["library-outline", "My Courses", "/modules"],
  ["school-outline", "Learning", "/learning"],
  ["bar-chart-outline", "Progress", "/progress"],
  ["chatbubble-ellipses-outline", "Feedback", "/feedback"],
  ["information-circle-outline", "About", "/about"],
] as const;

function Brand() {
  return <View style={styles.brand}><View style={styles.brandIcon}><Ionicons name="shield-checkmark" size={21} color={C.bg} /></View><View><Text style={styles.brandName}>LocalMind</Text></View></View>;
}

export default function LocalMindShell({ active, title, subtitle, children, backPath }: { active?: string; title: string; subtitle?: string; children: ReactNode; backPath?: string }) {
  const { width } = useWindowDimensions();
  const mobile = width < 760;
  return <View style={styles.root}>
    {!mobile && <View style={styles.sidebar}><Brand /><View style={styles.nav}>{items.map(([icon,label,path]) => {
      const isActive = active === label;
      return <Pressable key={label} onPress={() => path ? router.push(path as never) : Alert.alert(label, `${label} navigation can be connected here.`)} style={({pressed}) => [styles.navItem,isActive&&styles.navItemActive,pressed&&styles.pressed]}>
        <Ionicons name={icon} size={19} color={isActive ? C.bg : "#C2CDD4"}/><Text style={[styles.navText,isActive&&styles.navTextActive]}>{label}</Text>
      </Pressable>;
    })}</View></View>}
    <View style={styles.content}>{mobile && <View style={styles.mobileBar}><Brand/><Pressable onPress={() => router.push("/modules" as never)}><Ionicons name="menu" size={24} color={C.text}/></Pressable></View>}<View style={styles.topBar}><View style={styles.titleWrap}><BackButton backPath={backPath} /><Ionicons name="school-outline" size={24} color={C.teal}/><View><Text style={styles.topTitle}>{title}</Text>{subtitle && <Text style={styles.topSubtitle}>{subtitle}</Text>}</View></View><UserMenu mobile={mobile} /></View>{children}</View>
  </View>;
}

const styles=StyleSheet.create({root:{flex:1,flexDirection:"row",backgroundColor:C.bg},sidebar:{width:264,backgroundColor:C.sidebar,borderRightWidth:1,borderRightColor:"#20303B",paddingHorizontal:18,paddingTop:28,paddingBottom:22},brand:{flexDirection:"row",alignItems:"center",gap:11,marginBottom:40},brandIcon:{width:34,height:34,borderRadius:8,backgroundColor:C.teal,alignItems:"center",justifyContent:"center"},brandName:{color:C.text,fontSize:20,fontWeight:"800"},brandSub:{color:"#A5B1B7",fontSize:9,fontWeight:"700",letterSpacing:1.1},nav:{gap:8},navItem:{height:48,borderRadius:7,paddingHorizontal:14,flexDirection:"row",alignItems:"center",gap:14},navItemActive:{backgroundColor:"#16C39B"},navText:{color:"#C2CDD4",fontSize:13,fontWeight:"600"},navTextActive:{color:C.bg,fontWeight:"800"},pressed:{opacity:.75},status:{backgroundColor:"#102033",borderWidth:1,borderColor:"#223B4C",borderRadius:10,padding:15},statusRow:{flexDirection:"row",alignItems:"center",gap:8},statusTitle:{color:C.text,fontSize:12,fontWeight:"700"},statusMain:{color:C.text,fontSize:15,fontWeight:"800",marginTop:12},statusText:{color:C.muted,fontSize:10,marginTop:4},pill:{alignSelf:"flex-start",backgroundColor:"#0C5E52",paddingHorizontal:10,paddingVertical:6,borderRadius:20,marginTop:10},pillText:{color:C.teal,fontSize:9,fontWeight:"800"},checked:{color:C.muted,fontSize:9,marginTop:12},content:{flex:1,minWidth:0},mobileBar:{height:62,paddingHorizontal:16,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},topBar:{height:88,borderBottomWidth:1,borderBottomColor:"#1B2C35",paddingHorizontal:30,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},titleWrap:{flexDirection:"row",alignItems:"center",gap:14},topTitle:{color:C.text,fontSize:21,fontWeight:"800"},topSubtitle:{color:C.muted,fontSize:11,marginTop:4},user:{height:42,borderWidth:1,borderColor:C.border,borderRadius:22,paddingHorizontal:9,flexDirection:"row",alignItems:"center",gap:8},avatar:{width:28,height:28,borderRadius:14,backgroundColor:"#D9F4ED",alignItems:"center",justifyContent:"center"},avatarText:{color:"#087B69",fontSize:12,fontWeight:"800"},userText:{color:C.text,fontSize:12,fontWeight:"700"}});
