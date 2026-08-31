import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import LocalMindShell from "../src/components/navigation/LocalMindShell";

const C = {
  panel: "#111B28",
  panel2: "#172334",
  border: "#223143",
  teal: "#38D9B0",
  text: "#F4F7F8",
  muted: "#A7B3B9",
  dim: "#788792",
  bg: "#0B1114",
};

export default function AboutScreen() {
  const { width } = useWindowDimensions();
  const mobile = width < 760;

  return (
    <LocalMindShell
      active="About"
      title="About"
      subtitle="Learn more about LocalMind."
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          mobile && styles.scrollContentMobile,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.logo}>
            <Ionicons name="shield-checkmark" size={36} color={C.bg} />
          </View>

          <Text style={styles.title}>LocalMind</Text>
          <Text style={styles.subtitle}>Cybersecurity Learning Platform</Text>
          <Text style={styles.description}>
            LocalMind is a privacy-focused learning platform designed to
            transform textbooks into interactive microlearning experiences.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>About LocalMind</Text>
          <Text style={styles.cardText}>
            LocalMind helps students learn from their own study material
            through structured microlearning modules, explanations, quizzes,
            and progress tracking.
          </Text>
          <Text style={styles.cardText}>
            The platform is designed with privacy and local processing in
            mind, allowing learners to keep their learning data under their
            control.
          </Text>
        </View>

        <View style={[styles.features, mobile && styles.featuresMobile]}>
          <FeatureCard
            icon="hardware-chip-outline"
            title="Local AI"
            text="AI-powered learning assistance designed for local and privacy-focused usage."
          />
          <FeatureCard
            icon="lock-closed-outline"
            title="Privacy First"
            text="Your learning content and progress are designed to remain private."
          />
          <FeatureCard
            icon="school-outline"
            title="Microlearning"
            text="Learn complex topics through smaller, structured learning modules."
          />
        </View>

        <View style={styles.versionCard}>
          <Text style={styles.versionTitle}>LocalMind</Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.versionText}>
            Built for privacy-focused learning.
          </Text>
        </View>

        <View style={styles.linksCard}>
          <Text style={styles.linksTitle}>Quick Links</Text>
          <Text style={styles.linkText} onPress={() => router.push("/settings")}>
            Settings →
          </Text>
          <Text style={styles.linkText} onPress={() => router.push("/profile")}>
            Profile →
          </Text>
        </View>
      </ScrollView>
    </LocalMindShell>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  text: string;
}) {
  return (
    <View style={styles.featureCard}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon} size={22} color={C.teal} />
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 30,
    paddingBottom: 50,
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
  },
  scrollContentMobile: { paddingHorizontal: 16, paddingTop: 22 },
  hero: { alignItems: "center", paddingVertical: 18, marginBottom: 24 },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: C.teal,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  title: { color: C.text, fontSize: 31, fontWeight: "900" },
  subtitle: { color: C.teal, fontSize: 14, fontWeight: "800", marginTop: 6 },
  description: {
    color: C.muted,
    fontSize: 13,
    lineHeight: 21,
    textAlign: "center",
    maxWidth: 680,
    marginTop: 14,
  },
  card: {
    backgroundColor: C.panel,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    padding: 24,
    marginBottom: 18,
  },
  cardTitle: { color: C.text, fontSize: 19, fontWeight: "800", marginBottom: 11 },
  cardText: { color: C.muted, fontSize: 13, lineHeight: 21, marginBottom: 9 },
  features: { flexDirection: "row", gap: 16, marginBottom: 18 },
  featuresMobile: { flexDirection: "column" },
  featureCard: {
    flex: 1,
    minHeight: 185,
    backgroundColor: C.panel,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 13,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  featureIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#103C35",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  featureTitle: { color: C.text, fontSize: 15, fontWeight: "800", marginBottom: 7 },
  featureText: { color: C.muted, fontSize: 11, lineHeight: 18, textAlign: "center" },
  versionCard: {
    backgroundColor: C.panel2,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 13,
    padding: 20,
    alignItems: "center",
    marginBottom: 18,
  },
  versionTitle: { color: C.text, fontSize: 14, fontWeight: "800" },
  versionText: { color: C.dim, fontSize: 11, marginTop: 5 },
  linksCard: {
    backgroundColor: C.panel,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 13,
    padding: 20,
  },
  linksTitle: { color: C.text, fontSize: 14, fontWeight: "800", marginBottom: 12 },
  linkText: { color: C.teal, fontSize: 12, fontWeight: "700", marginTop: 8 },
});
