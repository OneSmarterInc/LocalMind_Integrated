import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';

import { colors } from '../theme/colors';
import { theme } from '../theme/theme';

type TopBarProps = {
  title: string;
  onProfile?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
};

export default function TopBar({
  title,
  onProfile,
  onSettings,
  onLogout,
}: TopBarProps) {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  const [menuVisible, setMenuVisible] =
    useState(false);

  const handleProfile = () => {
    setMenuVisible(false);
    onProfile?.();
  };

  const handleSettings = () => {
    setMenuVisible(false);
    onSettings?.();
  };

  const handleLogout = () => {
    setMenuVisible(false);
    onLogout?.();
  };

  return (
    <View
      style={[
        styles.container,
        isMobile && styles.mobileContainer,
      ]}
    >
      {/* ================================================= */}
      {/* PAGE TITLE */}
      {/* ================================================= */}

      <View
        style={[
          styles.titleContainer,
          isMobile && styles.mobileTitleContainer,
        ]}
      >
        <Text
          numberOfLines={isMobile ? 3 : 1}
          ellipsizeMode="tail"
          style={[
            styles.title,
            isMobile && styles.mobileTitle,
          ]}
        >
          {title}
        </Text>
      </View>

      {/* ================================================= */}
      {/* USER */}
      {/* ================================================= */}

      <View style={styles.rightSection}>
        <Pressable
          onPress={() =>
            setMenuVisible(
              previous => !previous,
            )
          }
          style={({ pressed }) => [
            styles.userButton,
            isMobile &&
              styles.mobileUserButton,
            pressed &&
              styles.userButtonPressed,
          ]}
        >
          {/* AVATAR */}

          <View
            style={[
              styles.avatar,
              isMobile &&
                styles.mobileAvatar,
            ]}
          >
            <Text
              style={[
                styles.avatarText,
                isMobile &&
                  styles.mobileAvatarText,
              ]}
            >
              U
            </Text>
          </View>

          {/* USER INFORMATION */}

          {!isMobile && (
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                User
              </Text>

              <Text style={styles.userRole}>
                Learner
              </Text>
            </View>
          )}

          {/* ARROW */}

          <Text
            style={[
              styles.arrow,
              isMobile &&
                styles.mobileArrow,
            ]}
          >
            {menuVisible ? '▲' : '▼'}
          </Text>
        </Pressable>

        {/* ================================================= */}
        {/* PROFILE DROPDOWN */}
        {/* ================================================= */}

        <Modal
          visible={menuVisible}
          transparent
          animationType="fade"
          onRequestClose={() =>
            setMenuVisible(false)
          }
        >
          {/* OUTSIDE CLICK */}

          <TouchableWithoutFeedback
            onPress={() =>
              setMenuVisible(false)
            }
          >
            <View
              style={[
                styles.modalOverlay,
                isMobile &&
                  styles.mobileModalOverlay,
              ]}
            >
              {/* PREVENT DROPDOWN CLICK FROM CLOSING */}

              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.dropdown,
                    isMobile &&
                      styles.mobileDropdown,
                  ]}
                >
                  {/* ======================================= */}
                  {/* USER HEADER */}
                  {/* ======================================= */}

                  <View
                    style={styles.dropdownHeader}
                  >
                    <View
                      style={
                        styles.dropdownAvatar
                      }
                    >
                      <Text
                        style={
                          styles.dropdownAvatarText
                        }
                      >
                        U
                      </Text>
                    </View>

                    <View
                      style={
                        styles.dropdownUserInfo
                      }
                    >
                      <Text
                        style={
                          styles.dropdownUserName
                        }
                      >
                        User
                      </Text>

                      <Text
                        style={
                          styles.dropdownUserRole
                        }
                      >
                        Learner
                      </Text>
                    </View>
                  </View>

                  <View
                    style={styles.divider}
                  />

                  {/* ======================================= */}
                  {/* PROFILE */}
                  {/* ======================================= */}

                  <Pressable
                    onPress={handleProfile}
                    style={({ pressed }) => [
                      styles.menuItem,
                      pressed &&
                        styles.menuItemPressed,
                    ]}
                  >
                    <View
                      style={styles.menuIcon}
                    >
                      <Text
                        style={
                          styles.menuIconText
                        }
                      >
                        👤
                      </Text>
                    </View>

                    <View
                      style={
                        styles.menuTextContainer
                      }
                    >
                      <Text
                        style={styles.menuTitle}
                      >
                        Profile
                      </Text>

                      <Text
                        style={
                          styles.menuDescription
                        }
                      >
                        View your profile
                      </Text>
                    </View>
                  </Pressable>

                  {/* ======================================= */}
                  {/* SETTINGS */}
                  {/* ======================================= */}

                  <Pressable
                    onPress={handleSettings}
                    style={({ pressed }) => [
                      styles.menuItem,
                      pressed &&
                        styles.menuItemPressed,
                    ]}
                  >
                    <View
                      style={styles.menuIcon}
                    >
                      <Text
                        style={
                          styles.menuIconText
                        }
                      >
                        ⚙
                      </Text>
                    </View>

                    <View
                      style={
                        styles.menuTextContainer
                      }
                    >
                      <Text
                        style={styles.menuTitle}
                      >
                        Settings
                      </Text>

                      <Text
                        style={
                          styles.menuDescription
                        }
                      >
                        Manage preferences
                      </Text>
                    </View>
                  </Pressable>

                  <View
                    style={styles.divider}
                  />

                  {/* ======================================= */}
                  {/* LOGOUT */}
                  {/* ======================================= */}

                  <Pressable
                    onPress={handleLogout}
                    style={({ pressed }) => [
                      styles.menuItem,
                      pressed &&
                        styles.menuItemPressed,
                    ]}
                  >
                    <View
                      style={styles.menuIcon}
                    >
                      <Text
                        style={styles.logoutIcon}
                      >
                        ↪
                      </Text>
                    </View>

                    <View
                      style={
                        styles.menuTextContainer
                      }
                    >
                      <Text
                        style={styles.logoutTitle}
                      >
                        Logout
                      </Text>

                      <Text
                        style={
                          styles.menuDescription
                        }
                      >
                        Sign out of your account
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </View>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  /* ===================================================
     TOP BAR
  =================================================== */

  container: {
    height: 70,
    width: '100%',

    backgroundColor:
      colors.background,

    borderBottomWidth: 1,
    borderBottomColor:
      colors.border,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 24,

    zIndex: 100,
  },

  mobileContainer: {
    height: 64,
    paddingHorizontal: 10,
    paddingLeft: 64,
  },

  /* ===================================================
     TITLE
  =================================================== */

  titleContainer: {
    flex: 1,
    minWidth: 0,
    paddingRight: 16,
  },

  mobileTitleContainer: {
    paddingRight: 8,
  },

  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },

  mobileTitle: {
    fontSize: 14,
    lineHeight: 18,
  },

  /* ===================================================
     RIGHT USER SECTION
  =================================================== */

  rightSection: {
    alignItems: 'flex-end',
    zIndex: 200,
  },

  userButton: {
    minHeight: 48,

    paddingHorizontal: 8,
    paddingVertical: 5,

    borderRadius:
      theme.radius.md,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 10,
  },

  mobileUserButton: {
    minHeight: 42,
    paddingHorizontal: 4,
    gap: 5,
  },

  userButtonPressed: {
    backgroundColor:
      colors.surface,
  },

  /* ===================================================
     AVATAR
  =================================================== */

  avatar: {
    width: 36,
    height: 36,

    borderRadius: 18,

    backgroundColor:
      colors.primary,

    alignItems: 'center',
    justifyContent: 'center',
  },

  mobileAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },

  avatarText: {
    color: colors.background,
    fontSize: 13,
    fontWeight: '900',
  },

  mobileAvatarText: {
    fontSize: 12,
  },

  /* ===================================================
     USER INFO
  =================================================== */

  userInfo: {
    minWidth: 75,
  },

  userName: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },

  userRole: {
    color: colors.textSecondary,
    fontSize: 9,
    marginTop: 2,
  },

  /* ===================================================
     ARROW
  =================================================== */

  arrow: {
    color: colors.textSecondary,
    fontSize: 8,
    marginLeft: 2,
  },

  mobileArrow: {
    fontSize: 7,
  },

  /* ===================================================
     MODAL
  =================================================== */

  modalOverlay: {
    flex: 1,

    backgroundColor:
      'transparent',

    alignItems: 'flex-end',

    paddingTop: 68,
    paddingRight: 18,
  },

  mobileModalOverlay: {
    paddingTop: 58,
    paddingRight: 8,
    paddingLeft: 8,
  },

  /* ===================================================
     DROPDOWN
  =================================================== */

  dropdown: {
    width: 270,

    backgroundColor:
      colors.surface,

    borderWidth: 1,
    borderColor:
      colors.border,

    borderRadius:
      theme.radius.md,

    paddingVertical: 8,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.35,
    shadowRadius: 18,

    elevation: 12,
  },

  mobileDropdown: {
    width: '100%',
    maxWidth: 340,
  },

  /* ===================================================
     DROPDOWN HEADER
  =================================================== */

  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  dropdownAvatar: {
    width: 40,
    height: 40,

    borderRadius: 20,

    backgroundColor:
      colors.primary,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 11,
  },

  dropdownAvatarText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '900',
  },

  dropdownUserInfo: {
    flex: 1,
  },

  dropdownUserName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },

  dropdownUserRole: {
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: 3,
  },

  /* ===================================================
     DIVIDER
  =================================================== */

  divider: {
    height: 1,

    backgroundColor:
      colors.border,

    marginVertical: 5,
  },

  /* ===================================================
     MENU ITEM
  =================================================== */

  menuItem: {
    minHeight: 58,

    paddingHorizontal: 14,
    paddingVertical: 9,

    flexDirection: 'row',
    alignItems: 'center',

    borderRadius: 8,

    marginHorizontal: 6,
  },

  menuItemPressed: {
    backgroundColor:
      colors.surfaceElevated,
  },

  /* ===================================================
     MENU ICON
  =================================================== */

  menuIcon: {
    width: 34,
    height: 34,

    borderRadius: 8,

    backgroundColor:
      colors.surfaceElevated,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 11,
  },

  menuIconText: {
    fontSize: 15,
  },

  logoutIcon: {
    color: '#FF6B6B',
    fontSize: 18,
    fontWeight: '800',
  },

  /* ===================================================
     MENU TEXT
  =================================================== */

  menuTextContainer: {
    flex: 1,
  },

  menuTitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },

  logoutTitle: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '700',
  },

  menuDescription: {
    color: colors.textSecondary,
    fontSize: 9,
    marginTop: 3,
  },
});