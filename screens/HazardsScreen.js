"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { View, StyleSheet, Alert, ScrollView, TouchableOpacity, Dimensions, Animated, Image } from "react-native"
import { Text, Button, FAB, Portal, Dialog, TextInput, Menu, ActivityIndicator } from "react-native-paper"
import MapView, { Marker } from "react-native-maps"
import * as Location from "expo-location"
import { reportHazard, fetchHazards } from "../utils/api"
import { Ionicons } from "@expo/vector-icons"
import colors from "../utils/colors"
import { LinearGradient } from "expo-linear-gradient"
import io from "socket.io-client"
import { API_URL } from "../config"
import { BASE_URL } from "../config"

const { width, height } = Dimensions.get("window")
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

const hazardTypes = [
  { label: "Pothole", value: "pothole", icon: "car" },
  { label: "Traffic", value: "traffic", icon: "car-sport" },
  { label: "Construction", value: "construction", icon: "construct" },
  { label: "Other", value: "other", icon: "alert-circle" },
]

const HazardsScreen = ({ navigation }) => {
  const [hazards, setHazards] = useState([])
  const [region, setRegion] = useState(null)
  const [marker, setMarker] = useState(null)
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [hazardType, setHazardType] = useState("")
  const [hazardDescription, setHazardDescription] = useState("")
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const [isAddingMarkers, setIsAddingMarkers] = useState(false)
  const [tempMarkers, setTempMarkers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedHazard, setSelectedHazard] = useState(null)
  const popupAnimation = useRef(new Animated.Value(0)).current
  const socketRef = useRef(null)
  const [newHazardAlert, setNewHazardAlert] = useState(null)

  const loadHazards = useCallback(async () => {
    setIsLoading(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied")
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      })

      const fetchedHazards = await fetchHazards()
      setHazards(fetchedHazards)
    } catch (error) {
      console.error("Error loading hazards:", error)
      Alert.alert("Error", "Failed to fetch hazards")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadHazards()

    // Connect to Socket.IO server
    socketRef.current = io(API_URL)

    // Listen for new hazards
    socketRef.current.on("newHazard", (newHazard) => {
      console.log("Received new hazard:", newHazard)
      setHazards((prevHazards) => [newHazard, ...prevHazards])
      setNewHazardAlert(`New ${newHazard.type} hazard reported!`)
      setTimeout(() => setNewHazardAlert(null), 3000)
    })

    return () => {
      // Disconnect Socket.IO when component unmounts
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [loadHazards])

  useEffect(() => {
    if (selectedHazard) {
      Animated.spring(popupAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start()
    } else {
      Animated.spring(popupAnimation, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start()
    }
  }, [selectedHazard, popupAnimation])

  const handleMapPress = (event) => {
    if (isAddingMarkers) {
      const { coordinate } = event.nativeEvent
      setTempMarkers([...tempMarkers, coordinate])
    } else {
      setMarker(event.nativeEvent.coordinate)
      setSelectedHazard(null)
    }
  }

  const handleAddHazard = async () => {
    if (tempMarkers.length > 0 && hazardType && hazardDescription) {
      try {
        for (const marker of tempMarkers) {
          const hazardData = {
            type: hazardType,
            description: hazardDescription,
            latitude: marker.latitude,
            longitude: marker.longitude,
          }
          const newHazard = await reportHazard(hazardData)

          // Emit the new hazard to all connected clients
          socketRef.current.emit("newHazard", newHazard)
        }
        Alert.alert("Success", "Hazard(s) reported successfully")

        setIsDialogVisible(false)
        setHazardType("")
        setHazardDescription("")
        setTempMarkers([])
        setIsAddingMarkers(false)
        loadHazards() // Refresh the hazards list
      } catch (error) {
        console.error("Error adding hazard:", error)
        Alert.alert("Error", "Failed to report hazard(s)")
      }
    } else {
      Alert.alert("Error", "Please fill in all fields and mark the location(s)")
    }
  }

  const handleCancelAddMarkers = () => {
    setTempMarkers([])
    setIsAddingMarkers(false)
  }

  const handleHazardSelect = (hazard) => {
    setSelectedHazard(hazard)
    if (hazard.location && hazard.location.coordinates) {
      setRegion({
        latitude: hazard.location.coordinates[1],
        longitude: hazard.location.coordinates[0],
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      })
    }
  }

  const renderHazardPopup = () => {
    if (!selectedHazard) return null

    const translateY = popupAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0],
    })

    return (
      <Animated.View
        style={[
          styles.hazardPopup,
          {
            transform: [{ translateY }],
            opacity: popupAnimation,
          },
        ]}
      >
        <View style={styles.hazardPopupContent}>
          <Ionicons
            name={hazardTypes.find((t) => t.value === selectedHazard.type)?.icon || "alert-circle"}
            size={32}
            color={colors.primary}
            style={styles.hazardPopupIcon}
          />
          <View style={styles.hazardPopupInfo}>
            <Text style={styles.hazardPopupType}>{selectedHazard.type}</Text>
            <Text style={styles.hazardPopupDescription}>{selectedHazard.description}</Text>
            <Text style={styles.hazardPopupAddress}>{selectedHazard.address}</Text>
            <View style={styles.reportedByContainer}>
              <Image
                source={{ uri: `${BASE_URL}${selectedHazard.reportedBy.profilePicture}` }}
                style={styles.reporterProfilePic}
              />
              <Text style={styles.reportedByText}>Reported by: {selectedHazard.reportedBy.username}</Text>
            </View>
          </View>
        </View>
        <Button mode="contained" onPress={() => setSelectedHazard(null)} style={styles.closePopupButton}>
          Close
        </Button>
      </Animated.View>
    )
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading hazards...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.header}>
        <Text style={styles.title}>Hazard Map</Text>
      </LinearGradient>
      {newHazardAlert && (
        <View style={styles.alertContainer}>
          <Text style={styles.alertText}>{newHazardAlert}</Text>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.mapContainer}>
          {region && (
            <MapView style={styles.map} region={region} onPress={handleMapPress}>
              {hazards.map(
                (hazard) =>
                  hazard.location &&
                  hazard.location.coordinates && (
                    <Marker
                      key={hazard._id}
                      coordinate={{
                        latitude: hazard.location.coordinates[1],
                        longitude: hazard.location.coordinates[0],
                      }}
                      title={hazard.type}
                      description={hazard.description}
                      pinColor={selectedHazard && selectedHazard._id === hazard._id ? colors.accent : colors.primary}
                      onPress={() => handleHazardSelect(hazard)}
                    />
                  ),
              )}
              {tempMarkers.map((marker, index) => (
                <Marker key={`temp-${index}`} coordinate={marker} pinColor={colors.accent} />
              ))}
            </MapView>
          )}
          {renderHazardPopup()}
          {isAddingMarkers ? (
            <View style={styles.addingMarkersContainer}>
              <Text style={styles.addingMarkersText}>Tap on the map to add markers</Text>
              <Button mode="contained" onPress={() => setIsDialogVisible(true)} style={styles.doneButton}>
                Done
              </Button>
              <Button mode="outlined" onPress={handleCancelAddMarkers} style={styles.cancelButton}>
                Cancel
              </Button>
            </View>
          ) : (
            <FAB style={styles.fab} icon="plus" onPress={() => setIsAddingMarkers(true)} color={colors.surface} />
          )}
        </View>
        <View style={styles.reportedHazardsContainer}>
          <Text style={styles.listTitle}>Reported Hazards</Text>
          <ScrollView style={styles.scrollView}>
            {hazards.map((hazard) => (
              <TouchableOpacity key={hazard._id} onPress={() => handleHazardSelect(hazard)}>
                <View
                  style={[
                    styles.hazardItem,
                    selectedHazard && selectedHazard._id === hazard._id && styles.selectedHazard,
                  ]}
                >
                  <Image
                    source={{ uri: `${BASE_URL}${hazard.reportedBy.profilePicture}` }}
                    style={styles.reporterProfilePic}
                  />
                  <View style={styles.hazardInfo}>
                    <Text style={styles.hazardType}>{hazard.type}</Text>
                    <Text style={styles.hazardDescription}>{hazard.description}</Text>
                    <Text style={styles.hazardAddress} numberOfLines={2}>
                      {hazard.address}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Add Hazard</Dialog.Title>
          <Dialog.Content>
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
                  leadingIcon={(props) => <Ionicons name={type.icon} {...props} />}
                />
              ))}
            </Menu>
            <TextInput
              label="Hazard Description"
              value={hazardDescription}
              onChangeText={setHazardDescription}
              mode="outlined"
              style={styles.input}
              multiline
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDialogVisible(false)} color={colors.textLight}>
              Cancel
            </Button>
            <Button onPress={handleAddHazard} mode="contained" style={styles.addButton}>
              Add Hazard
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
  content: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  reportedHazardsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "40%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  scrollView: {
    maxHeight: "100%",
  },
  hazardItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  selectedHazard: {
    backgroundColor: colors.primaryLight,
  },
  hazardIcon: {
    marginRight: 12,
  },
  hazardInfo: {
    flex: 1,
  },
  hazardType: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  hazardDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  hazardAddress: {
    fontSize: 12,
    color: colors.textLight,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: "40%",
    backgroundColor: colors.accent,
  },
  addingMarkersContainer: {
    position: "absolute",
    bottom: "40%",
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
    color: colors.text,
    fontWeight: "bold",
  },
  doneButton: {
    marginRight: 8,
    backgroundColor: colors.accent,
  },
  cancelButton: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  dialog: {
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  dialogTitle: {
    color: colors.text,
    fontWeight: "bold",
  },
  dropdown: {
    marginBottom: 16,
    borderColor: colors.primary,
  },
  input: {
    backgroundColor: colors.surface,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: colors.accent,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 10,
    color: colors.text,
    fontSize: 16,
  },
  hazardPopup: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  hazardPopupContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  hazardPopupIcon: {
    marginRight: 16,
  },
  hazardPopupInfo: {
    flex: 1,
  },
  hazardPopupType: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  hazardPopupDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  hazardPopupAddress: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  reportedByContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reporterProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reportedByText: {
    fontSize: 14,
    color: colors.textLight,
  },
  closePopupButton: {
    backgroundColor: colors.accent,
  },
  alertContainer: {
    position: "absolute",
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: colors.accent,
    borderRadius: 8,
    padding: 10,
    zIndex: 1000,
  },
  alertText: {
    color: colors.surface,
    fontWeight: "bold",
    textAlign: "center",
  },
})

export default HazardsScreen

