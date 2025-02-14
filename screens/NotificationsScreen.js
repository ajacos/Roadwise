"use client"

import { useState, useEffect, useCallback } from "react"
import { View, StyleSheet, FlatList, RefreshControl, Animated } from "react-native"
import { Text, Card, Title, Paragraph, IconButton, Badge } from "react-native-paper"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import colors from "../utils/colors"
import { fetchNotifications } from "../utils/api"
import io from "socket.io-client"
import { API_URL } from "../config"

const NotificationCard = ({ item, onMarkAsRead, onDelete }) => {
  const getIcon = () => {
    switch (item.type) {
      case "hazard":
        return "warning"
      case "safety":
        return "shield-checkmark"
      case "update":
        return "arrow-up-circle"
      default:
        return "notifications"
    }
  }

  return (
    <Card style={[styles.card, item.read && styles.readCard]}>
      <Card.Content style={styles.cardContent}>
        <Ionicons name={getIcon()} size={24} color={colors.primary} style={styles.icon} />
        <View style={styles.textContainer}>
          <Title style={styles.title}>{item.title}</Title>
          <Paragraph style={styles.message}>{item.message}</Paragraph>
          <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
      </Card.Content>
      <Card.Actions>
        {!item.read && (
          <IconButton icon="check" color={colors.accent} size={20} onPress={() => onMarkAsRead(item._id)} />
        )}
        <IconButton icon="delete" color={colors.error} size={20} onPress={() => onDelete(item._id)} />
      </Card.Actions>
    </Card>
  )
}

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [newNotificationsCount, setNewNotificationsCount] = useState(0)
  const fadeAnim = useState(new Animated.Value(0))[0]

  useEffect(() => {
    loadNotifications()

    const socket = io(API_URL)
    socket.on("newNotification", handleNewNotification)

    return () => {
      socket.off("newNotification", handleNewNotification)
      socket.disconnect()
    }
  }, [])

  const handleNewNotification = useCallback(
    (newNotification) => {
      setNotifications((prevNotifications) => [newNotification, ...prevNotifications])
      setNewNotificationsCount((prevCount) => prevCount + 1)
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(2000),
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start()
    },
    [fadeAnim],
  )

  const loadNotifications = async () => {
    try {
      const fetchedNotifications = await fetchNotifications()
      setNotifications(fetchedNotifications)
      setNewNotificationsCount(0)
    } catch (error) {
      console.error("Error loading notifications:", error)
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await loadNotifications()
    setRefreshing(false)
  }, [loadNotifications]) // Added loadNotifications to dependencies

  const handleMarkAsRead = async (id) => {
    // Implement the API call to mark a notification as read
    // For now, we'll just update the local state
    setNotifications(notifications.map((notif) => (notif._id === id ? { ...notif, read: true } : notif)))
    setNewNotificationsCount((prevCount) => Math.max(0, prevCount - 1))
  }

  const handleDelete = async (id) => {
    // Implement the API call to delete a notification
    // For now, we'll just update the local state
    setNotifications(notifications.filter((notif) => notif._id !== id))
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {newNotificationsCount > 0 && <Badge style={styles.badge}>{newNotificationsCount}</Badge>}
      </LinearGradient>
      <Animated.View style={[styles.newNotificationAlert, { opacity: fadeAnim }]}>
        <Text style={styles.newNotificationText}>New notification received!</Text>
      </Animated.View>
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <NotificationCard item={item} onMarkAsRead={handleMarkAsRead} onDelete={handleDelete} />
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.surface,
  },
  badge: {
    backgroundColor: colors.accent,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 8,
  },
  readCard: {
    opacity: 0.7,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  message: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: colors.textLight,
  },
  newNotificationAlert: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    backgroundColor: colors.accent,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  newNotificationText: {
    color: colors.surface,
    fontWeight: "bold",
  },
})

export default NotificationsScreen

