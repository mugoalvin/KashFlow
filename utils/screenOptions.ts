import { Material3Theme } from "@pchmn/expo-material3-theme";
import { MD3Theme } from "react-native-paper";

export function getTabScreenOptions(theme: Material3Theme, colorScheme: "light" | "dark") {
	return {
		headerStyle: {
			backgroundColor: theme[colorScheme].elevation.level1
		},
		headerTintColor: theme[colorScheme].onBackground,
		headerShadowVisible: false,
		headerShown: false,

		tabBarStyle: {
			backgroundColor: theme[colorScheme].elevation.level1,
			borderTopColor: theme[colorScheme].elevation.level1,
		},
		tabBarActiveTintColor: theme[colorScheme].tertiary,
		tabBarInactiveTintColor: theme[colorScheme].onBackground
	}
}

export function getStackScreenOptions(theme: MD3Theme) {
	return {
		headerStyle: {
			backgroundColor: theme.colors.elevation.level1
		},
		// headerTransparent: true,
		contentStyle: {
			// marginTop: -50
		},

		headerLargeTitle: true,
		headerTintColor: theme.colors.onBackground,
	}
}