import { View, StyleSheet, ScrollView } from "react-native"
import { Text, Card, Title, Paragraph, Avatar, Button } from "react-native-paper"
import { LinearGradient } from "expo-linear-gradient"

const colors = {
  primary: "#FFD700",
  primaryLight: "#FFEB3B",
  background: "#FFFDE7",
  surface: "#FFFFFF",
  text: "#212121",
  textLight: "#757575",
}

const CommunityForumScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.header}>
        <Text style={styles.title}>Community Forum</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Avatar.Icon size={40} icon="bike" backgroundColor={colors.primary} />
              <Title style={styles.cardTitle}>New Bike Lane on Main Street</Title>
            </View>
            <Paragraph>Discussion about the newly added bike lane.</Paragraph>
            <View style={styles.cardFooter}>
              <Text style={styles.cardFooterText}>23 comments</Text>
              <Button mode="text" compact>
                Join Discussion
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Avatar.Icon size={40} icon="school" backgroundColor={colors.primary} />
              <Title style={styles.cardTitle}>School Zone Safety Concerns</Title>
            </View>
            <Paragraph>Parents discussing safety measures in school zones.</Paragraph>
            <View style={styles.cardFooter}>
              <Text style={styles.cardFooterText}>45 comments</Text>
              <Button mode="text" compact>
                Join Discussion
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Avatar.Icon size={40} icon="scooter" backgroundColor={colors.primary} />
              <Title style={styles.cardTitle}>E-scooter Parking Issues</Title>
            </View>
            <Paragraph>Debate on designated parking areas for e-scooters.</Paragraph>
            <View style={styles.cardFooter}>
              <Text style={styles.cardFooterText}>37 comments</Text>
              <Button mode="text" compact>
                Join Discussion
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
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
    padding: 20,
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    marginLeft: 10,
    color: colors.primary,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  cardFooterText: {
    color: colors.textLight,
  },
})

export default CommunityForumScreen

