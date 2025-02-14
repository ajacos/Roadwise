"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, Animated, TouchableOpacity } from "react-native"
import { Surface, Text } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import colors from "../utils/colors"

const GlobalNotification = ({ notification, onDismiss }) => {
  const [slideAnim] = useState(new Animated.Value(-100))

  useEffect(() => {
    if (notification) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start()

      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onDismiss())
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [notification, slideAnim, onDismiss])

  if (!notification) return null

  const handlePress = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onDismiss())
  }

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <TouchableOpacity onPress={handlePress}>
        <Surface style={styles.surface}>
          <Ionicons name="warning" size={24} color={colors.accent} style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{notification.title}</Text>
            <Text style={styles.message}>{notification.message}</Text>
          </View>
        </Surface>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  surface: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    elevation: 4,
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  message: {
    fontSize: 14,
    color: colors.textLight,
  },
})

export default GlobalNotification

