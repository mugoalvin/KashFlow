import { getStackScreenOptions } from "@/utils/screenOptions";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
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
			<Stack.Screen name="index" options={{
				title: "Dashboard",
				headerRight(props) {
					return (
						<IconButton
							icon={() => <MaterialIcons name="category" color={props.tintColor} size={18} />}
							onPress={() =>
								router.push('/categories')
								// router.push('/gesture')
							}
						/>
					)
				}
			}} />
			<Stack.Screen name="categories" options={{ title: "Categories" }} />
			<Stack.Screen name="gesture" options={{ title: "Gestures" }} />
		</Stack >
	)
}