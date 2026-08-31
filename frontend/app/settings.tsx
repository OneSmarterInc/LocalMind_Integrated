import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import LocalMindShell from "../src/components/navigation/LocalMindShell";

const C = {
  bg: "#0B1114",
  card: "#111B28",
  border: "#223143",
  teal: "#38D9B0",
  text: "#F4F7F8",
  muted: "#A7B2BA",
  pressed: "#172633",
};

export default function SettingsScreen() {
  const { width } = useWindowDimensions();
  const mobile = width < 760;

  return (
    <LocalMindShell
      active="Settings"
      title="Settings"
      subtitle="Manage your LocalMind preferences."
    >
      <ScrollView
        contentContainerStyle={[styles.content, mobile && styles.mobileContent]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <SettingRow
            icon="person-outline"
            title="Profile"
            description="View and manage your learner profile."
            onPress={() => router.push("/profile")}
          />

          <SettingRow
            icon="shield-checkmark-outline"
            title="Privacy"
            description="Your learning content and progress stay local."
          />

          <SettingRow
            icon="notifications-outline"
            title="Notifications"
            description="Notification preferences can be connected here."
          />

          <SettingRow
            icon="information-circle-outline"
            title="About LocalMind"
            description="Learn about the LocalMind platform."
            onPress={() => router.push("/about")}
          />
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons name="settings-outline" size={20} color={C.teal} />
          </View>
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Local Settings</Text>
            <Text style={styles.infoDescription}>
              LocalMind currently keeps these preferences inside the app UI.
              Authentication and persistent settings can be connected later
              without changing this navigation structure.
            </Text>
          </View>
        </View>
      </ScrollView>
    </LocalMindShell>
  );
}

function SettingRow({
  icon,
  title,
  description,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={19} color={C.teal} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      {onPress && <Ionicons name="chevron-forward" size={17} color={C.muted} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 30,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },
  mobileContent: { padding: 16 },
  card: {
    width: "100%",
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 15,
    padding: 8,
  },
  row: {
    minHeight: 78,
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  rowPressed: { backgroundColor: C.pressed },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#0D302B",
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: { flex: 1 },
  rowTitle: { color: C.text, fontSize: 13, fontWeight: "800" },
  rowDescription: { color: C.muted, fontSize: 10, marginTop: 3 },
  infoCard: {
    marginTop: 18,
    width: "100%",
    backgroundColor: "#102033",
    borderWidth: 1,
    borderColor: "#223B4C",
    borderRadius: 14,
    padding: 18,
    flexDirection: "row",
    gap: 13,
  },
  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#0D302B",
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: { flex: 1 },
  infoTitle: { color: C.text, fontSize: 13, fontWeight: "800" },
  infoDescription: { color: C.muted, fontSize: 10, lineHeight: 17, marginTop: 4 },
});
