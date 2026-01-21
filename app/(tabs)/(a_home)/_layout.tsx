import HeaderBackArrow from "@/components/navigation/header_back_arrow";
import HeaderRight from "@/components/navigation/header_right";
import { getStackScreenOptions } from "@/utils/screenOptions";
import { router, Stack } from "expo-router";
import { useTheme } from "react-native-paper";

export default function IndexLayout() {
	const theme = useTheme()

	return (
		<Stack
			screenOptions={{
				...getStackScreenOptions(theme),
				headerLeft: ({ canGoBack, tintColor }) => <HeaderBackArrow canGoBack={canGoBack || false} tintColor={tintColor!} />,
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					title: "Dashboard",
					headerRight: ({ tintColor }) => <HeaderRight
						tintColor={tintColor!}
						items={[{
							label: "Gesture",
							onPress: () => router.push('/gesture')
						}]}
					/>
				}}
			/>
			<Stack.Screen
				name="gesture"
				options={{
					title: "Gestures",
					headerRight: ({ tintColor }) => <HeaderRight tintColor={tintColor!} />
				}}
			/>
		</Stack >
	)
}