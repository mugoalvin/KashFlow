import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { IconButton, useTheme } from "react-native-paper";

export default function IndexLayout() {
	const theme = useTheme()

	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: theme.colors.elevation.level1
				},
				// headerTransparent: true,
				contentStyle: {
					// marginTop: -50
				},

				headerLargeTitle: true,
				headerTintColor: theme.colors.onBackground,
				headerLeft: ({ canGoBack }) => {
					return canGoBack && canGoBack && (
						<IconButton
							icon={({ color, size }) => <Ionicons name="arrow-back" size={size - 5} color={color} />} // chevron-back
							onPress={() => router.back()} />
					);
				}
			}}
		>
			<Stack.Screen name="index" options={{ title: "Home" }} />
			<Stack.Screen name="page" options={{ title: "Page 2" }} />
		</Stack >
	)
}