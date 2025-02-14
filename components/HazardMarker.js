import { View, StyleSheet } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { colors } from "../utils/colors"

const HazardMarker = () => {
  return (
    <View style={styles.markerContainer}>
      <MaterialCommunityIcons name="alert-octagon" size={30} color={colors.error} />
      <View style={styles.markerBase} />
    </View>
  )
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
  },
  markerBase: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: colors.error,
    transform: [{ translateY: -5 }],
  },
})

export default HazardMarker

