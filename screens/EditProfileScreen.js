"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { Text, TextInput, Button, Avatar } from "react-native-paper"
import { LinearGradient } from "expo-linear-gradient"
import AsyncStorage from "@react-native-async-storage/async-storage"

const EditProfileScreen = ({ navigation }) => {
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [phone, setPhone] = useState("")
  const [bio, setBio] = useState("")

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedName = await AsyncStorage.getItem("userName")
        const storedUsername = await AsyncStorage.getItem("username")
        if (storedName) setName(storedName)
        if (storedUsername) setUsername(storedUsername)
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserData()
  }, [])

  const handleSave = async () => {
    try {
      // Save the updated profile information
      await AsyncStorage.setItem("userName", name)
      await AsyncStorage.setItem("username", username)
      // Here you would typically also send this data to your backend API
      // await updateUserProfile({ name, username, phone, bio })

      // Show a success message
      alert("Profile updated successfully!")

      // Navigate back to the previous screen
      navigation.goBack()
    } catch (error) {
      console.error("Error saving profile:", error)
      alert("Failed to update profile. Please try again.")
    }
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#8B4513", "#FF8C00"]} style={styles.header}>
        <Text style={styles.title}>Edit Profile</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Avatar.Image size={120} source={{ uri: "https://picsum.photos/200" }} style={styles.avatar} />
          <Button mode="text" onPress={() => console.log("Change photo")} color="#FF8C00">
            Change Photo
          </Button>
        </View>

        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          theme={{ colors: { primary: "#8B4513" } }}
        />

        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          mode="outlined"
          style={styles.input}
          theme={{ colors: { primary: "#8B4513" } }}
        />

        <TextInput
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          mode="outlined"
          style={styles.input}
          keyboardType="phone-pad"
          theme={{ colors: { primary: "#8B4513" } }}
        />

        <TextInput
          label="Bio"
          value={bio}
          onChangeText={setBio}
          mode="outlined"
          style={styles.input}
          multiline
          numberOfLines={4}
          theme={{ colors: { primary: "#8B4513" } }}
        />

        <Button mode="contained" onPress={handleSave} style={styles.button}>
          Save Changes
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF5E6",
  },
  content: {
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#FFF5E6",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#FF8C00",
  },
})

export default EditProfileScreen

