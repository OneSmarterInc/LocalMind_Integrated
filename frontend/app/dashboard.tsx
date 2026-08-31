import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useEffect } from "react";
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
import { useCourse } from "../src/context/CourseContext";

const C = {
  bg: "#080F13",
  sidebar: "#071522",
  card: "#0F1B24",
  card2: "#101F2A",
  border: "#1C3441",
  teal: "#25D0AA",
  tealDark: "#0C5E52",
  text: "#F4F7F8",
  muted: "#8FA3AE",
  blue: "#4DA3FF",
  purple: "#9A6BFF",
  yellow: "#F3B51B",
  white: "#FFFFFF",
};

type NavItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: "grid-outline", route: "/dashboard" },
  { label: "Upload Book", icon: "cloud-upload-outline", route: "/" },
  { label: "My Courses", icon: "library-outline", route: "/modules" },
  { label: "Learning", icon: "school-outline", route: "/learning" },
  { label: "Progress", icon: "bar-chart-outline", route: "/progress" },
  { label: "About", icon: "information-circle-outline", route: "/about" },
];

export default function Dashboard() {
  const { width } = useWindowDimensions();
  const { course, quizResults, recentBooks, uploadedBooks, switchCourse, fetchUploadedBooks } = useCourse();

  useEffect(() => {
    fetchUploadedBooks();
  }, []);


  const isDesktop = width >= 900;

  const totalCourses = course ? 1 : 0;
  const totalModules = useMemo(
    () =>
      course?.chapters.reduce(
        (total, chapter) => total + chapter.modules.length,
        0,
      ) ?? 0,
    [course],
  );

  const completedModules = useMemo(() => {
    if (!course) return 0;

    return course.chapters.reduce((total, chapter) => {
      return (
        total +
        chapter.modules.filter((module) => {
          if (module.status === "COMPLETED") return true;
          if (typeof module.progress === "number" && module.progress >= 100) return true;
          if (quizResults[module.id]) return true;
          return Boolean(
            module.activities?.length &&
              module.activities.every((activity) => activity.completed),
          );
        }).length
      );
    }, 0);
  }, [course, quizResults]);

  const progress =
    totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  const inProgressModules = useMemo(() => {
    if (!course) return 0;

    return course.chapters.reduce((total, chapter) => {
      return (
        total +
        chapter.modules.filter((module) => {
          if (quizResults[module.id]) return false;
          if (module.status === "IN_PROGRESS") return true;
          const moduleProgress = module.progress ?? 0;
          return moduleProgress > 0 && moduleProgress < 100;
        }).length
      );
    }, 0);
  }, [course, quizResults]);

  const availableModules = Math.max(totalModules - completedModules, 0);

  const go = (route?: string) => {
    if (route) {
      router.push(route as never);
    }
  };

  return (
    <View style={styles.root}>
      {isDesktop && (
        <View style={styles.sidebar}>
          <Brand />

          <View style={styles.nav}>
            {NAV_ITEMS.map((item) => {
              const active = item.label === "Dashboard";

              return (
                <Pressable
                  key={item.label}
                  onPress={() => go(item.route)}
                  style={({ pressed }) => [
                    styles.navItem,
                    active && styles.navItemActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={active ? C.bg : C.text}
                  />
                  <Text
                    style={[styles.navText, active && styles.navTextActive]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          </View>
      )}

      <View style={styles.main}>
        <View style={styles.topbar}>
          <View style={styles.headerLeft}>
            <BackButton />
            <Ionicons name="grid-outline" size={28} color={C.teal} />
            <View>
              <Text style={styles.pageTitle}>Dashboard</Text>
              <Text style={styles.pageSubtitle}>
                Welcome back! Here&apos;s your learning overview.
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}><UserMenu />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingHorizontal: isDesktop ? 34 : 18 },
          ]}
        >
          <View style={styles.statsGrid}>
            <StatCard
              icon="library-outline"
              color={C.teal}
              label="Courses"
              value={String(totalCourses)}
              helper="Generated courses"
            />
            <StatCard
              icon="layers-outline"
              color={C.blue}
              label="Modules"
              value={String(totalModules)}
              helper="Microlearning modules"
            />
            <StatCard
              icon="checkmark-circle-outline"
              color={C.purple}
              label="Completed Modules"
              value={totalModules ? String(completedModules) : "—"}
              helper={
                totalModules ? `${progress}% completed` : "No learning data yet"
              }
            />
            <StatCard
              icon="play-circle-outline"
              color={C.yellow}
              label="In Progress"
              value={totalModules ? String(inProgressModules) : "—"}
              helper={
                totalModules
                  ? `${availableModules} modules available`
                  : "No learning data yet"
              }
            />
          </View>

          <View style={[styles.panel, { width: "100%", marginBottom: 16 }]}>
            <View style={styles.panelHeader}>
              <View style={styles.panelTitleRow}>
                <Ionicons name="book-outline" size={21} color={C.teal} />
                <Text style={styles.panelTitle}>Textbooks Library</Text>
              </View>
              <Text style={styles.historyCount}>{uploadedBooks.length} uploaded</Text>
            </View>

            {uploadedBooks.length > 0 ? (
              <View style={{ gap: 14 }}>
                {uploadedBooks.map((book) => {
                  const isActive = course?.id === book.id;
                  return (
                    <View key={book.id} style={styles.libraryRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.libraryTitle, isActive && { color: C.teal, fontWeight: "900" }]}>
                          {book.title || book.original_name} {isActive && "• (Active)"}
                        </Text>
                        <Text style={styles.libraryMeta}>
                          {book.completed_modules} of {book.total_modules} modules completed ({book.progress}%)
                        </Text>
                        <View style={styles.libraryBarTrack}>
                          <View style={[styles.libraryBarFill, { width: `${book.progress}%` }]} />
                        </View>
                      </View>
                      <Pressable 
                        style={[styles.libraryButton, isActive && { backgroundColor: "#1E2C3D" }]}
                        onPress={async () => {
                          const switched = await switchCourse(book.id);
                          if (switched) {
                            router.push("/modules");
                          }
                        }}
                      >
                        <Text style={styles.libraryButtonText}>{isActive ? "Review Outline" : "Continue Learning"}</Text>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={{ paddingVertical: 20, alignItems: "center" }}>
                <Text style={{ color: C.muted, fontSize: 11 }}>No books uploaded yet. Go to Upload Book to add one.</Text>
              </View>
            )}
          </View>

          <View style={styles.twoColumn}>
            <View style={[styles.panel, styles.activityPanel]}>
              <View style={styles.panelHeader}>
                <View style={styles.panelTitleRow}>
                  <Ionicons name="time-outline" size={21} color={C.teal} />
                  <Text style={styles.panelTitle}>Recent History</Text>
                </View>
                <Text style={styles.historyCount}>{recentBooks.length} saved</Text>
              </View>

              {recentBooks.length > 0 ? (
                <View>
                  {recentBooks.map((book) => (
                    <ActivityRow
                      key={book.id}
                      icon="document-text-outline"
                      color={C.teal}
                      title={book.name}
                      description={`PDF • ${formatFileSize(book.size)} • ${formatRecentTime(book.uploadedAt)}`}
                    />
                  ))}
                </View>
              ) : (
                <EmptyActivity />
              )}
            </View>

            <View style={[styles.panel, styles.progressPanel]}>
              <View style={styles.panelHeader}>
                <View style={styles.panelTitleRow}>
                  <Ionicons
                    name="trending-up-outline"
                    size={21}
                    color={C.teal}
                  />
                  <Text style={styles.panelTitle}>Learning Progress</Text>
                </View>
              </View>

              <View style={styles.progressOnly}>
                <Text style={styles.progressPercentLarge}>{progress}%</Text>
                <Text style={styles.progressLabel}>Overall Progress</Text>
                <View style={styles.progressBarTrack}>
                  <View
                    style={[styles.progressBarFill, { width: `${progress}%` }]}
                  />
                </View>
                <Text style={styles.progressDetails}>
                  {completedModules} of {totalModules} modules completed
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Ionicons name="bulb-outline" size={25} color={C.teal} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.tipTitle}>Local AI Learning</Text>
              <Text style={styles.tipText}>
                Your course information can be generated from the selected
                textbook once the local AI processing pipeline is connected.
              </Text>
            </View>
            <Ionicons
              name="shield-checkmark-outline"
              size={48}
              color={C.teal}
            />
          </View>

          <View style={styles.footerCard}>
            <Ionicons name="sparkles-outline" size={22} color={C.teal} />
            <Text style={styles.footerText}>
              LocalMind keeps your learning workflow private and local.
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

function Brand() {
  return (
    <View style={styles.brand}>
      <View style={styles.brandIcon}>
        <Ionicons name="shield-checkmark" size={23} color={C.bg} />
      </View>
      <View>
        <Text style={styles.brandName}>LocalMind</Text>
      </View>
    </View>
  );
}

function StatCard({
  icon,
  color,
  label,
  value,
  helper,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${color}22` }]}>
        <Ionicons name={icon} size={25} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statHelper}>{helper}</Text>
      </View>
    </View>
  );
}

function ActivityRow({
  icon,
  color,
  title,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.activityRow}>
      <View style={[styles.activityDot, { backgroundColor: color }]}>
        <Ionicons name={icon} size={15} color={C.bg} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityDescription} numberOfLines={2}>
          {description}
        </Text>
      </View>
    </View>
  );
}

function formatFileSize(bytes?: number) {
  if (!bytes) return "Unknown size";
  const mb = bytes / (1024 * 1024);
  return mb < 1
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${mb.toFixed(1)} MB`;
}

function formatRecentTime(value: string) {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "Recently";

  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function EmptyActivity() {
  return (
    <View style={styles.emptyActivity}>
      <Ionicons name="time-outline" size={30} color={C.muted} />
      <Text style={styles.emptyTitle}>No recent activity</Text>
      <Text style={styles.emptyText}>
        Your activity will appear here as you use LocalMind.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: C.bg,
  },
  sidebar: {
    width: 285,
    backgroundColor: C.sidebar,
    borderRightWidth: 1,
    borderRightColor: C.border,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 22,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 48,
  },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: 9,
    backgroundColor: C.teal,
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    color: C.text,
    fontSize: 21,
    fontWeight: "800",
  },
  brandSub: {
    color: C.muted,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.1,
    marginTop: 2,
  },
  nav: {
    gap: 8,
  },
  navItem: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  navItemActive: {
    backgroundColor: C.teal,
  },
  navText: {
    color: C.text,
    fontSize: 14,
    fontWeight: "600",
  },
  navTextActive: {
    color: C.bg,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.72,
  },
  
  
  statusCard: {
    backgroundColor: "#102033",
    borderWidth: 1,
    borderColor: "#223B4C",
    borderRadius: 12,
    padding: 16,
  },
  statusTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  statusIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#0D594F",
    alignItems: "center",
    justifyContent: "center",
  },
  statusTitle: {
    color: C.text,
    fontSize: 13,
    fontWeight: "700",
  },
  statusMain: {
    color: C.text,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 14,
  },
  statusSub: {
    color: C.muted,
    fontSize: 12,
    marginTop: 4,
  },
  statusDotRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.teal,
  },
  statusChecked: {
    color: C.muted,
    fontSize: 10,
    flex: 1,
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
  topbar: {
    height: 88,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingHorizontal: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 17,
  },
  pageTitle: {
    color: C.text,
    fontSize: 23,
    fontWeight: "800",
  },
  pageSubtitle: {
    color: C.muted,
    fontSize: 12,
    marginTop: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  userPill: {
    height: 44,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 22,
    paddingHorizontal: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  avatar: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: "#D9F4ED",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#087B69",
    fontSize: 13,
    fontWeight: "800",
  },
  userText: {
    color: C.text,
    fontSize: 13,
    fontWeight: "700",
  },
  content: {
    paddingTop: 30,
    paddingBottom: 40,
    gap: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  statCard: {
    flex: 1,
    minWidth: 210,
    minHeight: 120,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 11,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  statIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    color: C.text,
    fontSize: 13,
    fontWeight: "600",
  },
  statValue: {
    color: C.text,
    fontSize: 25,
    fontWeight: "800",
    marginTop: 4,
  },
  statHelper: {
    color: C.muted,
    fontSize: 10,
    marginTop: 2,
  },
  twoColumn: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  panel: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 11,
    padding: 20,
    minHeight: 350,
  },
  activityPanel: {
    flex: 1,
    minWidth: 360,
  },
  progressPanel: {
    flex: 1,
    minWidth: 360,
  },
  progressOnly: {
    flex: 1,
    minHeight: 250,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  progressPercentLarge: {
    color: C.teal,
    fontSize: 52,
    fontWeight: "900",
    letterSpacing: -1,
  },
  progressLabel: {
    color: C.muted,
    fontSize: 12,
    marginTop: 2,
  },
  progressBarTrack: {
    width: "100%",
    maxWidth: 390,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#243541",
    overflow: "hidden",
    marginTop: 24,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 6,
    backgroundColor: C.teal,
  },
  progressDetails: {
    color: C.muted,
    fontSize: 11,
    marginTop: 12,
  },
  historyCount: {
    color: C.muted,
    fontSize: 10,
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  panelTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  panelTitle: {
    color: C.text,
    fontSize: 15,
    fontWeight: "800",
  },
  periodPill: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 7,
    paddingHorizontal: 11,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  periodText: {
    color: C.text,
    fontSize: 11,
  },
  activityRow: {
    flexDirection: "row",
    gap: 13,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#172A34",
  },
  activityDot: {
    width: 29,
    height: 29,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  activityTitle: {
    color: C.text,
    fontSize: 12,
    fontWeight: "700",
  },
  activityDescription: {
    color: C.muted,
    fontSize: 11,
    marginTop: 4,
  },
  emptyActivity: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 190,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: C.text,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 10,
  },
  emptyText: {
    color: C.muted,
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 6,
  },
  activityEmptySpace: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },

  tipCard: {
    backgroundColor: "#0D1D25",
    borderWidth: 1,
    borderColor: "#1D3E42",
    borderRadius: 11,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0B5148",
    alignItems: "center",
    justifyContent: "center",
  },
  tipTitle: {
    color: C.teal,
    fontSize: 14,
    fontWeight: "800",
  },
  tipText: {
    color: C.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },
  footerCard: {
    borderWidth: 1,
    borderColor: "#17463F",
    backgroundColor: "#0B201D",
    borderRadius: 10,
    minHeight: 55,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  footerText: {
    color: C.muted,
    fontSize: 11,
    flex: 1,
  },
  libraryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingBottom: 12,
  },
  libraryTitle: {
    color: C.text,
    fontSize: 13,
    fontWeight: "700",
  },
  libraryMeta: {
    color: C.muted,
    fontSize: 10,
    marginTop: 4,
  },
  libraryBarTrack: {
    height: 5,
    backgroundColor: C.border,
    borderRadius: 3,
    marginTop: 7,
    width: "100%",
    maxWidth: 300,
  },
  libraryBarFill: {
    height: "100%",
    backgroundColor: C.teal,
    borderRadius: 3,
  },
  libraryButton: {
    backgroundColor: C.teal,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  libraryButtonText: {
    color: C.bg,
    fontSize: 10,
    fontWeight: "900",
  },
});
