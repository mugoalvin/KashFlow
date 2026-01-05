import HeaderBackArrow from "@/components/navigation/header_back_arrow";
import HeaderRight from "@/components/navigation/header_right";
import { getStackScreenOptions } from "@/utils/screenOptions";
import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

export default function AnalysisLayout() {
	const theme = useTheme()

	return (
		<Stack
			screenOptions={{
				...getStackScreenOptions(theme),
				headerLeft: ({ canGoBack, tintColor }) => <HeaderBackArrow canGoBack={canGoBack || false} tintColor={tintColor!} />
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					title: "Transactions",
					headerRight: ({ tintColor }) => <HeaderRight tintColor={tintColor!} />
				}}
			/>
			<Stack.Screen
				name="weekTransactions"
				options={{
					headerRight: ({ tintColor }) => <HeaderRight tintColor={tintColor!} />
				}}
			/>
		</Stack >
	)
}