"use client"

import { useState } from "react"
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native"
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { login } from "../utils/api"
import colors from "../utils/colors"

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password")
      return
    }

    setLoading(true)
    try {
      const response = await login(username, password)
      await AsyncStorage.setItem("userToken", response.token)
      await AsyncStorage.setItem("username", username)
      navigation.replace("Main")
    } catch (error) {
      console.error("Login error details:", error)
      Alert.alert("Login Failed", `Error: ${error.message}\n\nPlease check your network connection and try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <LinearGradient colors={[colors.primary, colors.accent]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.illustrationContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="car" size={60} color={colors.surface} />
            </View>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.subtitleText}>Login to your account</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              mode="outlined"
              style={styles.input}
              outlineColor={colors.primary}
              activeOutlineColor={colors.accent}
              left={<TextInput.Icon icon="account" color={colors.primary} />}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry
              outlineColor={colors.primary}
              activeOutlineColor={colors.accent}
              left={<TextInput.Icon icon="lock" color={colors.primary} />}
            />

            <TouchableOpacity onPress={() => console.log("Forgot password")}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color={colors.surface} /> : "LOGIN"}
            </Button>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.signupLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    padding: 20,
  },
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.surface,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: colors.surface,
    opacity: 0.8,
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  input: {
    marginBottom: 12,
    backgroundColor: colors.surface,
  },
  forgotText: {
    color: colors.accent,
    fontWeight: "600",
    textAlign: "right",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    color: colors.text,
  },
  signupLink: {
    color: colors.accent,
    fontWeight: "600",
  },
})

export default LoginScreen

