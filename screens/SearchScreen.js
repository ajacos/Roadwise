"use client"

import React from "react"
import { View, StyleSheet } from "react-native"
import { Text, Searchbar } from "react-native-paper"
import { LinearGradient } from "expo-linear-gradient"

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = React.useState("")

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#8B4513", "#FF8C00"]} style={styles.header}>
        <Text style={styles.title}>Search</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Searchbar
          placeholder="Search hazards, locations..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor="#8B4513"
          inputStyle={styles.searchInput}
        />

        <View style={styles.recentSearches}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          {/* Add recent searches list here */}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFDAB9",
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
    color: "#FFF5E6",
  },
  content: {
    padding: 20,
  },
  searchBar: {
    backgroundColor: "#FFF5E6",
    elevation: 0,
    borderWidth: 1,
    borderColor: "#8B4513",
  },
  searchInput: {
    color: "#3E2723",
  },
  recentSearches: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3E2723",
    marginBottom: 10,
  },
})

export default SearchScreen

