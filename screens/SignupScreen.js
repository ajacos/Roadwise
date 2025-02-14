"use client"

import { useState } from "react"
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { signup } from "../utils/api"

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    setError("")
    try {
      const response = await signup(username, email, password)
      await AsyncStorage.setItem("userToken", response.token)
      await AsyncStorage.setItem("username", username)
      navigation.replace("Main")
    } catch (error) {
      console.error("Signup error:", error)
      setError(`Signup failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <LinearGradient colors={["#8B4513", "#FF8C00"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.illustrationContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={60} color="#FFF5E6" />
            </View>
            <Text style={styles.registerText}>Register</Text>
            <Text style={styles.subtitleText}>Create your account</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              mode="outlined"
              style={styles.input}
              outlineColor="#8B4513"
              activeOutlineColor="#FF8C00"
              left={<TextInput.Icon icon="account" color="#8B4513" />}
            />
            <TextInput
              label="Email address"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              outlineColor="#8B4513"
              activeOutlineColor="#FF8C00"
              left={<TextInput.Icon icon="email" color="#8B4513" />}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry
              outlineColor="#8B4513"
              activeOutlineColor="#FF8C00"
              left={<TextInput.Icon icon="lock" color="#8B4513" />}
            />
            <TextInput
              label="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry
              outlineColor="#8B4513"
              activeOutlineColor="#FF8C00"
              left={<TextInput.Icon icon="lock-check" color="#8B4513" />}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Text style={styles.termsText}>
              By registering, you are agreeing to our Terms of use and Privacy Policy.
            </Text>

            <Button
              mode="contained"
              onPress={handleSignup}
              style={styles.registerButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFF5E6" /> : "REGISTER"}
            </Button>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>Login</Text>
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
  registerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF5E6",
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: "#FFF5E6",
    opacity: 0.8,
  },
  formContainer: {
    backgroundColor: "#FFF5E6",
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
    backgroundColor: "#FFF5E6",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  termsText: {
    fontSize: 12,
    color: "#3E2723",
    textAlign: "center",
    marginVertical: 20,
  },
  registerButton: {
    backgroundColor: "#FF8C00",
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    color: "#3E2723",
  },
  loginLink: {
    color: "#FF8C00",
    fontWeight: "600",
  },
})

export default SignupScreen

