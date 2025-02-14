import { Appbar } from "react-native-paper"
import { colors } from "../utils/colors"

const Header = ({ title, navigation, back }) => {
  return (
    <Appbar.Header style={{ backgroundColor: colors.primary }}>
      {back ? <Appbar.BackAction onPress={navigation.goBack} color={colors.text} /> : null}
      <Appbar.Content title={title} titleStyle={{ color: colors.text, fontWeight: "bold" }} />
    </Appbar.Header>
  )
}

export default Header

