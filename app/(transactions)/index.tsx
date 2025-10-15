import Body from "@/components/views/body";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { useEffect } from "react";
import { IconButton } from "react-native-paper";

export default function Transactions() {
	const navigation = useNavigation()

	useEffect(() => {
		navigation.setOptions({
			headerRight: () =>
				<IconButton
					icon={({ color, size }) => <Ionicons name="arrow-redo-outline" color={color} size={size - 5} />}
					onPress={() => router.push('/(transactions)/analysis_more')}
				/>
		})
	}, [navigation])

	return (
		<Body className="items-center" />
	)
}