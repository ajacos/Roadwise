const API_URL = "http://ajserber.duckdns.org:5000/api" // Replace with your actual API URL
import AsyncStorage from "@react-native-async-storage/async-storage"

const getAuthToken = async () => {
  return await AsyncStorage.getItem("userToken")
}

export const signup = async (username, email, password) => {
  console.log("Signup attempt for username:", username)
  try {
    const url = `${API_URL}/auth/register`
    console.log("Sending request to:", url)
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    })

    console.log("Response status:", response.status)
    console.log("Response headers:", JSON.stringify(response.headers.map))

    const responseText = await response.text()
    console.log("Raw response:", responseText)

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError)
      throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`)
    }

    if (!response.ok) {
      throw new Error(data.message || "Signup failed")
    }

    return data
  } catch (error) {
    console.error("Signup error:", error)
    throw error
  }
}

export const login = async (username, password) => {
  try {
    console.log("Attempting login for user:", username)
    console.log("API URL:", API_URL)

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    console.log("Response status:", response.status)
    console.log("Response headers:", JSON.stringify(response.headers))

    const responseText = await response.text()
    console.log("Raw response:", responseText)

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError)
      throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`)
    }

    if (!response.ok) {
      throw new Error(data.message || "Login failed")
    }

    return data
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

export const reportHazard = async (hazardData) => {
  try {
    const token = await getAuthToken()
    const response = await fetch(`${API_URL}/hazards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(hazardData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to report hazard")
    }

    return await response.json()
  } catch (error) {
    console.error("Error reporting hazard:", error)
    throw error
  }
}

export const fetchHazards = async () => {
  try {
    const token = await getAuthToken()
    const response = await fetch(`${API_URL}/hazards`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch hazards")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching hazards:", error)
    throw error
  }
}

export const fetchNotifications = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken")
    const response = await fetch(`${API_URL}/hazards/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch notifications")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching notifications:", error)
    throw error
  }
}