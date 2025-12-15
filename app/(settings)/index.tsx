import AnimationPreferences from "@/components/settings/animationSettings";
import GenaralSettings from "@/components/settings/generalSettings";
import NavigationSettings from "@/components/settings/navigationSettings";
import ThemeSettings from "@/components/settings/themeSettings";
import Body from "@/components/views/body";
import { useColorScheme } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Appbar, Divider, useTheme } from 'react-native-paper';

export default function Settings() {
	const theme = useTheme()
	const colorScheme = useColorScheme()

	// const bottomSheetRef = useRef<BottomSheetMethods>(null)
	// const snapPoints = useMemo(() => ['50%', '75%'], [])
	// const openSheet = () => bottomSheetRef.current?.snapToIndex(0)
	// const closeSheet = () => bottomSheetRef.current?.close()

	return (
		<>
			<Appbar.Header mode="medium" style={{ backgroundColor: colorScheme === "dark" ? theme.colors.elevation.level2 : theme.colors.elevation.level2 }}>
				<Appbar.Content title="Settings" titleMaxFontSizeMultiplier={2} />
			</Appbar.Header>

			<Body>
				<ScrollView>

					<GenaralSettings />
					<Divider horizontalInset />

					<AnimationPreferences />
					<Divider horizontalInset />

					<ThemeSettings />
					<Divider horizontalInset />

					<NavigationSettings />

				</ScrollView>
			</Body>
		</>
	)
}