import { View, StyleSheet, ScrollView } from "react-native"
import { Text, Card, Title, Paragraph, Avatar } from "react-native-paper"
import { LinearGradient } from "expo-linear-gradient"
import colors from "../utils/colors"

const EducationScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.accent]} style={styles.header}>
        <Text style={styles.title}>Road Safety Education</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Avatar.Icon size={40} icon="sign-caution" backgroundColor={colors.primary} />
              <Title style={styles.cardTitle}>Traffic Signs</Title>
            </View>
            <Paragraph style={styles.cardText}>Learn about different traffic signs and their meanings.</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Avatar.Icon size={40} icon="walk" backgroundColor={colors.primary} />
              <Title style={styles.cardTitle}>Pedestrian Safety</Title>
            </View>
            <Paragraph style={styles.cardText}>Tips for staying safe as a pedestrian in traffic.</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Avatar.Icon size={40} icon="bike" backgroundColor={colors.primary} />
              <Title style={styles.cardTitle}>Cycling Rules</Title>
            </View>
            <Paragraph style={styles.cardText}>Essential rules and best practices for cyclists.</Paragraph>
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
    backgroundColor: colors.surface,
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
  cardText: {
    color: colors.text,
  },
})

export default EducationScreen

