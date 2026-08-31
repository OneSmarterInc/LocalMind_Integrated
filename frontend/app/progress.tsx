import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useCourse } from "../src/context/CourseContext";
import { API_URL } from "../src/services/api";

import {
  Alert,
  Platform,
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
  border: "#223143",
  teal: "#38D9B0",
  text: "#F4F7F8",
  muted: "#A7B2BA",
  blue: "#4DA3FF",
  purple: "#A86BFF",
  gold: "#E7B52E",
};

const stages = [
  { title: "Extracting", subtitle: "PDF" },
  { title: "Detecting", subtitle: "Chapters" },
  { title: "Analyzing", subtitle: "Content" },
  { title: "Generating", subtitle: "Modules" },
  { title: "Saving", subtitle: "Course" },
];

function formatFileSize(bytes: number) {
  if (!bytes) return "Unknown size";
  const mb = bytes / (1024 * 1024);
  return mb < 1
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${mb.toFixed(1)} MB`;
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
    ["information-circle-outline", "About", undefined],
  ] as const;

  return (
    <View style={styles.sidebar}>
      <Brand />
      <View style={styles.nav}>
        {items.map(([icon, label, route]) => {
          const active = label === "Progress";
          return (
            <Pressable
              key={label}
              onPress={() => {
                if (label === "Progress") return;
                if (route) router.push(route as never);
                else {
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
        <Ionicons name="document-text-outline" size={25} color={C.teal} />
        <View>
          <Text style={styles.topTitle}>Course Generation Progress</Text>
          <Text style={styles.topSubtitle}>
            Track the progress while your course is being generated.
          </Text>
        </View>
      </View>
      <View style={styles.topActions}>
        <UserMenu mobile={mobile} />
      </View>
    </View>
  );
}

export default function ProgressScreen() {
  const { width } = useWindowDimensions();
  const mobile = width < 760;
  const params = useLocalSearchParams<{
    fileUri?: string;
    fileName?: string;
    fileSize?: string;
    mimeType?: string;
  }>();

  const { switchCourse, fetchUploadedBooks } = useCourse();
  const [stage, setStage] = useState(0);
  const [percent, setPercent] = useState(0);
  const [errorText, setErrorText] = useState<string | null>(null);

  const fileName = useMemo(
    () => params.fileName || "Selected PDF textbook",
    [params.fileName],
  );

  const fileSize = Number(params.fileSize || 0);

  useEffect(() => {
    let active = true;
    let pollInterval: ReturnType<typeof setInterval>;

    const startProcessing = async () => {
      if (!params.fileUri) return;
      try {
        setPercent(5);
        setStage(0);

        const formData = new FormData();
        if (params.fileUri.startsWith("blob:") || Platform.OS === "web") {
          const fileResponse = await fetch(params.fileUri);
          const blob = await fileResponse.blob();
          formData.append("file", blob, params.fileName || "book.pdf");
        } else {
          formData.append("file", {
            uri: params.fileUri,
            name: params.fileName || "book.pdf",
            type: params.mimeType || "application/pdf"
          } as any);
        }

        const uploadRes = await fetch(`${API_URL}/documents/upload/`, {
          method: "POST",
          body: formData,
          headers: { "Accept": "application/json" }
        });

        if (!uploadRes.ok) {
          throw new Error("File upload failed. Ensure the format is PDF or Word.");
        }

        const docData = await uploadRes.json();
        const documentId = docData.id;

        setPercent(20);
        setStage(1);

        const processRes = await fetch(`${API_URL}/documents/${documentId}/process/`, {
          method: "POST"
        });

        if (!processRes.ok) {
          throw new Error("Failed to start processing textbook.");
        }

        setPercent(40);
        setStage(2);

        pollInterval = setInterval(async () => {
          if (!active) return;
          try {
            const statusRes = await fetch(`${API_URL}/documents/${documentId}/`);
            if (!statusRes.ok) return;
            const doc = await statusRes.json();

            const statusUpper = (doc.status || "").toUpperCase();
            if (statusUpper === "AWAITING_REVIEW") {
              clearInterval(pollInterval);
              setPercent(80);
              setStage(3);

              const confirmRes = await fetch(`${API_URL}/documents/${documentId}/outline/confirm/`, {
                method: "POST"
              });
              if (!confirmRes.ok) {
                throw new Error("Outline confirmation failed.");
              }

              setPercent(100);
              setStage(4);

              await switchCourse(documentId);
              await fetchUploadedBooks();

              setTimeout(() => {
                router.replace("/modules");
              }, 1200);
            } else if (statusUpper === "ERROR") {
              clearInterval(pollInterval);
              setErrorText(doc.error_message || "Outline extraction failed.");
            } else {
              setPercent((prev) => {
                if (prev >= 78) return 78;
                return prev + 2;
              });
            }
          } catch (err) {
            console.error("Polling error:", err);
          }
        }, 3000);

      } catch (err: any) {
        console.error("Textbook processing failed:", err);
        setErrorText(err.message || "An unexpected error occurred during textbook analysis.");
      }
    };

    startProcessing();

    return () => {
      active = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [params.fileUri]);


  const statuses = [
    {
      icon: "checkmark",
      title: "PDF Processing",
      description: `Reading ${fileName}`,
      status: percent >= 20 ? "Completed" : "In Progress",
      tone: C.teal,
      bg: "#063F3D",
    },
    {
      icon: "checkmark",
      title: "Chapter Detection",
      description: "Identifying chapters and sections",
      status:
        percent >= 40 ? "Completed" : percent >= 20 ? "In Progress" : "Pending",
      tone: C.blue,
      bg: "#0A2E4C",
    },
    {
      icon: "analytics-outline",
      title: "Content Analysis",
      description: "Understanding concepts in depth",
      status:
        percent >= 60 ? "Completed" : percent >= 40 ? "In Progress" : "Pending",
      tone: C.purple,
      bg: "#21194B",
    },
    {
      icon: "sparkles-outline",
      title: "Module Generation",
      description: "Creating lessons from key insights",
      status:
        percent >= 80 ? "Completed" : percent >= 60 ? "In Progress" : "Pending",
      tone: C.gold,
      bg: "#292718",
    },
  ];

  return (
    <View style={styles.root}>
      {!mobile && <Sidebar />}
      <View style={styles.content}>
        {mobile && (
          <View style={styles.mobileBrandBar}>
            <Brand />
            <Pressable style={styles.mobileMenuButton}>
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
          {errorText && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={24} color="#FF6B6B" />
              <View style={{ flex: 1 }}>
                <Text style={styles.errorTitle}>Processing Error</Text>
                <Text style={styles.errorBody}>{errorText}</Text>
              </View>
            </View>
          )}

          <View style={styles.hero}>
            <Text style={[styles.heroTitle, mobile && styles.heroTitleMobile]}>
              Generating Your Course
            </Text>
            <Text style={styles.heroSubtitle}>
              Please wait while we analyze your book and create microlearning
              modules.
            </Text>
          </View>

          <View style={styles.steps}>
            {stages.map((item, index) => {
              const completed = percent >= (index + 1) * 20;
              const current = !completed && stage === index;

              return (
                <View key={item.title} style={styles.stepWrap}>
                  <View style={styles.stepTop}>
                    <View
                      style={[
                        styles.stepCircle,
                        (completed || current) && styles.stepCircleActive,
                      ]}
                    >
                      {completed ? (
                        <Ionicons name="checkmark" size={18} color={C.bg} />
                      ) : (
                        <Text
                          style={[
                            styles.stepNumber,
                            current && styles.stepNumberActive,
                          ]}
                        >
                          {index + 1}
                        </Text>
                      )}
                    </View>
                    {index < stages.length - 1 && (
                      <View
                        style={[
                          styles.stepLine,
                          percent >= (index + 1) * 20 && styles.stepLineActive,
                        ]}
                      />
                    )}
                  </View>
                  <Text style={styles.stepTitle}>{item.title}</Text>
                  <Text style={styles.stepSubtitle}>{item.subtitle}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              Processing your uploaded textbook...
            </Text>
            <Text style={styles.progressPercent}>{percent}%</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${percent}%` }]} />
          </View>

          <View style={styles.fileBanner}>
            <View style={styles.fileBannerIcon}>
              <Ionicons name="document-text" size={19} color={C.teal} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fileBannerName} numberOfLines={1}>
                {fileName}
              </Text>
              <Text style={styles.fileBannerMeta}>
                PDF • {formatFileSize(fileSize)}
              </Text>
            </View>
            <View style={styles.livePill}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          <View style={styles.processingCard}>
            <View style={styles.processingHeader}>
              <View>
                <Text style={styles.processingTitle}>Course Processing</Text>
                <Text style={styles.processingSubtitle}>
                  LocalMind is processing your textbook and preparing the
                  learning experience.
                </Text>
              </View>
            </View>

            <View style={[styles.cardGrid, mobile && styles.cardGridMobile]}>
              {statuses.map((item, index) => (
                <View
                  key={item.title}
                  style={[
                    styles.processCard,
                    { borderColor: `${item.tone}55` },
                    { backgroundColor: item.bg },
                  ]}
                >
                  <View
                    style={[
                      styles.processIcon,
                      { backgroundColor: `${item.tone}22` },
                    ]}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={22}
                      color={item.tone}
                    />
                  </View>
                  <Text style={styles.processTitle}>{item.title}</Text>
                  <Text style={styles.processDescription}>
                    {item.description}
                  </Text>
                  <View style={styles.statusRow}>
                    <View
                      style={[styles.statusDot, { backgroundColor: item.tone }]}
                    />
                    <Text style={[styles.processStatus, { color: item.tone }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="information" size={23} color={C.teal} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>
                {"You can close this window, we'll notify you when it's done."}
              </Text>
              <Text style={styles.infoText}>
                Your progress details will remain saved locally.
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.replace("/")}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={16} color={C.muted} />
            <Text style={styles.backButtonText}>Back to Upload Book</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, flexDirection: "row" },
  sidebar: {
    width: 264,
    backgroundColor: C.sidebar,
    borderRightWidth: 1,
    borderRightColor: "#20303B",
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 22,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 11 },
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
  nav: { marginTop: 43, gap: 8 },
  navItem: {
    height: 48,
    borderRadius: 7,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  navItemActive: { backgroundColor: "#16C39B" },
  navText: { color: "#C4CDD2", fontSize: 14, fontWeight: "600" },
  navTextActive: { color: "#061417", fontWeight: "800" },
  
  
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
  statusTitle: { color: "#B7C2C9", fontSize: 13, fontWeight: "600" },
  statusMain: {
    color: C.text,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 5,
  },
  statusText: { color: "#A4AFB7", fontSize: 12, lineHeight: 18 },
  localModePill: {
    alignSelf: "flex-start",
    backgroundColor: "#0B4A42",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  localModeText: { color: C.teal, fontSize: 11, fontWeight: "800" },
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
  checkedText: { color: "#B1BBC0", fontSize: 10 },
  content: { flex: 1, minWidth: 0 },
  topBar: {
    minHeight: 82,
    borderBottomWidth: 1,
    borderBottomColor: "#1D2A34",
    paddingHorizontal: 31,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topBarMobile: { paddingHorizontal: 16, minHeight: 68 },
  topTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    flex: 1,
  },
  topTitle: { color: C.text, fontSize: 18, fontWeight: "800" },
  topSubtitle: { color: "#A7B3B9", fontSize: 12, marginTop: 3 },
  topActions: { flexDirection: "row", alignItems: "center", gap: 12 },
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
  badgeText: { color: C.bg, fontSize: 8, fontWeight: "900" },
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
  avatarText: { color: "#157A66", fontWeight: "900", fontSize: 12 },
  userText: { color: C.text, fontWeight: "700", fontSize: 13 },
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
    backgroundColor: "#172334",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 30, paddingTop: 34, paddingBottom: 42 },
  scrollContentMobile: { paddingHorizontal: 16, paddingTop: 24 },
  hero: { alignItems: "center", marginBottom: 30 },
  heroTitle: {
    color: C.text,
    fontSize: 31,
    fontWeight: "900",
    letterSpacing: -0.8,
    textAlign: "center",
  },
  heroTitleMobile: { fontSize: 26 },
  heroSubtitle: {
    color: "#A9B4BB",
    fontSize: 13,
    marginTop: 7,
    textAlign: "center",
  },
  steps: { flexDirection: "row", width: "100%", marginBottom: 33 },
  stepWrap: { flex: 1, minWidth: 0 },
  stepTop: { flexDirection: "row", alignItems: "center", width: "100%" },
  stepCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#36434A",
    backgroundColor: "#11191F",
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircleActive: { backgroundColor: C.teal, borderColor: C.teal },
  stepNumber: { color: "#B9C2C7", fontSize: 14, fontWeight: "800" },
  stepNumberActive: { color: C.bg },
  stepLine: {
    height: 3,
    flex: 1,
    backgroundColor: "#303A40",
    marginHorizontal: 8,
  },
  stepLineActive: { backgroundColor: C.teal },
  stepTitle: { color: C.text, fontSize: 12, fontWeight: "800", marginTop: 9 },
  stepSubtitle: { color: C.muted, fontSize: 11, marginTop: 2 },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: { color: C.text, fontSize: 13, fontWeight: "800" },
  progressPercent: { color: C.teal, fontSize: 13, fontWeight: "900" },
  progressTrack: {
    height: 8,
    borderRadius: 5,
    backgroundColor: "#293238",
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 24,
  },
  progressFill: { height: "100%", borderRadius: 5, backgroundColor: C.teal },
  fileBanner: {
    borderWidth: 1,
    borderColor: "#29404A",
    backgroundColor: "#101B24",
    borderRadius: 10,
    minHeight: 65,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 17,
  },
  fileBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 9,
    backgroundColor: "#0D4A40",
    alignItems: "center",
    justifyContent: "center",
  },
  fileBannerName: { color: C.text, fontSize: 13, fontWeight: "800" },
  fileBannerMeta: { color: C.muted, fontSize: 11, marginTop: 3 },
  livePill: {
    borderRadius: 16,
    backgroundColor: "#0A3B32",
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.teal },
  liveText: { color: C.teal, fontSize: 9, fontWeight: "900" },
  processingCard: {
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: "#0F171D",
    borderRadius: 13,
    padding: 20,
  },
  processingHeader: { marginBottom: 18 },
  processingTitle: { color: C.text, fontSize: 17, fontWeight: "800" },
  processingSubtitle: { color: C.muted, fontSize: 11, marginTop: 4 },
  cardGrid: { flexDirection: "row", gap: 14 },
  cardGridMobile: { flexDirection: "column" },
  processCard: {
    flex: 1,
    minHeight: 178,
    borderWidth: 1,
    borderRadius: 10,
    padding: 18,
  },
  processIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  processTitle: { color: C.text, fontSize: 14, fontWeight: "900" },
  processDescription: {
    color: "#B2BDC3",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 7,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 22,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  processStatus: { fontSize: 11, fontWeight: "800" },
  infoCard: {
    borderWidth: 1,
    borderColor: "#155C54",
    backgroundColor: "#0C2927",
    borderRadius: 12,
    minHeight: 88,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 16,
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0B4A42",
    alignItems: "center",
    justifyContent: "center",
  },
  infoTitle: { color: C.teal, fontSize: 13, fontWeight: "800" },
  infoText: { color: "#AAB8BA", fontSize: 11, marginTop: 4 },
  backButton: {
    alignSelf: "center",
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: { color: C.muted, fontSize: 12, fontWeight: "700" },
  pressed: { opacity: 0.75 },
  errorBanner: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: "#2C171E",
    borderWidth: 1,
    borderColor: "#E63946",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    alignItems: "center"
  },
  errorTitle: {
    color: "#FF6B6B",
    fontSize: 14,
    fontWeight: "800"
  },
  errorBody: {
    color: "#E2E8F0",
    fontSize: 11,
    marginTop: 4,
    lineHeight: 16
  }
});
