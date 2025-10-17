import TransInfo from "@/components/information/transInfo";
import Body from "@/components/views/body";
import { useLocalSearchParams, useNavigation } from "expo-router";
import moment from "moment";
import { useLayoutEffect } from "react";
import { FlatList, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function AnalysisMore() {
	const theme = useTheme()
	const navigation = useNavigation()
	const { date, transactions } = useLocalSearchParams()
	const daysTransactions = JSON.parse(transactions as string)

	useLayoutEffect(() => {
		navigation.setOptions({
			title: moment(date).format('ddd')
		})
	}, [])

	return (
		<Body >

			<FlatList
				data={daysTransactions}
				renderItem={({ item, index }) => (
					<TransInfo
						item={item}
						index={index }
						length={daysTransactions.length }
					/>
				)}
				ListEmptyComponent={
					<View className="h-24 items-center justify-center">
						<Text style={{ color: theme.colors.onPrimaryContainer }}>No Transactions Made This Day</Text>
					</View>
				}
			/>

		</Body>
	)
}