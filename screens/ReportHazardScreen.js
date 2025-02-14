"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, Alert } from "react-native"
import { Text, TextInput, Button, HelperText, Menu } from "react-native-paper"
import { LinearGradient } from "expo-linear-gradient"
import * as Location from "expo-location"
import MapView, { Marker } from "react-native-maps"
import AsyncStorage from "@react-native-async-storage/async-storage"

const hazardTypes = [
  { label: "Pothole", value: "pothole" },
  { label: "Broken Traffic Light", value: "broken_traffic_light" },
  { label: "Fallen Tree", value: "fallen_tree" },
  { label: "Flooding", value: "flooding" },
  { label: "Construction", value: "construction" },
  { label: "Other", value: "other" },
]

const ReportHazardScreen = ({ navigation }) => {
  const [hazardType, setHazardType] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [menuVisible, setMenuVisible] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied")
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      setLocation(location.coords)
    })()
  }, [])

  const handleSubmit = async () => {
    if (!hazardType || !description || !location) {
      Alert.alert("Error", "Please fill in all fields and allow location access")
      return
    }

    try {
      const username = await AsyncStorage.getItem("username")
      const hazardReport = {
        type: hazardType,
        description,
        latitude: location.latitude,
        longitude: location.longitude,
        reportedBy: username,
        timestamp: new Date().toISOString(),
      }

      // Here you would typically send this data to your backend API
      // For now, we'll just log it and show a success message
      console.log("Hazard Report:", hazardReport)

      Alert.alert("Success", "Hazard reported successfully!")
      navigation.goBack()
    } catch (error) {
      console.error("Error submitting hazard report:", error)
      Alert.alert("Error", "Failed to submit hazard report. Please try again.")
    }
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#8B4513", "#FF8C00"]} style={styles.header}>
        <Text style={styles.title}>Report a Hazard</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button onPress={() => setMenuVisible(true)} mode="outlined" style={styles.dropdown}>
              {hazardType ? hazardTypes.find((t) => t.value === hazardType).label : "Select Hazard Type"}
            </Button>
          }
        >
          {hazardTypes.map((type) => (
            <Menu.Item
              key={type.value}
              onPress={() => {
                setHazardType(type.value)
                setMenuVisible(false)
              }}
              title={type.label}
            />
          ))}
        </Menu>

        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
        />
        <HelperText type="info">
          Please provide details about the hazard, including its exact location if possible.
        </HelperText>

        {location ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Hazard Location"
            />
          </MapView>
        ) : (
          <Text>{errorMsg || "Loading map..."}</Text>
        )}

        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Submit Report
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
  dropdown: {
    marginBottom: 15,
    backgroundColor: "#FFF5E6",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#FFF5E6",
  },
  map: {
    width: "100%",
    height: 200,
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#FF8C00",
  },
})

export default ReportHazardScreen

