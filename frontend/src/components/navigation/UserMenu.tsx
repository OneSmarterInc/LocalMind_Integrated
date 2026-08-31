import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const C = {
  bg: "#0B1114",
  surface: "#0F1B26",
  surfaceElevated: "#172633",
  border: "#2B4251",
  text: "#F4F7F8",
  muted: "#7F909B",
  teal: "#38D9B0",
  tealDark: "#0D302B",
  red: "#FF6B6B",
};

type UserMenuProps = {
  mobile?: boolean;
};

export default function UserMenu({ mobile = false }: UserMenuProps) {
  const [visible, setVisible] = useState(false);

  const close = () => setVisible(false);

  const openProfile = () => {
    close();
    router.push("/profile");
  };

  const openSettings = () => {
    close();
    router.push("/settings");
  };

  const logout = () => {
    close();

    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            // There is no authentication backend in the current project.
            // Return to the main screen until auth is connected.
            router.replace("/");
          },
        },
      ],
    );
  };

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        style={({ pressed }) => [
          styles.userButton,
          mobile && styles.mobileUserButton,
          pressed && styles.userButtonPressed,
        ]}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>U</Text>
          <View style={styles.onlineDot} />
        </View>

        {!mobile && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>User</Text>
            <Text style={styles.userRole}>Learner</Text>
          </View>
        )}

        <Ionicons
          name={visible ? "chevron-up" : "chevron-down"}
          size={15}
          color={C.muted}
        />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={close}
      >
        <TouchableWithoutFeedback onPress={close}>
          <View
            style={[
              styles.overlay,
              mobile && styles.overlayMobile,
            ]}
          >
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.dropdown,
                  mobile && styles.dropdownMobile,
                ]}
              >
                <View style={styles.header}>
                  <View style={styles.dropdownAvatar}>
                    <Text style={styles.dropdownAvatarText}>U</Text>
                    <View style={styles.dropdownOnlineDot} />
                  </View>

                  <View style={styles.headerInfo}>
                    <Text style={styles.headerName}>User</Text>
                    <View style={styles.rolePill}>
                      <View style={styles.roleDot} />
                      <Text style={styles.roleText}>Learner</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.divider} />

                <Pressable
                  onPress={openProfile}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && styles.menuItemPressed,
                  ]}
                >
                  <View style={styles.menuIcon}>
                    <Ionicons
                      name="person-outline"
                      size={18}
                      color={C.teal}
                    />
                  </View>

                  <View style={styles.menuText}>
                    <Text style={styles.menuTitle}>Profile</Text>
                    <Text style={styles.menuDescription}>
                      View your profile
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={C.muted}
                  />
                </Pressable>

                <Pressable
                  onPress={openSettings}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && styles.menuItemPressed,
                  ]}
                >
                  <View style={styles.menuIcon}>
                    <Ionicons
                      name="settings-outline"
                      size={18}
                      color={C.teal}
                    />
                  </View>

                  <View style={styles.menuText}>
                    <Text style={styles.menuTitle}>Settings</Text>
                    <Text style={styles.menuDescription}>
                      Manage your preferences
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={C.muted}
                  />
                </Pressable>

                <View style={styles.divider} />

                <Pressable
                  onPress={logout}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && styles.menuItemPressed,
                  ]}
                >
                  <View style={styles.logoutIcon}>
                    <Ionicons
                      name="log-out-outline"
                      size={19}
                      color={C.red}
                    />
                  </View>

                  <View style={styles.menuText}>
                    <Text style={styles.logoutTitle}>Logout</Text>
                    <Text style={styles.menuDescription}>
                      Sign out of LocalMind
                    </Text>
                  </View>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  userButton: {
    minWidth: 142,
    height: 44,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: "#111B25",
    paddingLeft: 7,
    paddingRight: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  mobileUserButton: {
    minWidth: 44,
    width: 44,
    paddingHorizontal: 5,
    justifyContent: "center",
  },

  userButtonPressed: {
    backgroundColor: C.surfaceElevated,
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#DDF4EE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.teal,
    position: "relative",
  },

  avatarText: {
    color: "#147760",
    fontSize: 13,
    fontWeight: "900",
  },

  onlineDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.teal,
    borderWidth: 2,
    borderColor: "#111B25",
    right: -1,
    bottom: -1,
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    color: C.text,
    fontSize: 12,
    fontWeight: "800",
  },

  userRole: {
    color: C.muted,
    fontSize: 9,
    marginTop: 1,
  },

  overlay: {
    flex: 1,
    alignItems: "flex-end",
    paddingTop: 86,
    paddingRight: 30,
    backgroundColor: "transparent",
  },

  overlayMobile: {
    paddingTop: 66,
    paddingHorizontal: 8,
  },

  dropdown: {
    width: 280,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    paddingVertical: 9,
    shadowColor: "#000",
    shadowOpacity: 0.55,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 20,
  },

  dropdownMobile: {
    width: "100%",
    maxWidth: 340,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 13,
  },

  dropdownAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#D8F3E9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: C.teal,
    position: "relative",
  },

  dropdownAvatarText: {
    color: "#147760",
    fontSize: 16,
    fontWeight: "900",
  },

  dropdownOnlineDot: {
    position: "absolute",
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: C.teal,
    borderWidth: 2,
    borderColor: C.surface,
    right: -1,
    bottom: 0,
  },

  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },

  headerName: {
    color: C.text,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 5,
  },

  rolePill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#12352E",
    borderWidth: 1,
    borderColor: "#205D50",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },

  roleDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: C.teal,
    marginRight: 5,
  },

  roleText: {
    color: "#63DDBD",
    fontSize: 10,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: "#294052",
    marginHorizontal: 12,
    marginVertical: 8,
  },

  menuItem: {
    minHeight: 58,
    marginHorizontal: 7,
    paddingHorizontal: 9,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  menuItemPressed: {
    backgroundColor: C.surfaceElevated,
  },

  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 9,
    backgroundColor: C.tealDark,
    alignItems: "center",
    justifyContent: "center",
  },

  logoutIcon: {
    width: 38,
    height: 38,
    borderRadius: 9,
    backgroundColor: "#321C22",
    alignItems: "center",
    justifyContent: "center",
  },

  menuText: {
    flex: 1,
  },

  menuTitle: {
    color: C.text,
    fontSize: 13,
    fontWeight: "800",
  },

  logoutTitle: {
    color: C.red,
    fontSize: 13,
    fontWeight: "800",
  },

  menuDescription: {
    color: C.muted,
    fontSize: 10,
    marginTop: 3,
  },
});
