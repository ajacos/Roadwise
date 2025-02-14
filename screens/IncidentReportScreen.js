"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, Dimensions } from "react-native"
import { Text, TextInput, Button, Menu } from "react-native-paper"
import { LinearGradient } from "expo-linear-gradient"
import MapView, { Marker } from "react-native-maps"
import * as Location from "expo-location"
import { colors } from "../utils/colors"

const { width, height } = Dimensions.get("window")
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

const hazardTypes = [
  { label: "Pothole", value: "pothole" },
  { label: "Traffic", value: "traffic" },
  { label: "Construction", value: "construction" },
  { label: "Other", value: "other" },
]

const IncidentReportScreen = () => {
  const [description, setDescription] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [region, setRegion] = useState(null)
  const [marker, setMarker] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [isMenuVisible, setIsMenuVisible] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied")
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }
      setRegion(newRegion)
      setMarker(newRegion)
    })()
  }, [])

  const handleSubmit = () => {
    if (selectedType && description && marker) {
      console.log("Incident reported:", { selectedType, description, location: marker })
      alert("Incident reported successfully!")
      setSelectedType("")
      setDescription("")
      setMarker(null)
    } else {
      alert("Please fill in all fields and mark the location on the map.")
    }
  }

  const handleMapPress = (event) => {
    setMarker(event.nativeEvent.coordinate)
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.header}>
        <Text style={styles.title}>Report an Incident</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Incident Location</Text>
        {region ? (
          <MapView style={styles.map} region={region} onPress={handleMapPress}>
            {marker && <Marker coordinate={marker} />}
          </MapView>
        ) : (
          <Text>{errorMsg || "Loading map..."}</Text>
        )}

        <Text style={styles.sectionTitle}>Incident Type</Text>
        <Menu
          visible={isMenuVisible}
          onDismiss={() => setIsMenuVisible(false)}
          anchor={
            <Button onPress={() => setIsMenuVisible(true)} mode="outlined" style={styles.dropdown}>
              {selectedType ? hazardTypes.find((type) => type.value === selectedType).label : "Select Incident Type"}
            </Button>
          }
        >
          {hazardTypes.map((type) => (
            <Menu.Item
              key={type.value}
              onPress={() => {
                setSelectedType(type.value)
                setIsMenuVisible(false)
              }}
              title={type.label}
            />
          ))}
        </Menu>

        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        <Button mode="contained" style={styles.button} labelStyle={styles.buttonLabel} onPress={handleSubmit}>
          Submit Report
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.surface,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.text,
  },
  map: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  dropdown: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
    backgroundColor: colors.surface,
  },
  button: {
    backgroundColor: colors.accent,
    marginTop: 10,
    borderRadius: 30,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default IncidentReportScreen

