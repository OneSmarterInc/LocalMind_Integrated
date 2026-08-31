import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import UserMenu from "../src/components/navigation/UserMenu";
import BackButton from "../src/components/navigation/BackButton";
import { useCourse } from "../src/context/CourseContext";

const C = {
  bg: "#0B1114",
  sidebar: "#0A1624",
  panel: "#111B28",
  border: "#263747",
  teal: "#38D9B0",
  text: "#F4F7F8",
  muted: "#A7B2BA",
  blue: "#4DA3FF",
  purple: "#A86BFF",
  gold: "#E7B52E",
};

const tones = [C.blue, C.teal, C.gold, "#FF6B8A", C.purple];

function Brand() {
  return (
    <View style={styles.brand}>
      <View style={styles.brandIcon}>
        <Ionicons name="shield-checkmark" size={22} color={C.bg} />
      </View>
      <View>
        <Text style={styles.brandName}>LocalMind</Text>
      </View>
    </View>
  );
}

function Sidebar() {
  const items = [
    ["grid-outline", "Dashboard", "/dashboard"],
    ["cloud-upload-outline", "Upload Book", "/"],
    ["library-outline", "My Courses", "/modules"],
    ["school-outline", "Learning", "/learning"],
    ["bar-chart-outline", "Progress", "/progress"],
    ["information-circle-outline", "About", undefined],
  ] as const;

  return (
    <View style={styles.sidebar}>
      <Brand />
      <View style={styles.nav}>
        {items.map(([icon, label, route]) => {
          const active = label === "My Courses";
          return (
            <Pressable
              key={label}
              onPress={() => route && router.push(route as never)}
              style={({ pressed }) => [
                styles.navItem,
                active && styles.navItemActive,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name={icon}
                size={19}
                color={active ? "#061417" : "#C2CDD4"}
              />
              <Text style={[styles.navText, active && styles.navTextActive]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
</View>
  );
}

export default function OverviewPage() {
  const { course } = useCourse();

  const totalModules =
    course?.chapters.reduce((sum, chapter) => sum + chapter.modules.length, 0) ?? 0;

  return (
    <View style={styles.root}>
      <Sidebar />
      <View style={styles.content}>
        <View style={styles.topBar}>
          <View style={styles.titleWrap}>
            <BackButton />
            <Ionicons name="library-outline" size={25} color={C.teal} />
            <View>
              <Text style={styles.topTitle}>Course Overview</Text>
              <Text style={styles.topSubtitle}>
                Review your generated chapters and modules.
              </Text>
            </View>
          </View>
          <UserMenu />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {!course ? (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons name="library-outline" size={34} color={C.teal} />
              </View>
              <Text style={styles.emptyTitle}>No Course Generated Yet</Text>
              <Text style={styles.emptyText}>
                Chapter names and module counts will be rendered from the
                course-generation response when your PDF-processing backend or
                local AI pipeline is connected.
              </Text>
              <Pressable style={styles.button} onPress={() => router.push("/")}>
                <Ionicons name="cloud-upload-outline" size={18} color={C.bg} />
                <Text style={styles.buttonText}>Upload Book</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.card}>
              <View style={styles.courseHeader}>
                <View style={styles.courseIcon}>
                  <Ionicons name="shield-half-outline" size={25} color={C.teal} />
                </View>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseMeta}>
                    {course.chapters.length} Chapters • {totalModules} Modules
                    {course.generatedAt ? ` • ${course.generatedAt}` : ""}
                  </Text>
                </View>
                <Pressable
                  style={styles.button}
                  onPress={() => {
                    const first = course.chapters[0]?.modules[0];
                    if (first) {
                      router.push({
                        pathname: "/learning",
                        params: { moduleId: first.id },
                      });
                    }
                  }}
                >
                  <Text style={styles.buttonText}>Start Learning</Text>
                  <Ionicons name="arrow-forward" size={14} color={C.bg} />
                </Pressable>
              </View>

              <View style={styles.divider} />

              <Text style={styles.heading}>Chapters</Text>
              <View style={styles.chapters}>
                {course.chapters.map((chapter, index) => {
                  const tone = chapter.tone ?? tones[index % tones.length];
                  return (
                    <Pressable
                      key={chapter.id}
                      style={styles.chapter}
                      onPress={() => router.push("/modules")}
                    >
                      <View style={[styles.chapterIcon, { backgroundColor: `${tone}20` }]}>
                        <Ionicons
                          name={(chapter.icon as keyof typeof Ionicons.glyphMap) ?? "book-outline"}
                          size={18}
                          color={tone}
                        />
                      </View>
                      <View style={styles.chapterText}>
                        <Text style={styles.chapterTitle}>
                          Chapter {index + 1}: {chapter.title}
                        </Text>
                        <Text style={styles.chapterSub}>
                          {chapter.modules.length} microlearning modules
                        </Text>
                      </View>
                      <Text style={styles.modules}>
                        {chapter.modules.length} Modules
                      </Text>
                      <Ionicons name="chevron-forward" size={16} color={C.muted} />
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: "row", backgroundColor: C.bg },
  sidebar: { width: 264, backgroundColor: C.sidebar, borderRightWidth: 1, borderRightColor: "#20303B", paddingHorizontal: 18, paddingTop: 28, paddingBottom: 22 },
  brand: { flexDirection: "row", alignItems: "center", gap: 11, marginBottom: 40 },
  brandIcon: { width: 34, height: 34, borderRadius: 8, backgroundColor: C.teal, alignItems: "center", justifyContent: "center" },
  brandName: { color: C.text, fontSize: 20, fontWeight: "800" },
  brandSub: { color: "#A5B1B7", fontSize: 9, fontWeight: "700", letterSpacing: 1.1 },
  nav: { gap: 8 },
  navItem: { height: 48, borderRadius: 7, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 14 },
  navItemActive: { backgroundColor: "#16C39B" },
  navText: { color: "#C2CDD4", fontSize: 13, fontWeight: "600" },
  navTextActive: { color: "#061417", fontWeight: "800" },
  pressed: { opacity: 0.75 },
  
  
  statusCard: { backgroundColor: "#102033", borderWidth: 1, borderColor: "#223B4C", borderRadius: 10, padding: 15 },
  statusTitleRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  statusIcon: { width: 29, height: 29, borderRadius: 8, backgroundColor: "#0D594F", alignItems: "center", justifyContent: "center" },
  statusTitle: { color: C.text, fontSize: 12, fontWeight: "700" },
  statusMain: { color: C.text, fontSize: 15, fontWeight: "800", marginTop: 12 },
  statusText: { color: C.muted, fontSize: 10, marginTop: 4 },
  localModePill: { alignSelf: "flex-start", backgroundColor: "#0C5E52", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, marginTop: 10 },
  localModeText: { color: C.teal, fontSize: 9, fontWeight: "800" },
  content: { flex: 1 },
  topBar: { height: 88, borderBottomWidth: 1, borderBottomColor: "#1B2C35", paddingHorizontal: 30, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  titleWrap: { flexDirection: "row", alignItems: "center", gap: 14 },
  topTitle: { color: C.text, fontSize: 21, fontWeight: "800" },
  topSubtitle: { color: C.muted, fontSize: 11, marginTop: 4 },
  userButton: { height: 42, borderWidth: 1, borderColor: C.border, borderRadius: 22, paddingHorizontal: 9, flexDirection: "row", alignItems: "center", gap: 8 },
  avatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#D9F4ED", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#087B69", fontSize: 12, fontWeight: "800" },
  userText: { color: C.text, fontSize: 12, fontWeight: "700" },
  scroll: { padding: 30, paddingBottom: 60 },
  card: { backgroundColor: C.panel, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 20 },
  courseHeader: { flexDirection: "row", alignItems: "center" },
  courseIcon: { width: 48, height: 48, borderRadius: 8, backgroundColor: "#0E3C36", alignItems: "center", justifyContent: "center", marginRight: 12 },
  courseInfo: { flex: 1 },
  courseTitle: { color: C.text, fontSize: 18, fontWeight: "800" },
  courseMeta: { color: C.muted, fontSize: 10, marginTop: 5 },
  button: { backgroundColor: C.teal, minHeight: 38, paddingHorizontal: 14, borderRadius: 7, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  buttonText: { color: C.bg, fontSize: 11, fontWeight: "800" },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 18 },
  heading: { color: C.text, fontSize: 13, fontWeight: "800", marginBottom: 10 },
  chapters: { gap: 8 },
  chapter: { minHeight: 60, borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, flexDirection: "row", alignItems: "center" },
  chapterIcon: { width: 34, height: 34, borderRadius: 7, alignItems: "center", justifyContent: "center", marginRight: 10 },
  chapterText: { flex: 1 },
  chapterTitle: { color: C.text, fontSize: 11, fontWeight: "800" },
  chapterSub: { color: C.muted, fontSize: 8, marginTop: 3 },
  modules: { color: C.muted, fontSize: 9, marginRight: 8 },
  empty: { minHeight: 520, backgroundColor: C.panel, borderWidth: 1, borderColor: C.border, borderRadius: 12, alignItems: "center", justifyContent: "center", padding: 30 },
  emptyIcon: { width: 76, height: 76, borderRadius: 38, backgroundColor: "#0B4B43", alignItems: "center", justifyContent: "center", marginBottom: 20 },
  emptyTitle: { color: C.text, fontSize: 26, fontWeight: "800" },
  emptyText: { color: C.muted, fontSize: 12, lineHeight: 19, textAlign: "center", maxWidth: 680, marginTop: 12 },
});
