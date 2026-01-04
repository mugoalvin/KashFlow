import { getStackScreenOptions } from "@/utils/screenOptions";
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from "expo-router";
import { IconButton, useTheme } from "react-native-paper";

export default function IndexLayout() {
	const theme = useTheme()

	return (
		<Stack
			screenOptions={{
				...getStackScreenOptions(theme),
				headerLeft: ({ canGoBack }) => {
					return canGoBack && canGoBack && (
						<IconButton
							icon={({ color, size }) => <Ionicons name="arrow-back" size={size - 5} color={color} />}
							onPress={() => router.back()} />
					);
				}
			}}
		>
			<Stack.Screen name="index" options={{ title: "Dashboard" }} />
			<Stack.Screen name="categories" options={{ title: "Categories" }} />
			<Stack.Screen name="gesture" options={{ title: "Gestures" }} />
		</Stack >
	)
}