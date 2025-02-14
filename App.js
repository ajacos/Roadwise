"use client"

import { useState, useEffect, useCallback } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import io from "socket.io-client"

import LoadingScreen from "./screens/LoadingScreen"
import LoginScreen from "./screens/LoginScreen"
import SignupScreen from "./screens/SignupScreen"
import HomeScreen from "./screens/HomeScreen"
import HazardsScreen from "./screens/HazardsScreen"
import ReportHazardScreen from "./screens/ReportHazardScreen"
import EducationScreen from "./screens/EducationScreen"
import NotificationsScreen from "./screens/NotificationsScreen"
import AccountsScreen from "./screens/AccountsScreen"
import EditProfileScreen from "./screens/EditProfileScreen"
import GlobalNotification from "./components/GlobalNotification"
import { API_URL } from "./config"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
const MainStack = createStackNavigator()

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#8B4513",
    accent: "#FF8C00",
    background: "#FFDAB9",
    surface: "#FFF5E6",
    text: "#3E2723",
  },
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Hazards") {
            iconName = focused ? "warning" : "warning-outline"
          } else if (route.name === "Learn") {
            iconName = focused ? "school" : "school-outline"
          } else if (route.name === "Notifications") {
            iconName = focused ? "notifications" : "notifications-outline"
          } else if (route.name === "Account") {
            iconName = focused ? "person" : "person-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#FF8C00",
        tabBarInactiveTintColor: "#8D6E63",
        tabBarStyle: {
          backgroundColor: "#FFF5E6",
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Hazards" component={HazardsScreen} />
      <Tab.Screen name="Learn" component={EducationScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Account" component={AccountsScreen} />
    </Tab.Navigator>
  )
}

function MainStackScreen() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="MainTabs" component={MainTabs} />
      <MainStack.Screen name="EditProfile" component={EditProfileScreen} />
      <MainStack.Screen name="ReportHazard" component={ReportHazardScreen} />
    </MainStack.Navigator>
  )
}

function RootNavigator() {
  const [notification, setNotification] = useState(null)

  const handleNewHazard = useCallback((newHazard) => {
    setNotification({
      title: "New Hazard Reported",
      message: `A new ${newHazard.type} hazard has been reported near you.`,
    })
  }, [])

  const dismissNotification = useCallback(() => {
    setNotification(null)
  }, [])

  useEffect(() => {
    const socket = io(API_URL)
    socket.on("newHazard", handleNewHazard)

    return () => {
      socket.off("newHazard", handleNewHazard)
      socket.disconnect()
    }
  }, [handleNewHazard])

  return (
    <>
      <GlobalNotification notification={notification} onDismiss={dismissNotification} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Main" component={MainStackScreen} />
      </Stack.Navigator>
    </>
  )
}

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [userToken, setUserToken] = useState(null)

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token
      try {
        token = await AsyncStorage.getItem("userToken")
      } catch (e) {
        // Restoring token failed
      }
      setUserToken(token)
      setIsLoading(false)
    }

    bootstrapAsync()
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  )
}

export default App

