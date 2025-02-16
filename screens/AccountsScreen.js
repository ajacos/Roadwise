"use client"

import React, { useState } from "react"
import { View, StyleSheet, ScrollView, Image } from "react-native"
import { Text, List, Button } from "react-native-paper"
import { LinearGradient } from "expo-linear-gradient"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { fetchUserProfile } from "../utils/api"
import { BASE_URL } from "../config"
import colors from "../utils/colors"

const AccountsScreen = () => {
  const navigation = useNavigation()
  const [userData, setUserData] = useState(null)

  const loadUserProfile = async () => {
    try {
      const profile = await fetchUserProfile()
      setUserData(profile)
      console.log("Fetched user profile:", profile)
    } catch (error) {
      console.error("Error loading user profile:", error)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      loadUserProfile()
    }, []), // Removed loadUserProfile from dependencies
  )

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken")
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const getProfilePictureUri = () => {
    if (!userData || !userData.profilePicture) return null
    const uri = userData.profilePicture.startsWith("http")
      ? userData.profilePicture
      : `${BASE_URL}${userData.profilePicture}`
    console.log("Profile picture URI:", uri)
    return uri
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.header}>
        {userData && userData.profilePicture ? (
          <Image
            source={{ uri: getProfilePictureUri() }}
            style={styles.profilePicture}
            onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
          />
        ) : (
          <View style={styles.profilePicturePlaceholder}>
            <Text style={styles.profilePicturePlaceholderText}>
              {userData && userData.name ? userData.name[0].toUpperCase() : "U"}
            </Text>
          </View>
        )}
        <Text style={styles.username}>{userData ? userData.username : "User"}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <List.Section>
          <List.Subheader style={styles.subheader}>Account Settings</List.Subheader>
          <List.Item
            title="Edit Profile"
            left={() => <List.Icon icon="account-edit" color={colors.primary} />}
            onPress={() => navigation.navigate("EditProfile")}
            style={styles.listItem}
          />
          <List.Item
            title="Change Password"
            left={() => <List.Icon icon="lock" color={colors.primary} />}
            onPress={() => console.log("Change Password")}
            style={styles.listItem}
          />
          <List.Item
            title="Notifications"
            left={() => <List.Icon icon="bell" color={colors.primary} />}
            onPress={() => console.log("Notifications")}
            style={styles.listItem}
          />
        </List.Section>

        <List.Section>
          <List.Subheader style={styles.subheader}>App Settings</List.Subheader>
          <List.Item
            title="Language"
            left={() => <List.Icon icon="translate" color={colors.primary} />}
            onPress={() => console.log("Language")}
            style={styles.listItem}
          />
        </List.Section>

        <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
          Logout
        </Button>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  profilePicturePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  profilePicturePlaceholderText: {
    fontSize: 48,
    color: colors.surface,
    fontWeight: "bold",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.surface,
    marginTop: 10,
  },
  content: {
    padding: 20,
  },
  subheader: {
    color: colors.primary,
    fontWeight: "bold",
  },
  listItem: {
    backgroundColor: colors.surface,
    marginBottom: 10,
    borderRadius: 10,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: colors.accent,
  },
})

export default AccountsScreen

