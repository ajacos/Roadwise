"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native"
import { Text, TextInput, Button, Avatar } from "react-native-paper"
import { LinearGradient } from "expo-linear-gradient"
import * as ImagePicker from "expo-image-picker"
import { BASE_URL } from "../config"
import colors from "../utils/colors"
import { fetchUserProfile, updateUserProfile, updateProfilePicture } from "../utils/api"

const EditProfileScreen = ({ navigation }) => {
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [bio, setBio] = useState("")
  const [profilePicture, setProfilePicture] = useState(null)

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userData = await fetchUserProfile()
        setName(userData.name || "")
        setUsername(userData.username || "")
        setEmail(userData.email || "")
        setPhone(userData.phone || "")
        setBio(userData.bio || "")
        setProfilePicture(userData.profilePicture || null)
        console.log("Loaded user profile:", userData)
      } catch (error) {
        console.error("Error loading user profile:", error)
      }
    }

    loadUserProfile()
  }, [])

  const handleSave = async () => {
    try {
      const updatedProfile = await updateUserProfile({ name, username, email, phone, bio })
      console.log("Updated profile:", updatedProfile)
      alert("Profile updated successfully!")
      navigation.goBack()
    } catch (error) {
      console.error("Error saving profile:", error)
      alert("Failed to update profile. Please try again.")
    }
  }

  const handleChangePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to change your profile picture.")
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })

      console.log("Image picker result:", result)

      if (!result.canceled) {
        const uri = result.assets[0].uri
        console.log("Selected image URI:", uri)

        const formData = new FormData()
        formData.append("profilePicture", {
          uri,
          type: "image/jpeg",
          name: "profile-picture.jpg",
        })

        console.log("FormData created:", formData)

        try {
          const response = await updateProfilePicture(formData)
          console.log("Profile picture update response:", response)
          setProfilePicture(response.profilePicture)
          alert("Profile picture updated successfully!")
        } catch (error) {
          console.error("Error updating profile picture:", error)
          console.error("Error stack:", error.stack)
          alert(`Failed to update profile picture. Error: ${error.message}`)
        }
      }
    } catch (error) {
      console.error("Error in handleChangePhoto:", error)
      console.error("Error stack:", error.stack)
      alert(`An error occurred while changing the photo. Error: ${error.message}`)
    }
  }

  const getProfilePictureUri = () => {
    if (!profilePicture) return null
    // Use BASE_URL for profile pictures, not API_URL
    const uri = profilePicture.startsWith("http") ? profilePicture : `${BASE_URL}${profilePicture}`
    console.log("Profile picture URI:", uri)
    return uri
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.header}>
        <Text style={styles.title}>Edit Profile</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={handleChangePhoto}>
            {profilePicture ? (
              <Image
                source={{ uri: getProfilePictureUri() }}
                style={styles.avatar}
                onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
              />
            ) : (
              <Avatar.Icon size={120} icon="account" style={styles.avatar} />
            )}
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          theme={{ colors: { primary: colors.primary } }}
        />

        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          mode="outlined"
          style={styles.input}
          theme={{ colors: { primary: colors.primary } }}
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          theme={{ colors: { primary: colors.primary } }}
        />

        <TextInput
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          mode="outlined"
          style={styles.input}
          keyboardType="phone-pad"
          theme={{ colors: { primary: colors.primary } }}
        />

        <TextInput
          label="Bio"
          value={bio}
          onChangeText={setBio}
          mode="outlined"
          style={styles.input}
          multiline
          numberOfLines={4}
          theme={{ colors: { primary: colors.primary } }}
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
    backgroundColor: colors.background,
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
    color: colors.surface,
  },
  content: {
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  changePhotoText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 15,
    backgroundColor: colors.surface,
  },
  button: {
    marginTop: 10,
    backgroundColor: colors.accent,
  },
})

export default EditProfileScreen

