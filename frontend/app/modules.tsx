import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import UserMenu from "../src/components/navigation/UserMenu";
import BackButton from "../src/components/navigation/BackButton";

import ModuleCard from "../src/features/module-kit/components/ModuleCard";
import type { ModuleItem } from "../src/features/module-kit/types/module";
import { useCourse, type CourseModule } from "../src/context/CourseContext";

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

const chapterTones = [C.blue, C.teal, C.gold, "#FF6B8A", C.purple];

function toModuleItem(module: CourseModule, chapterIndex: number, index: number): ModuleItem {
  return {
    id: module.id,
    code: module.code ?? `MOD-${chapterIndex + 1}-${index + 1}`,
    title: module.title,
    description: module.description ?? "Learning content generated from the selected textbook.",
    duration: module.duration ?? 5,
    category: module.category ?? "Basics",
    difficulty: module.difficulty ?? "Beginner",
    status: module.status ?? "NOT_STARTED",
    icon: module.icon ?? "book-open-page-variant-outline",
    progress: module.progress ?? 0,
    activities: module.activities,
  };
}

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
    ["information-circle-outline", "About", "/about"],
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

export default function ModulesScreen() {
  const { width } = useWindowDimensions();
  const mobile = width < 760;
  const { course } = useCourse();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalModules = useMemo(
    () =>
      course?.chapters.reduce(
        (total, chapter) => total + chapter.modules.length,
        0,
      ) ?? 0,
    [course],
  );

  const isModuleLocked = (chapterIndex: number, moduleIndex: number): boolean => {
    if (!course) return false;
    if (chapterIndex === 0 && moduleIndex === 0) return false;

    // Find the previous module in the same chapter
    if (moduleIndex > 0) {
      const prevModule = course.chapters[chapterIndex]?.modules[moduleIndex - 1];
      return prevModule?.status !== "COMPLETED";
    }

    // If first module of this chapter, find the last module of the previous chapter
    const prevChapter = course.chapters[chapterIndex - 1];
    if (prevChapter) {
      const prevModule = prevChapter.modules[prevChapter.modules.length - 1];
      return prevModule?.status !== "COMPLETED";
    }

    return false;
  };

  return (
    <View style={styles.root}>
      {!mobile && <Sidebar />}

      <View style={styles.content}>
        {mobile && (
          <View style={styles.mobileBrandBar}>
            <Brand />
            <Pressable
              style={styles.mobileMenuButton}
              onPress={() => router.push("/")}
            >
              <Ionicons name="menu" size={24} color={C.text} />
            </Pressable>
          </View>
        )}

        <View style={styles.topBar}>
          <View style={styles.topTitleWrap}>
        <BackButton />
            <Ionicons name="library-outline" size={25} color={C.teal} />
            <View>
              <Text style={styles.topTitle}>My Courses</Text>
              <Text style={styles.topSubtitle}>
                Explore your generated courses and microlearning modules.
              </Text>
            </View>
          </View>
          <UserMenu mobile={mobile} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {!course ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="library-outline" size={35} color={C.teal} />
              </View>
              <Text style={styles.emptyTitle}>No Courses Yet</Text>
              <Text style={styles.emptyText}>
                Your generated courses will appear here after the textbook is
                processed. Nothing is pre-filled on this page.
              </Text>
              <Pressable
                style={styles.uploadButton}
                onPress={() => router.push("/")}
              >
                <Ionicons name="cloud-upload-outline" size={18} color={C.bg} />
                <Text style={styles.uploadText}>Upload Book</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.courseHeader}>
                <View style={styles.courseIcon}>
                  <Ionicons name="book-outline" size={25} color={C.blue} />
                </View>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseMeta}>
                    {course.chapters.length} Chapters • {totalModules} Modules
                    {course.generatedAt ? ` • ${course.generatedAt}` : ""}
                  </Text>
                </View>
                <Pressable
                  style={styles.startButton}
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
                  <Ionicons name="play" size={15} color={C.bg} />
                  <Text style={styles.startText}>Start Learning</Text>
                </Pressable>
              </View>

              {course.chapters.map((chapter, chapterIndex) => {
                const expanded = expandedId === chapter.id;
                const tone = chapter.tone ?? chapterTones[chapterIndex % chapterTones.length];

                return (
                  <View key={chapter.id} style={styles.chapterSection}>
                    <Pressable
                      style={[styles.chapterRow, expanded && styles.chapterExpanded]}
                      onPress={() =>
                        setExpandedId(expanded ? null : chapter.id)
                      }
                    >
                      <View style={[styles.chapterIcon, { backgroundColor: `${tone}20` }]}>
                        <Ionicons
                          name={(chapter.icon as keyof typeof Ionicons.glyphMap) ?? "book-outline"}
                          size={19}
                          color={tone}
                        />
                      </View>
                      <View style={styles.chapterText}>
                        <Text style={styles.chapterTitle}>
                          Chapter {chapterIndex + 1}: {chapter.title}
                        </Text>
                        <Text style={styles.chapterSub}>
                          {chapter.modules.length} microlearning modules
                        </Text>
                      </View>
                      <Text style={styles.moduleCount}>
                        {chapter.modules.length} Modules
                      </Text>
                      <Ionicons
                        name={expanded ? "chevron-up" : "chevron-down"}
                        size={17}
                        color={C.muted}
                      />
                    </Pressable>

                    {expanded && (
                      <View style={styles.moduleGrid}>
                        {chapter.modules.map((module, index) => {
                          const item = toModuleItem(module, chapterIndex, index);
                          const locked = isModuleLocked(chapterIndex, index);
                          return (
                            <View key={module.id} style={styles.moduleCardWrap}>
                              <ModuleCard
                                module={item}
                                locked={locked}
                                onStart={() =>
                                  router.push({
                                    pathname: "/learning",
                                    params: { moduleId: module.id },
                                  })
                                }
                              />
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </View>
                );
              })}
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: "row", backgroundColor: C.bg },
  sidebar: {
    width: 264,
    backgroundColor: C.sidebar,
    borderRightWidth: 1,
    borderRightColor: "#20303B",
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 22,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 11, marginBottom: 40 },
  brandIcon: { width: 34, height: 34, borderRadius: 8, backgroundColor: C.teal, alignItems: "center", justifyContent: "center" },
  brandName: { color: C.text, fontSize: 20, fontWeight: "800", letterSpacing: -0.5 },
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
  checkedRow: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 12 },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.teal },
  checkedText: { color: C.muted, fontSize: 9, flex: 1 },
  content: { flex: 1, minWidth: 0 },
  mobileBrandBar: { height: 62, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  mobileMenuButton: { padding: 8 },
  topBar: { height: 88, borderBottomWidth: 1, borderBottomColor: "#1B2C35", paddingHorizontal: 30, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  topTitleWrap: { flexDirection: "row", alignItems: "center", gap: 14 },
  topTitle: { color: C.text, fontSize: 21, fontWeight: "800" },
  topSubtitle: { color: C.muted, fontSize: 11, marginTop: 4 },
  userButton: { height: 42, borderWidth: 1, borderColor: "#263747", borderRadius: 22, paddingHorizontal: 9, flexDirection: "row", alignItems: "center", gap: 8 },
  avatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#D9F4ED", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#087B69", fontSize: 12, fontWeight: "800" },
  userText: { color: C.text, fontSize: 12, fontWeight: "700" },
  scroll: { flex: 1 },
  scrollContent: { padding: 30, paddingBottom: 60, gap: 18 },
  courseHeader: { backgroundColor: C.panel, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 20, flexDirection: "row", alignItems: "center", gap: 14 },
  courseIcon: { width: 48, height: 48, borderRadius: 9, backgroundColor: "#12304A", alignItems: "center", justifyContent: "center" },
  courseInfo: { flex: 1, minWidth: 0 },
  courseTitle: { color: C.text, fontSize: 18, fontWeight: "800" },
  courseMeta: { color: C.muted, fontSize: 10, marginTop: 5 },
  startButton: { backgroundColor: C.teal, borderRadius: 7, height: 38, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 7 },
  startText: { color: C.bg, fontSize: 11, fontWeight: "800" },
  chapterSection: { gap: 10 },
  chapterRow: { minHeight: 62, backgroundColor: C.panel, borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 12 },
  chapterExpanded: { borderBottomLeftRadius: 4, borderBottomRightRadius: 4 },
  chapterIcon: { width: 38, height: 38, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  chapterText: { flex: 1, minWidth: 0 },
  chapterTitle: { color: C.text, fontSize: 12, fontWeight: "800" },
  chapterSub: { color: C.muted, fontSize: 9, marginTop: 3 },
  moduleCount: { color: C.muted, fontSize: 10, marginRight: 4 },
  moduleGrid: { flexDirection: "row", flexWrap: "wrap", gap: 14, paddingLeft: 8, paddingRight: 8 },
  moduleCardWrap: { flexGrow: 1, flexBasis: 420, maxWidth: 620 },
  emptyState: { minHeight: 520, backgroundColor: C.panel, borderWidth: 1, borderColor: C.border, borderRadius: 12, alignItems: "center", justifyContent: "center", padding: 35 },
  emptyIcon: { width: 78, height: 78, borderRadius: 39, backgroundColor: "#0B4B43", alignItems: "center", justifyContent: "center", marginBottom: 22 },
  emptyTitle: { color: C.text, fontSize: 28, fontWeight: "800" },
  emptyText: { color: C.muted, fontSize: 12, lineHeight: 19, textAlign: "center", maxWidth: 650, marginTop: 12 },
  uploadButton: { marginTop: 22, height: 45, paddingHorizontal: 18, borderRadius: 8, backgroundColor: C.teal, flexDirection: "row", alignItems: "center", gap: 8 },
  uploadText: { color: C.bg, fontSize: 12, fontWeight: "800" },
});
