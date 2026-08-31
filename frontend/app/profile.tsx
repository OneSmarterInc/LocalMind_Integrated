import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import UserMenu from "../src/components/navigation/UserMenu";
import BackButton from "../src/components/navigation/BackButton";

const C = {
  bg: "#0B1114",
  sidebar: "#0A1624",
  card: "#111B28",
  border: "#223143",
  teal: "#38D9B0",
  text: "#F4F7F8",
  muted: "#A7B2BA",
};

export default function ProfileScreen() {
  return (
    <View style={styles.root}>
      <View style={styles.sidebar}>
        <View style={styles.brandRow}>
          <View style={styles.brandIcon}>
            <Ionicons name="shield-checkmark" size={21} color={C.bg} />
          </View>
          <View>
            <Text style={styles.brandName}>LocalMind</Text>
          </View>
        </View>

      </View>

      <View style={styles.main}>
        <View style={styles.topBar}>
          <View style={styles.titleWrap}>
            <BackButton />
            <Ionicons name="person-outline" size={24} color={C.teal} />
            <View>
              <Text style={styles.title}>Profile</Text>
              <Text style={styles.subtitle}>Manage your LocalMind profile.</Text>
            </View>
          </View>
          <UserMenu />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>U</Text>
              <View style={styles.onlineDot} />
            </View>

            <Text style={styles.name}>User</Text>
            <Text style={styles.role}>Learner</Text>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="person-outline" size={18} color={C.teal} />
              </View>
              <View>
                <Text style={styles.label}>Account Type</Text>
                <Text style={styles.value}>Learner</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="shield-checkmark-outline" size={18} color={C.teal} />
              </View>
              <View>
                <Text style={styles.label}>Privacy Mode</Text>
                <Text style={styles.value}>Local / Private</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="hardware-chip-outline" size={18} color={C.teal} />
              </View>
              <View>
                <Text style={styles.label}>AI Processing</Text>
                <Text style={styles.value}>Local AI</Text>
              </View>
            </View>
          </View>
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
    padding: 24,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandIcon: {
    width: 34, height: 34, borderRadius: 8, backgroundColor: C.teal,
    alignItems: "center", justifyContent: "center",
  },
  brandName: { color: C.text, fontSize: 20, fontWeight: "800" },
  brandSub: { color: "#A5B1B7", fontSize: 9, fontWeight: "700", letterSpacing: 1.1 },
  backButton: {
    marginTop: 40, flexDirection: "row", alignItems: "center", gap: 8,
    paddingVertical: 12,
  },
  backText: { color: C.muted, fontSize: 13, fontWeight: "700" },
  main: { flex: 1, minWidth: 0 },
  topBar: {
    height: 82, paddingHorizontal: 30, borderBottomWidth: 1,
    borderBottomColor: "#1D2A34", flexDirection: "row",
    alignItems: "center", justifyContent: "space-between",
  },
  titleWrap: { flexDirection: "row", alignItems: "center", gap: 14 },
  title: { color: C.text, fontSize: 19, fontWeight: "800" },
  subtitle: { color: C.muted, fontSize: 11, marginTop: 3 },
  content: { padding: 30, alignItems: "center" },
  profileCard: {
    width: "100%", maxWidth: 650, backgroundColor: C.card,
    borderWidth: 1, borderColor: C.border, borderRadius: 15,
    padding: 30, alignItems: "center",
  },
  avatar: {
    width: 82, height: 82, borderRadius: 41, backgroundColor: "#DDF4EE",
    borderWidth: 2, borderColor: C.teal, alignItems: "center", justifyContent: "center",
    position: "relative",
  },
  avatarText: { color: "#147760", fontSize: 30, fontWeight: "900" },
  onlineDot: {
    position: "absolute", width: 14, height: 14, borderRadius: 7,
    backgroundColor: C.teal, borderWidth: 3, borderColor: C.card,
    right: 1, bottom: 1,
  },
  name: { color: C.text, fontSize: 22, fontWeight: "900", marginTop: 15 },
  role: { color: C.teal, fontSize: 13, fontWeight: "700", marginTop: 4 },
  divider: { width: "100%", height: 1, backgroundColor: C.border, marginVertical: 25 },
  infoRow: {
    width: "100%", flexDirection: "row", alignItems: "center",
    paddingVertical: 13, gap: 14,
  },
  infoIcon: {
    width: 42, height: 42, borderRadius: 10, backgroundColor: "#0D302B",
    alignItems: "center", justifyContent: "center",
  },
  label: { color: C.muted, fontSize: 10, marginBottom: 3 },
  value: { color: C.text, fontSize: 13, fontWeight: "700" },
});
