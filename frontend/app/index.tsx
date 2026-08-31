import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { useState } from "react";
import { useCourse } from "../src/context/CourseContext";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import UserMenu from "../src/components/navigation/UserMenu";
import BackButton from "../src/components/navigation/BackButton";

const C = {
  bg: "#0B1114",
  sidebar: "#0A1624",
  panel: "#121C2A",
  panel2: "#172334",
  border: "#223143",
  teal: "#38D9B0",
  tealDark: "#0B8F78",
  text: "#F4F7F8",
  muted: "#A7B2BA",
  dim: "#6F7C85",
  blue: "#4DA3FF",
  purple: "#A86BFF",
  gold: "#E7B52E",
};

const benefits = [
  {
    icon: "pulse-outline" as const,
    title: "Works Offline",
    text: "No internet connection needed after setup.",
    tone: C.teal,
  },
  {
    icon: "shield-checkmark-outline" as const,
    title: "Data Stays Local",
    text: "Your data is processed locally and stays private.",
    tone: C.blue,
  },
  {
    icon: "lock-closed-outline" as const,
    title: "No Internet Required",
    text: "Use all features without an active internet.",
    tone: C.purple,
  },
  {
    icon: "server-outline" as const,
    title: "Local Storage",
    text: "Your uploaded books and progress are stored locally.",
    tone: C.gold,
  },
];

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
    ["grid-outline", "Dashboard"],
    ["cloud-upload-outline", "Upload Book"],
    ["library-outline", "My Courses"],
    ["school-outline", "Learning"],
    ["bar-chart-outline", "Progress"],
    ["information-circle-outline", "About"],
  ] as const;

  return (
    <View style={styles.sidebar}>
      <Brand />

      <View style={styles.nav}>
        {items.map(([icon, label]) => {
          const active = label === "Upload Book";

          return (
            <Pressable
              key={label}
              onPress={() => {
                if (label === "Dashboard") {
                  router.push("/dashboard");
                } else if (label === "Upload Book") {
                  router.push("/");
                } else if (label === "My Courses") {
                  router.push("/modules");
                } else if (label === "Progress") {
                  router.push("/progress");
                } else if (label === "Learning") {
                  router.push("/learning");
                } else if (label === "About") {
                  router.push("/about");
                } else {
                  Alert.alert(
                    label,
                    `${label} navigation can be connected here.`,
                  );
                }
              }}
              style={({ pressed }) => [
                styles.navItem,
                active && styles.navItemActive,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name={icon}
                size={20}
                color={active ? "#081318" : "#C2CDD4"}
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

function TopBar({ mobile }: { mobile: boolean }) {
  return (
    <View style={[styles.topBar, mobile && styles.topBarMobile]}>
      <View style={styles.topTitleWrap}>
        <BackButton />
        <View style={styles.uploadArrow}>
          <Ionicons name="arrow-up" size={25} color={C.teal} />
        </View>

        <View>
          <Text style={styles.topTitle}>Upload Book</Text>

          <Text style={styles.topSubtitle}>
            Upload a PDF textbook to convert it into microlearning modules.
          </Text>
        </View>
      </View>

      <View style={styles.topActions}>

        <UserMenu mobile={mobile} />
      </View>
    </View>
  );
}

const formatFileSize = (bytes: number) => {
  if (!bytes) return "Unknown size";
  const mb = bytes / (1024 * 1024);
  if (mb < 1) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${mb.toFixed(1)} MB`;
};

export default function HomeScreen() {
  const { width } = useWindowDimensions();

  const mobile = width < 760;

  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const { setSelectedPdf, addRecentBook } = useCourse();

  const choosePdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      setSelectedFile(file);
      setSelectedPdf({
        name: file.name,
        uri: file.uri,
        size: file.size,
        mimeType: file.mimeType ?? "application/pdf",
      });
      addRecentBook({
        name: file.name,
        uri: file.uri,
        size: file.size,
        mimeType: file.mimeType ?? "application/pdf",
      });
    } catch (error) {
      Alert.alert(
        "Unable to select PDF",
        "Please try selecting the PDF again.",
      );
      console.error("PDF picker error:", error);
    }
  };

  const generateCourse = () => {
    if (!selectedFile) {
      Alert.alert(
        "Select a PDF first",
        "Choose a PDF textbook before generating the course.",
      );
      return;
    }

    router.push({
      pathname: "/progress",
      params: {
        fileUri: selectedFile.uri,
        fileName: selectedFile.name,
        fileSize: String(selectedFile.size ?? 0),
        mimeType: selectedFile.mimeType ?? "application/pdf",
      },
    });
  };

  const hasFile = Boolean(selectedFile);

  return (
    <View style={styles.root}>
      {!mobile && <Sidebar />}

      <View style={styles.content}>
        {mobile && (
          <View style={styles.mobileBrandBar}>
            <Brand />

            <Pressable
              style={styles.mobileMenuButton}
              onPress={() => Alert.alert("Menu", "Navigation menu")}
            >
              <Ionicons name="menu" size={24} color={C.text} />
            </Pressable>
          </View>
        )}

        <TopBar mobile={mobile} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            mobile && styles.scrollContentMobile,
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Text style={[styles.heroTitle, mobile && styles.heroTitleMobile]}>
              Upload Your Textbook
            </Text>

            <Text style={styles.heroSubtitle}>
              Upload a PDF textbook to convert it into microlearning modules.
            </Text>
          </View>

          <Pressable
            onPress={choosePdf}
            style={({ pressed }) => [
              styles.dropZone,
              pressed && styles.dropZonePressed,
              hasFile && styles.dropZoneSelected,
            ]}
          >
            <View style={styles.cloudCircle}>
              <Ionicons name="cloud-upload-outline" size={45} color={C.teal} />
            </View>

            <Text style={styles.dropTitle}>
              {selectedFile ? selectedFile.name : "Drag & drop your PDF here"}
            </Text>

            <Text style={styles.orText}>or</Text>

            <View style={styles.chooseButton}>
              <Ionicons name="document-text-outline" size={19} color={C.bg} />

              <Text style={styles.chooseButtonText}>Choose PDF</Text>
            </View>
          </Pressable>

          {selectedFile && (
            <View style={styles.selectedFileCard}>
              <View style={styles.selectedFileIcon}>
                <Ionicons name="document-text" size={20} color={C.teal} />
              </View>

              <View style={styles.selectedFileDetails}>
                <Text style={styles.selectedFileName} numberOfLines={1}>
                  {selectedFile.name}
                </Text>

                <Text style={styles.selectedFileMeta}>
                  PDF • {formatFileSize(selectedFile.size ?? 0)}
                </Text>
              </View>

              <Pressable
                onPress={() => setSelectedFile(null)}
                style={styles.removeFileButton}
              >
                <Ionicons name="close" size={18} color={C.muted} />
              </Pressable>
            </View>
          )}

          <View style={styles.fileInfoRow}>
            <View style={styles.fileInfoItem}>
              <Ionicons name="document-outline" size={15} color={C.teal} />

              <Text style={styles.fileInfoText}>Supports PDF files only</Text>
            </View>

            <View style={styles.infoDot} />

            <View style={styles.fileInfoItem}>
              <Ionicons name="cloud-outline" size={15} color={C.teal} />

              <Text style={styles.fileInfoText}>Max file size: 200MB</Text>
            </View>
          </View>

          <View style={styles.whyCard}>
            <Text style={styles.sectionTitle}>Why LocalMind?</Text>

            <View
              style={[styles.benefitGrid, mobile && styles.benefitGridMobile]}
            >
              {benefits.map((item) => (
                <View
                  key={item.title}
                  style={[
                    styles.benefitCard,
                    {
                      borderColor: `${item.tone}55`,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.benefitIcon,
                      {
                        backgroundColor: `${item.tone}22`,
                      },
                    ]}
                  >
                    <Ionicons name={item.icon} size={25} color={item.tone} />
                  </View>

                  <Text style={[styles.benefitTitle, { color: item.tone }]}>
                    {item.title}
                  </Text>

                  <Text style={styles.benefitText}>{item.text}</Text>
                </View>
              ))}
            </View>

            <Pressable
              disabled={!hasFile}
              onPress={generateCourse}
              style={({ pressed }) => [
                styles.generateButton,
                !hasFile && styles.generateButtonDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.generateText}>Generate Course</Text>

              <Ionicons
                name="arrow-forward"
                size={17}
                color={hasFile ? C.bg : "#7C898E"}
              />
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
    flexDirection: "row",
  },

  sidebar: {
    width: 264,
    backgroundColor: C.sidebar,
    borderRightWidth: 1,
    borderRightColor: "#20303B",
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 22,
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  brandIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: C.teal,
    alignItems: "center",
    justifyContent: "center",
  },

  brandName: {
    color: C.text,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  brandSub: {
    color: "#A5B1B7",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.1,
    marginTop: 1,
  },

  nav: {
    marginTop: 43,
    gap: 8,
  },

  navItem: {
    height: 48,
    borderRadius: 7,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  navItemActive: {
    backgroundColor: "#16C39B",
  },

  navText: {
    color: "#C4CDD2",
    fontSize: 14,
    fontWeight: "600",
  },

  navTextActive: {
    color: "#061417",
    fontWeight: "800",
  },

  

  

  statusCard: {
    marginTop: "auto",
    borderWidth: 1,
    borderColor: "#26394D",
    backgroundColor: "#122033",
    borderRadius: 13,
    padding: 18,
  },

  statusTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 17,
  },

  statusIcon: {
    width: 27,
    height: 27,
    borderRadius: 8,
    backgroundColor: "#073F3A",
    alignItems: "center",
    justifyContent: "center",
  },

  statusTitle: {
    color: "#B7C2C9",
    fontSize: 13,
    fontWeight: "600",
  },

  statusMain: {
    color: C.text,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 5,
  },

  statusText: {
    color: "#A4AFB7",
    fontSize: 12,
    lineHeight: 18,
  },

  localModePill: {
    alignSelf: "flex-start",
    backgroundColor: "#0B4A42",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },

  localModeText: {
    color: C.teal,
    fontSize: 11,
    fontWeight: "800",
  },

  checkedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 21,
  },

  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#20C69E",
  },

  checkedText: {
    color: "#B1BBC0",
    fontSize: 10,
  },

  content: {
    flex: 1,
    minWidth: 0,
  },

  topBar: {
    minHeight: 82,
    borderBottomWidth: 1,
    borderBottomColor: "#1D2A34",
    paddingHorizontal: 31,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  topBarMobile: {
    paddingHorizontal: 16,
    minHeight: 68,
  },

  topTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    flex: 1,
  },

  uploadArrow: {
    width: 29,
    alignItems: "center",
  },

  topTitle: {
    color: C.text,
    fontSize: 18,
    fontWeight: "800",
  },

  topSubtitle: {
    color: "#A7B3B9",
    fontSize: 12,
    marginTop: 3,
  },

  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  badge: {
    position: "absolute",
    top: -1,
    right: -1,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#2AC7A3",
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: C.bg,
    fontSize: 8,
    fontWeight: "900",
  },

  userButton: {
    height: 42,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#293643",
    backgroundColor: "#111B25",
    paddingHorizontal: 8,
    paddingRight: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#D7F1E8",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#157A66",
    fontWeight: "900",
    fontSize: 12,
  },

  userText: {
    color: C.text,
    fontWeight: "700",
    fontSize: 13,
  },

  mobileBrandBar: {
    height: 65,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#1D2A34",
  },

  mobileMenuButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: C.panel2,
    alignItems: "center",
    justifyContent: "center",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 30,
    paddingTop: 34,
    paddingBottom: 42,
  },

  scrollContentMobile: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  hero: {
    alignItems: "center",
    marginBottom: 30,
  },

  heroTitle: {
    color: C.text,
    fontSize: 31,
    fontWeight: "900",
    letterSpacing: -0.8,
    textAlign: "center",
  },

  heroTitleMobile: {
    fontSize: 26,
  },

  heroSubtitle: {
    color: "#A9B4BB",
    fontSize: 13,
    marginTop: 7,
    textAlign: "center",
  },

  dropZone: {
    minHeight: 277,
    borderRadius: 11,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#20BFA3",
    backgroundColor: "#0F1926",
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },

  dropZonePressed: {
    opacity: 0.82,
  },

  dropZoneSelected: {
    backgroundColor: "#10231F",
    borderColor: C.teal,
  },

  cloudCircle: {
    width: 68,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
  },

  dropTitle: {
    color: C.text,
    fontSize: 17,
    fontWeight: "700",
  },

  orText: {
    color: "#89969D",
    fontSize: 13,
    marginVertical: 8,
  },

  chooseButton: {
    minWidth: 183,
    height: 48,
    borderRadius: 7,
    backgroundColor: "#35CBA8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    paddingHorizontal: 18,
  },

  chooseButtonText: {
    color: "#061418",
    fontSize: 15,
    fontWeight: "900",
  },

  fileInfoRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 13,
    marginTop: 27,
    marginBottom: 37,
    flexWrap: "wrap",
  },

  fileInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  fileInfoText: {
    color: "#96A2A9",
    fontSize: 11,
  },

  infoDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#68747B",
  },

  whyCard: {
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: "#111B28",
    borderRadius: 13,
    padding: 20,
  },

  sectionTitle: {
    color: C.text,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 18,
  },

  benefitGrid: {
    flexDirection: "row",
    gap: 16,
  },

  benefitGridMobile: {
    flexDirection: "column",
    gap: 12,
  },

  benefitCard: {
    flex: 1,
    minHeight: 176,
    borderRadius: 9,
    borderWidth: 1,
    backgroundColor: "#101B28",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },

  benefitIcon: {
    width: 57,
    height: 57,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },

  benefitTitle: {
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },

  benefitText: {
    color: "#B2BDC3",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    maxWidth: 220,
  },

  selectedFileCard: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#2C665C",
    backgroundColor: "#10231F",
    borderRadius: 10,
    minHeight: 68,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  selectedFileIcon: {
    width: 40,
    height: 40,
    borderRadius: 9,
    backgroundColor: "#0D4A40",
    alignItems: "center",
    justifyContent: "center",
  },

  selectedFileDetails: {
    flex: 1,
    minWidth: 0,
  },

  selectedFileName: {
    color: C.text,
    fontSize: 13,
    fontWeight: "800",
  },

  selectedFileMeta: {
    color: C.muted,
    fontSize: 11,
    marginTop: 4,
  },

  removeFileButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  generateButton: {
    alignSelf: "center",
    minWidth: 270,
    height: 53,
    borderRadius: 7,
    backgroundColor: "#35CBA8",
    marginTop: 27,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  generateButtonDisabled: {
    backgroundColor: "#245D58",
    opacity: 0.65,
  },

  generateText: {
    color: C.bg,
    fontSize: 14,
    fontWeight: "900",
  },

  pressed: {
    opacity: 0.75,
  },
});
