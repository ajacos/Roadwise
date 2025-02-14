import { View, StyleSheet, ScrollView, Alert } from "react-native"
import { Text, Avatar, List, Button } from "react-native-paper"
import { LinearGradient } from "expo-linear-gradient"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { CommonActions } from "@react-navigation/native"
import { useState, useEffect } from "react"

const AccountsScreen = ({ navigation }) => {
  const [userName, setUserName] = useState("User")

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const name = await AsyncStorage.getItem("userName")
        if (name) {
          setUserName(name)
        } else {
          const fallbackName = await AsyncStorage.getItem("userToken")
          setUserName(fallbackName ? "User" : "Guest")
        }
      } catch (error) {
        console.error("Error fetching user name:", error)
        setUserName("User")
      }
    }
    fetchUserName()
  }, [])

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("userToken")
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                }),
              )
            } catch (error) {
              console.error("Error logging out:", error)
            }
          },
        },
      ],
      { cancelable: false },
    )
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#8B4513", "#FF8C00"]} style={styles.header}>
        <Avatar.Icon size={80} icon="account" backgroundColor="#FF8C00" />
        <Text style={styles.username}>{userName}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <List.Section>
          <List.Subheader style={styles.subheader}>Account Settings</List.Subheader>
          <List.Item
            title="Edit Profile"
            left={() => <List.Icon icon="account-edit" color="#8B4513" />}
            onPress={() => navigation.navigate("EditProfile")}
            style={styles.listItem}
          />
          <List.Item
            title="Change Password"
            left={() => <List.Icon icon="lock" color="#8B4513" />}
            onPress={() => console.log("Change Password")}
            style={styles.listItem}
          />
          <List.Item
            title="Notifications"
            left={() => <List.Icon icon="bell" color="#8B4513" />}
            onPress={() => console.log("Notifications")}
            style={styles.listItem}
          />
        </List.Section>

        <List.Section>
          <List.Subheader style={styles.subheader}>App Settings</List.Subheader>
          <List.Item
            title="Language"
            left={() => <List.Icon icon="translate" color="#8B4513" />}
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
    backgroundColor: "#FFDAB9",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF5E6",
    marginTop: 10,
  },
  content: {
    padding: 20,
  },
  subheader: {
    color: "#8B4513",
    fontWeight: "bold",
  },
  listItem: {
    backgroundColor: "#FFF5E6",
    marginBottom: 10,
    borderRadius: 10,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#FF8C00",
  },
})

export default AccountsScreen

