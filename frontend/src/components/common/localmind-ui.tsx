import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const C = {
  navy: '#06213A',
  navy2: '#0A2D4A',
  teal: '#07856F',
  tealDark: '#056957',
  page: '#F5F8FA',
  white: '#FFFFFF',
  text: '#183244',
  muted: '#70818C',
  border: '#DCE5EA',
  green: '#18A874',
  lightGreen: '#E9F8F2',
  orange: '#F29A38',
  lightOrange: '#FFF5E9',
  blue: '#3984D4',
  lightBlue: '#EDF5FD',
  purple: '#7A63D6',
  lightPurple: '#F2EFFE',
  red: '#E75A5A',
  lightRed: '#FDEEEE',
};

export function Brand() {
  return (
    <View style={styles.brand}>
      <View style={styles.brandIcon}>
        <Ionicons name="book" size={15} color={C.white} />
      </View>
      <Text style={styles.brandText}>LocalMind</Text>
    </View>
  );
}

const navItems = [
  { label: 'Upload Book', icon: 'cloud-upload-outline' as const },
  { label: 'My Courses', icon: 'library-outline' as const },
  { label: 'Learning', icon: 'school-outline' as const },
  { label: 'Progress', icon: 'stats-chart-outline' as const },
  { label: 'Settings', icon: 'settings-outline' as const },
  { label: 'About', icon: 'information-circle-outline' as const },
];

export function Sidebar({ active = 0, onNavigate }: { active?: number; onNavigate?: (index: number) => void }) {
  return (
    <View style={styles.sidebar}>
      <Brand />
      <View style={styles.nav}>
        {navItems.map((item, i) => (
          <Pressable
            key={item.label}
            onPress={() => onNavigate?.(i)}
            style={[styles.navItem, active === i && styles.navItemActive]}
          >
            <Ionicons name={item.icon} size={16} color={active === i ? C.white : '#D6E0E7'} />
            <Text style={[styles.navText, active === i && styles.navTextActive]}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.aiBox}>
        <Text style={styles.aiTitle}>AI Model</Text>
        <Text style={styles.aiModel}>Gemma 3 4B</Text>
        <View style={styles.aiRow}>
          <View style={styles.dot} />
          <Text style={styles.aiSmall}>Local (Ollama)</Text>
        </View>
        <View style={styles.aiRow}>
          <Ionicons name="lock-closed-outline" size={11} color="#D7E2E8" />
          <Text style={styles.aiSmall}>Fast &amp; Private</Text>
        </View>
        <View style={styles.statusLine}>
          <Text style={styles.aiSmall}>Status:</Text>
          <Text style={styles.running}> Running</Text>
        </View>
      </View>
    </View>
  );
}

export function PageShell({
  active,
  children,
  onNavigate,
}: {
  active?: number;
  children: React.ReactNode;
  onNavigate?: (index: number) => void;
}) {
  const { width } = useWindowDimensions();
  const compact = width < 700;

  if (compact) {
    return (
      <View style={styles.mobileRoot}>
        <View style={styles.mobileHeader}>
          <Brand />
          <View style={styles.mobileStatus}>
            <View style={styles.dot} />
            <Text style={styles.mobileStatusText}>Local AI</Text>
          </View>
        </View>
        <View style={styles.mobileNav}>
          {navItems.slice(0, 4).map((item, i) => (
            <Pressable
              key={item.label}
              onPress={() => onNavigate?.(i)}
              style={[styles.mobileNavItem, active === i && styles.mobileNavItemActive]}
            >
              <Ionicons name={item.icon} size={15} color={active === i ? C.white : C.navy} />
              <Text style={[styles.mobileNavText, active === i && styles.mobileNavTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.mobileContent}>{children}</View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Sidebar active={active} onNavigate={onNavigate} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

export function SectionTitle({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <View style={styles.sectionTitle}>
      <View style={styles.stepCircle}>
        <Text style={styles.stepNumber}>{step}</Text>
      </View>
      <View>
        <Text style={styles.pageTitle}>{title}</Text>
        <Text style={styles.pageSubtitle}>{description}</Text>
      </View>
    </View>
  );
}

export function ProgressSteps({ current }: { current: number }) {
  const steps = ['Uploading PDF', 'Detecting Chapters', 'Analyzing Content', 'Generating Modules', 'Saving Course'];
  return (
    <View style={styles.progressSteps}>
      {steps.map((label, i) => (
        <React.Fragment key={label}>
          <View style={styles.progressStep}>
            <View style={[
              styles.progressCircle,
              i < current ? styles.progressDone : null,
              i === current ? styles.progressCurrent : null,
            ]}>
              {i < current ? <Ionicons name="checkmark" size={14} color={C.white} /> : <Text style={styles.progressNumber}>{i + 1}</Text>}
            </View>
            <Text style={[styles.progressLabel, i === current && styles.progressLabelCurrent]}>{label}</Text>
          </View>
          {i < steps.length - 1 && <View style={[styles.progressLine, i < current && styles.progressLineDone]} />}
        </React.Fragment>
      ))}
    </View>
  );
}

export const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: C.page, minHeight: '100%' as any },
  sidebar: { width: 152, backgroundColor: C.navy, paddingHorizontal: 10, paddingTop: 14, paddingBottom: 12, justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4, marginBottom: 22 },
  brandIcon: { width: 25, height: 25, borderRadius: 6, backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center', marginRight: 7 },
  brandText: { color: C.white, fontWeight: '700', fontSize: 11 },
  nav: { flex: 1 },
  navItem: { height: 31, borderRadius: 5, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, marginBottom: 3 },
  navItemActive: { backgroundColor: C.teal },
  navText: { color: '#D6E0E7', fontSize: 9.5, marginLeft: 8 },
  navTextActive: { color: C.white, fontWeight: '600' },
  aiBox: { borderTopWidth: 1, borderTopColor: '#21405A', paddingTop: 12, paddingHorizontal: 5 },
  aiTitle: { color: '#B9C8D2', fontSize: 8.5, marginBottom: 2 },
  aiModel: { color: C.white, fontWeight: '700', fontSize: 10, marginBottom: 6 },
  aiRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#28C98A', marginRight: 5 },
  aiSmall: { color: '#D7E2E8', fontSize: 7.5 },
  statusLine: { flexDirection: 'row', marginTop: 3 },
  running: { color: '#2BCB8A', fontSize: 7.5 },
  content: { flex: 1, padding: 22, minWidth: 0 },
  mobileRoot: { flex: 1, backgroundColor: C.page },
  mobileHeader: { height: 60, backgroundColor: C.navy, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  mobileStatus: { flexDirection: 'row', alignItems: 'center' },
  mobileStatusText: { color: '#D7E2E8', fontSize: 10, marginLeft: 5 },
  mobileNav: { backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 7 },
  mobileNavItem: { flex: 1, minHeight: 38, borderRadius: 6, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  mobileNavItemActive: { backgroundColor: C.teal },
  mobileNavText: { color: C.navy, fontSize: 8, marginTop: 3, textAlign: 'center' },
  mobileNavTextActive: { color: C.white, fontWeight: '700' },
  mobileContent: { flex: 1, padding: 14 },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  stepCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.tealDark, alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  stepNumber: { color: C.white, fontWeight: '800', fontSize: 11 },
  pageTitle: { color: C.text, fontWeight: '800', fontSize: 15 },
  pageSubtitle: { color: C.muted, fontSize: 9, marginTop: 2 },
  card: { backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 7, padding: 20 },
  progressSteps: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 18 },
  progressStep: { alignItems: 'center', width: 75 },
  progressCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: C.border, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  progressDone: { backgroundColor: C.green, borderColor: C.green },
  progressCurrent: { backgroundColor: C.teal, borderColor: C.teal },
  progressNumber: { color: C.muted, fontSize: 8, fontWeight: '700' },
  progressLabel: { color: C.muted, fontSize: 7.5, textAlign: 'center', marginTop: 5 },
  progressLabelCurrent: { color: C.text, fontWeight: '700' },
  progressLine: { height: 2, backgroundColor: C.border, flex: 1, marginTop: 10 },
  progressLineDone: { backgroundColor: C.green },
});
