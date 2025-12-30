import AddCategory from "@/components/userInput/addCategory";
import useBottomSheetContext from "@/contexts/BottomSheetContext";
import { getStackScreenOptions } from "@/utils/screenOptions";
// @ts-ignore
import { Ionicons } from '@expo/vector-icons';
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { router, Stack } from "expo-router";
import { IconButton, useTheme } from "react-native-paper";

export default function IndexLayout() {
	const theme = useTheme()
	const { openSheet } = useBottomSheetContext()

	return (
		<Stack
			screenOptions={{
				...getStackScreenOptions(theme),
				// @ts-ignore
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
			<Stack.Screen
				name="categories"
				options={{
					title: "Categories",
					headerRight(props) {
						return (
							<IconButton
								icon={() =>
									<MaterialDesignIcons name="plus" color={props.tintColor} size={20} />
								}
								onPress={() =>
									openSheet({
										content: <AddCategory />
									})
								}
							/>
						)
					},
				}} />
		</Stack >
	)
}