"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import { Text, FAB, Portal, Dialog, Button, TextInput, Menu, IconButton } from "react-native-paper"
import MapView, { Marker, Callout } from "react-native-maps"
import { LinearGradient } from "expo-linear-gradient"
import * as Location from "expo-location"
import { colors } from "../utils/colors"
import HazardMarker from "../components/HazardMarker"

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

const HazardMapScreen = () => {
  const [markers, setMarkers] = useState([])
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [hazardType, setHazardType] = useState("")
  const [hazardDescription, setHazardDescription] = useState("")
  const [region, setRegion] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [tempMarkers, setTempMarkers] = useState([])
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const [isAddingMarkers, setIsAddingMarkers] = useState(false)

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
    })()
  }, [])

  const handleMapPress = (event) => {
    if (isAddingMarkers) {
      const { coordinate } = event.nativeEvent
      setTempMarkers([...tempMarkers, coordinate])
    }
  }

  const handleAddHazard = () => {
    if (tempMarkers.length > 0 && hazardType && hazardDescription) {
      const newMarkers = tempMarkers.map((marker) => ({
        ...marker,
        type: hazardType,
        description: hazardDescription,
      }))
      setMarkers([...markers, ...newMarkers])
      setIsDialogVisible(false)
      setHazardType("")
      setHazardDescription("")
      setTempMarkers([])
      setIsAddingMarkers(false)
    }
  }

  const handleCancelAddMarkers = () => {
    setTempMarkers([])
    setIsAddingMarkers(false)
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.header}>
        <Text style={styles.title}>Hazard Map</Text>
      </LinearGradient>
      {region ? (
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          followsUserLocation={true}
          onPress={handleMapPress}
        >
          {markers.map((marker, index) => (
            <Marker key={`permanent-${index}`} coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}>
              <HazardMarker />
              <Callout>
                <View>
                  <Text style={styles.calloutTitle}>{marker.type}</Text>
                  <Text>{marker.description}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
          {tempMarkers.map((marker, index) => (
            <Marker key={`temp-${index}`} coordinate={marker} pinColor={colors.accent} />
          ))}
        </MapView>
      ) : (
        <View style={styles.centerContainer}>
          <Text>{errorMsg || "Loading map..."}</Text>
        </View>
      )}
      {isAddingMarkers ? (
        <View style={styles.addingMarkersContainer}>
          <Text style={styles.addingMarkersText}>Tap on the map to add markers</Text>
          <Button mode="contained" onPress={() => setIsDialogVisible(true)} style={styles.doneButton}>
            Done
          </Button>
          <IconButton icon="close" size={24} onPress={handleCancelAddMarkers} style={styles.cancelButton} />
        </View>
      ) : (
        <FAB style={styles.fab} icon="plus" onPress={() => setIsAddingMarkers(true)} color={colors.surface} />
      )}
      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)}>
          <Dialog.Title>Add Hazard</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>Select the hazard type and describe it below.</Text>
            <Menu
              visible={isMenuVisible}
              onDismiss={() => setIsMenuVisible(false)}
              anchor={
                <Button onPress={() => setIsMenuVisible(true)} mode="outlined" style={styles.dropdown}>
                  {hazardType ? hazardTypes.find((type) => type.value === hazardType).label : "Select Hazard Type"}
                </Button>
              }
            >
              {hazardTypes.map((type) => (
                <Menu.Item
                  key={type.value}
                  onPress={() => {
                    setHazardType(type.value)
                    setIsMenuVisible(false)
                  }}
                  title={type.label}
                />
              ))}
            </Menu>
            <TextInput
              label="Hazard Description"
              value={hazardDescription}
              onChangeText={setHazardDescription}
              mode="outlined"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleAddHazard} disabled={!hazardType || !hazardDescription || tempMarkers.length === 0}>
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
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
  map: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.accent,
  },
  dialogText: {
    marginBottom: 16,
  },
  dropdown: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  calloutTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  addingMarkersContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
  },
  addingMarkersText: {
    flex: 1,
    marginRight: 8,
  },
  doneButton: {
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: colors.error,
  },
})

export default HazardMapScreen

