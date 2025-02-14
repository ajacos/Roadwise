import { BottomNavigation } from "react-native-paper"
import { colors } from "../utils/colors"

const BottomNav = ({ state, descriptors, navigation }) => {
  return (
    <BottomNavigation
      navigationState={state}
      onIndexChange={(index) => navigation.navigate(state.routes[index].name)}
      renderScene={BottomNavigation.SceneMap({
        Home: () => null,
        IncidentReport: () => null,
        HazardMap: () => null,
        Education: () => null,
        CommunityForum: () => null,
      })}
      barStyle={{ backgroundColor: colors.primary }}
      activeColor={colors.accent}
      inactiveColor={colors.text}
    />
  )
}

export default BottomNav

