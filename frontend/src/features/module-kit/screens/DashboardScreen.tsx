import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

const C = {
  bg: "#050D12",
  card: "#0B1820",
  border: "#203842",
  text: "#F4F7F8",
  muted: "#8FA19E",
  teal: "#19E6B5",
  blue: "#3B82F6",
  green: "#10B981",
  purple: "#8B5CF6",
  orange: "#F59E0B",
};

const dashboardCards = [
  {
    title: "Upload Book",
    description: "Upload your textbook\nfor AI processing",
    icon: "cloud-upload-outline" as const,
    color: C.blue,
    route: "/",
  },
  {
    title: "My Courses",
    description: "View and manage\nyour courses",
    icon: "book-outline" as const,
    color: C.green,
    route: "/modules",
  },
  {
    title: "Learning",
    description: "Continue your\nlearning journey",
    icon: "school-outline" as const,
    color: C.purple,
    route: "/learning",
  },
  {
    title: "Progress",
    description: "Track your learning\nprogress",
    icon: "bar-chart-outline" as const,
    color: C.orange,
    route: "/progress",
  },
];

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const isSmall = width < 700;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.dashboardIcon}>
            <Ionicons name="grid-outline" size={29} color={C.teal} />
          </View>

          <View>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>
              {"Welcome back! Let's continue your learning journey."}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>


          <View style={styles.userContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>U</Text>
            </View>
            <Text style={styles.userText}>User</Text>
            <Ionicons name="chevron-down" size={15} color={C.text} />
          </View>
        </View>
      </View>

      {/* Clickable navigation cards */}
      <View style={[styles.cardGrid, isSmall && styles.cardGridSmall]}>
        {dashboardCards.map((card) => (
          <Pressable
            key={card.title}
            onPress={() => router.push(card.route as never)}
            style={({ pressed }) => [
              styles.navigationCard,
              isSmall && styles.navigationCardSmall,
              pressed && styles.cardPressed,
            ]}
          >
            <View
              style={[
                styles.cardIcon,
                { backgroundColor: `${card.color}30` },
              ]}
            >
              <Ionicons name={card.icon} size={34} color={card.color} />
            </View>

            <Text style={styles.cardTitle}>{card.title}</Text>

            <Text style={styles.cardDescription}>
              {card.description}
            </Text>

            <View
              style={[
                styles.arrowButton,
                { borderColor: `${card.color}55` },
              ]}
            >
              <Ionicons
                name="arrow-forward"
                size={17}
                color={C.text}
              />
            </View>

            <View
              style={[
                styles.bottomLine,
                { backgroundColor: card.color },
              ]}
            />
          </Pressable>
        ))}
      </View>

      {/* Learning Progress */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View style={styles.progressTitleContainer}>
            <Ionicons
              name="trending-up-outline"
              size={21}
              color={C.teal}
            />
            <Text style={styles.progressTitle}>
              Learning Progress
            </Text>
          </View>

          <View style={styles.overviewButton}>
            <Text style={styles.overviewText}>Overview</Text>
            <Ionicons
              name="chevron-down"
              size={15}
              color={C.muted}
            />
          </View>
        </View>

        <View
          style={[
            styles.progressBody,
            isSmall && styles.progressBodySmall,
          ]}
        >
          <View style={styles.progressCircle}>
            <View style={styles.progressCircleInner}>
              <Text style={styles.progressPercentage}>0%</Text>
              <Text style={styles.progressSmallText}>
                Overall Progress
              </Text>
            </View>
          </View>

          <View style={styles.statistics}>
            <ProgressStat
              color={C.teal}
              value="0"
              label={"Completed\nModules"}
            />
            <ProgressStat
              color={C.blue}
              value="4"
              label={"Available\nModules"}
            />
            <ProgressStat
              color={C.purple}
              value="0"
              label={"In Progress\nModules"}
            />
            <ProgressStat
              color={C.orange}
              value="4"
              label={"Not Started\nModules"}
            />
          </View>

          {!isSmall && (
            <View style={styles.illustration}>
              <Ionicons
                name="shield-checkmark-outline"
                size={66}
                color={C.teal}
              />
              <Ionicons
                name="analytics-outline"
                size={55}
                color={C.teal}
                style={styles.analyticsIcon}
              />
            </View>
          )}
        </View>
      </View>

      {/* Local AI Learning */}
      <View style={styles.aiCard}>
        <View style={styles.aiIcon}>
          <Ionicons name="bulb-outline" size={29} color={C.teal} />
        </View>

        <View style={styles.aiTextContainer}>
          <Text style={styles.aiTitle}>Local AI Learning</Text>
          <Text style={styles.aiDescription}>
            Your course information can be generated from the selected
            textbook once the local AI processing pipeline is connected.
          </Text>
        </View>

        <Ionicons
          name="shield-checkmark-outline"
          size={45}
          color={C.teal}
        />
      </View>

      {/* Privacy message */}
      <View style={styles.privacyCard}>
        <Ionicons name="sparkles-outline" size={25} color={C.teal} />
        <Text style={styles.privacyText}>
          LocalMind keeps your learning workflow private and local.
        </Text>
      </View>
    </ScrollView>
  );
}

function ProgressStat({
  color,
  value,
  label,
}: {
  color: string;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.stat}>
      <View style={[styles.statDot, { backgroundColor: color }]} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },

  content: {
    padding: 24,
    paddingBottom: 45,
  },

  header: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  dashboardIcon: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  title: {
    color: C.text,
    fontSize: 27,
    fontWeight: "800",
  },

  subtitle: {
    color: C.muted,
    fontSize: 12,
    marginTop: 3,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  headerIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },

  userContainer: {
    height: 42,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: "#263A43",
    paddingHorizontal: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  avatar: {
    width: 27,
    height: 27,
    borderRadius: 15,
    backgroundColor: "#DDF7EF",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#087B69",
    fontSize: 12,
    fontWeight: "800",
  },

  userText: {
    color: C.text,
    fontSize: 12,
    fontWeight: "700",
  },

  cardGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },

  cardGridSmall: {
    flexWrap: "wrap",
  },

  navigationCard: {
    flex: 1,
    minHeight: 145,
    minWidth: 150,
    backgroundColor: C.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    position: "relative",
    overflow: "hidden",
  },

  navigationCardSmall: {
    minWidth: "47%",
  },

  cardPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },

  cardIcon: {
    width: 54,
    height: 54,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  cardTitle: {
    color: C.text,
    fontSize: 14,
    fontWeight: "800",
  },

  cardDescription: {
    color: "#91A09D",
    fontSize: 10,
    lineHeight: 15,
    marginTop: 7,
  },

  arrowButton: {
    position: "absolute",
    right: 11,
    bottom: 11,
    width: 32,
    height: 32,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  bottomLine: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
  },

  progressCard: {
    backgroundColor: "#081720",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#183440",
    padding: 17,
    marginBottom: 15,
  },

  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  progressTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  progressTitle: {
    color: C.text,
    fontSize: 14,
    fontWeight: "800",
  },

  overviewButton: {
    borderWidth: 1,
    borderColor: "#1D3741",
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  overviewText: {
    color: "#B4C0BD",
    fontSize: 10,
  },

  progressBody: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 130,
  },

  progressBodySmall: {
    flexDirection: "column",
  },

  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 9,
    borderColor: "#243841",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },

  progressCircleInner: {
    alignItems: "center",
  },

  progressPercentage: {
    color: C.text,
    fontSize: 23,
    fontWeight: "900",
  },

  progressSmallText: {
    color: "#83938F",
    fontSize: 8,
    marginTop: 3,
  },

  statistics: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  stat: {
    alignItems: "center",
    minWidth: 75,
    paddingHorizontal: 5,
  },

  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 7,
  },

  statValue: {
    color: C.text,
    fontSize: 20,
    fontWeight: "800",
  },

  statLabel: {
    color: "#82918E",
    fontSize: 8,
    textAlign: "center",
    lineHeight: 12,
    marginTop: 3,
  },

  illustration: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  analyticsIcon: {
    position: "absolute",
    left: 5,
    bottom: 2,
  },

  aiCard: {
    minHeight: 70,
    backgroundColor: "#071C20",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#125046",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  aiIcon: {
    width: 44,
    height: 44,
    borderRadius: 23,
    backgroundColor: "#0C4A3F",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  aiTextContainer: {
    flex: 1,
  },

  aiTitle: {
    color: C.teal,
    fontSize: 13,
    fontWeight: "800",
  },

  aiDescription: {
    color: "#8FA19D",
    fontSize: 9,
    lineHeight: 14,
    marginTop: 3,
  },

  privacyCard: {
    minHeight: 52,
    backgroundColor: "#061B1C",
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#10473F",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  privacyText: {
    color: "#8FA19D",
    fontSize: 9,
    flex: 1,
  },
});
