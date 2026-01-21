import HeaderBackArrow from "@/components/navigation/header_back_arrow";
import HeaderRight from "@/components/navigation/header_right";
import useSnackbarContext from "@/contexts/SnackbarContext";
import { getStackScreenOptions } from "@/utils/screenOptions";
import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

export default function CategoriesLayout() {
	const theme = useTheme()
	const { showSnackbar } = useSnackbarContext()

	return (
		<Stack
			screenOptions={{
				...getStackScreenOptions(theme),
				headerLeft: ({ canGoBack, tintColor }) => <HeaderBackArrow canGoBack={canGoBack || false} tintColor={tintColor!} />,
				headerShown: true
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					title: "Categories",
					headerRight: ({ tintColor }) => <HeaderRight tintColor={tintColor!} />
				}}
			/>
			<Stack.Screen
				name="subCategory"
				options={{
					headerRight: ({ tintColor }) =>
						<HeaderRight
							tintColor={tintColor!}
							items={[
								{
									label: 'Label',
									onPress: () => {
										showSnackbar({
											message: 'Pressed',
										})
									}
								}
							]}
						/>
				}}
			/>
		</Stack>
	)
}