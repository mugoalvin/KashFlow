import { getStackScreenOptions } from "@/utils/screenOptions";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { IconButton, useTheme } from "react-native-paper";

export default function SettingsLayout() {
	const theme = useTheme()

	return (
		<Stack
			screenOptions={{
				...getStackScreenOptions(theme),
				headerLeft: ({ canGoBack }) => {
					return canGoBack && canGoBack && (
						<IconButton
							icon={({ color, size }) => <Ionicons name="arrow-back" size={size} color={color} />}
							onPress={() => router.back()}
						/>
					)
				},
				headerShown: false
			}}
		>
			<Stack.Screen name="index" options={{ title: "Settings" }} />
			<Stack.Screen name="pickTheme" options={{ title: "Theme" }} />
		</Stack>
	)
}