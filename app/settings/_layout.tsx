import HeaderBackArrow from "@/components/navigation/header_back_arrow";
import { getStackScreenOptions } from "@/utils/screenOptions";
import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

export default function SettingsLayout() {
	const theme = useTheme()

	return (
		<Stack
			screenOptions={{
				...getStackScreenOptions(theme),
				headerLeft: ({ canGoBack, tintColor }) => <HeaderBackArrow canGoBack={canGoBack || false} tintColor={tintColor!} />,
				headerShown: false
			}}
		>
			<Stack.Screen name="index" options={{ title: "Settings" }} />
		</Stack>
	)
}