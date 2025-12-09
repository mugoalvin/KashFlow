import AnimationPreferences from "@/components/settings/paperAccordion";
import ThemeSettings from "@/components/settings/themeSettings";
import Body from "@/components/views/body";
import { useColorScheme } from "react-native";
import { Appbar, useTheme } from 'react-native-paper';

export default function Settings() {
	const theme = useTheme()
	const colorScheme = useColorScheme()

	return (
		<>
			<Appbar.Header mode="medium" style={{ backgroundColor: colorScheme === "dark" ? theme.colors.elevation.level2 : theme.colors.elevation.level2 }}>
				<Appbar.Content title="Settings" titleMaxFontSizeMultiplier={2} />
			</Appbar.Header>


			<Body className="p-0">
				<AnimationPreferences />
				<ThemeSettings />
			</Body>
		</>
	)
}

{/*

============TODO Options/Settings============
1. Animation Preferences
2. Theme Settings
3. Graph Settings
	-Data Point Visibility
4. Tab View
	-Horizontal Scrollability
	-Animation Type
5. Home Screens Balance Visibility Preference
6. Bottom Tab Navigation label visibility mode
*/}