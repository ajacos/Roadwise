"use client"

import { useState, useCallback } from "react"
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from "react-native"
import { Text, Button, Title, Avatar } from "react-native-paper"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import colors from "../utils/colors"

const SafetyTipCard = ({ tip }) => (
  <TouchableOpacity>
    <LinearGradient
      colors={[colors.primary, colors.accent]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.card}
    >
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark" size={32} color={colors.surface} />
        </View>
        <View style={styles.tipInfo}>
          <Text style={styles.tipTitle}>Safety Tip of the Day</Text>
          <Text style={styles.tipText} numberOfLines={2}>
            {tip}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.surface} />
      </View>
    </LinearGradient>
  </TouchableOpacity>
)

const RecentActivityCard = ({ activity }) => (
  <TouchableOpacity>
    <LinearGradient
      colors={[colors.primary, colors.accent]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.card}
    >
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Ionicons name={activity.icon} size={32} color={colors.surface} />
        </View>
        <View style={styles.activityInfo}>
          <Text style={styles.activityTitle}>{activity.title}</Text>
          <Text style={styles.activityDescription} numberOfLines={2}>
            {activity.description}
          </Text>
          <Text style={styles.activityTime}>{activity.time}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.surface} />
      </View>
    </LinearGradient>
  </TouchableOpacity>
)

const TopContributors = () => (
  <View style={styles.contributorsSection}>
    <Title style={styles.sectionTitle}>Top Contributors</Title>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.contributorsList}>
      {[1, 2, 3, 4].map((_, index) => (
        <Avatar.Image
          key={index}
          size={40}
          source={{ uri: `https://i.pravatar.cc/150?img=${index + 1}` }}
          style={styles.contributorAvatar}
        />
      ))}
    </ScrollView>
  </View>
)

const HomeScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    // Simulating a data refresh
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }, [])

  const recentActivities = [
    {
      id: 1,
      title: "New Hazard Reported",
      description: "Pothole on Main Street",
      time: "2 hours ago",
      icon: "warning",
    },
    {
      id: 2,
      title: "Safety Achievement",
      description: "Reported 5 hazards this week",
      time: "1 day ago",
      icon: "trophy",
    },
  ]

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.accent]} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Welcome to Roadwise</Text>
          <Text style={styles.subtitle}>Making roads safer together</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        <View style={styles.content}>
          <TopContributors />

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Title style={styles.sectionTitle}>Safety Tips</Title>
              <Button mode="text" onPress={() => console.log("View all tips")}>
                See All
              </Button>
            </View>
            <SafetyTipCard tip="Always wear a helmet when cycling or riding an e-scooter." />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Title style={styles.sectionTitle}>Recent Activity</Title>
              <Button mode="text" onPress={() => console.log("View all activity")}>
                See All
              </Button>
            </View>
            {recentActivities.map((activity) => (
              <RecentActivityCard key={activity.id} activity={activity} />
            ))}
          </View>

          <Button
            mode="contained"
            style={styles.reportButton}
            labelStyle={styles.buttonLabel}
            onPress={() => navigation.navigate("Hazards")}
          >
            Report New Hazard
          </Button>
        </View>
      </ScrollView>
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.surface,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.surface,
    opacity: 0.8,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  contributorsSection: {
    marginBottom: 20,
  },
  contributorsList: {
    flexDirection: "row",
  },
  contributorAvatar: {
    marginRight: 10,
  },
  card: {
    marginBottom: 15,
    borderRadius: 15,
    elevation: 3,
  },
  cardContent: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  tipInfo: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.surface,
  },
  tipText: {
    fontSize: 14,
    color: colors.surface,
    opacity: 0.8,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.surface,
  },
  activityDescription: {
    fontSize: 14,
    color: colors.surface,
    opacity: 0.8,
  },
  activityTime: {
    fontSize: 12,
    color: colors.surface,
    opacity: 0.6,
    marginTop: 4,
  },
  reportButton: {
    marginTop: 10,
    backgroundColor: colors.accent,
    borderRadius: 30,
    elevation: 3,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.surface,
  },
})

export default HomeScreen

